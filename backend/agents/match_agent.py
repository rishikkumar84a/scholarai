"""Match Agent.

Embeds the user profile, searches the Supabase vector store,
and evaluates eligibility using an LLM to provide match reasons and scores.
"""

from __future__ import annotations

import json
import os
from typing import Any

from openai import OpenAI
from pydantic import BaseModel, Field

from backend.agents.profile_agent import AcademicProfile
from backend.db.supabase_client import get_supabase_client
from backend.utils.embeddings import embed_text

DEFAULT_MODEL = "gpt-4o"


class MatchedScholarship(BaseModel):
    """A scholarship matched to a user profile, with evaluation details."""
    
    id: str = Field(description="The UUID of the scholarship from the database.")
    name: str = Field(description="The name of the scholarship.")
    country: str = Field(description="The host country.")
    match_score: int = Field(description="Score from 0 to 100 representing how well the profile matches the scholarship.")
    eligible: bool = Field(description="Whether the user is fully eligible based on their profile.")
    reasons: list[str] = Field(description="A list of 2-3 reasons why this is a good match.")
    deadline: str = Field(description="Application deadline.")
    link: str = Field(description="URL to the scholarship details.")
    missing_requirements: list[str] = Field(description="Any requirements the user is missing or might struggle with.")


class MatchResult(BaseModel):
    """The final result containing a list of matched scholarships."""
    
    matches: list[MatchedScholarship]


class MatchAgentError(RuntimeError):
    """Raised when the match agent fails to retrieve or evaluate scholarships."""


def _get_client() -> OpenAI:
    """Return an OpenAI client using the OPENAI_API_KEY env var."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise MatchAgentError("Missing required environment variable: OPENAI_API_KEY")
    return OpenAI(api_key=api_key)


def get_top_scholarships(profile: AcademicProfile, match_count: int = 10, model: str = DEFAULT_MODEL) -> MatchResult:
    """Finds the best scholarships for a given profile and evaluates eligibility.

    Parameters
    ----------
    profile:
        The structured academic profile.
    match_count:
        Number of top scholarships to retrieve from the DB before filtering.
    model:
        The OpenAI model to use for the evaluation step.

    Returns
    -------
    MatchResult
        The evaluated and formatted top scholarships.
    """
    # 1. Embed the profile
    profile_json = profile.model_dump_json(exclude_none=True)
    try:
        query_embedding = embed_text(profile_json)
    except Exception as exc:
        raise MatchAgentError(f"Failed to embed profile: {exc}") from exc

    # 2. Query Supabase
    supabase = get_supabase_client("service")
    try:
        response = supabase.rpc(
            "match_scholarships",
            {"query_embedding": query_embedding, "match_count": match_count}
        ).execute()
        retrieved_scholarships = response.data
    except Exception as exc:
        raise MatchAgentError(f"Supabase RPC failed: {exc}") from exc

    if not retrieved_scholarships:
        return MatchResult(matches=[])

    # 3. Evaluate with LLM
    client = _get_client()
    
    system_prompt = (
        "You are an expert scholarship advisor. You are given a user's academic profile and "
        "a list of top matched scholarships retrieved from a vector database (including vector similarity). "
        "Evaluate each scholarship against the user profile. Determine if they are 'eligible', "
        "calculate a 'match_score' (0-100) combining the vector similarity and your logical reasoning, "
        "provide 'reasons' for the match, and list any 'missing_requirements'. "
        "Return the evaluation for ALL retrieved scholarships in the structured format."
    )
    
    user_prompt = f"Profile:\n{profile_json}\n\nRetrieved Scholarships:\n{json.dumps(retrieved_scholarships, indent=2)}"

    try:
        completion = client.beta.chat.completions.parse(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format=MatchResult,
        )
    except Exception as exc:
        raise MatchAgentError(f"LLM evaluation failed: {exc}") from exc

    result = completion.choices[0].message.parsed
    if not result:
        raise MatchAgentError("Model returned empty parsed response")

    # Sort by match_score descending
    result.matches.sort(key=lambda m: m.match_score, reverse=True)
    return result
