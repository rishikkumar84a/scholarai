"""Profile Agent.

Parses a user's academic profile from unstructured text (or resume) into a structured format
using OpenAI's structured outputs.
"""

from __future__ import annotations

import os
from typing import Optional

from openai import OpenAI
from pydantic import BaseModel, Field

DEFAULT_MODEL = "gpt-4o"


class AcademicProfile(BaseModel):
    """Structured academic profile of a user."""
    
    name: Optional[str] = Field(None, description="Full name of the user, if available.")
    gpa: Optional[float] = Field(None, description="The user's Grade Point Average (GPA) or equivalent academic score. Convert to a 4.0 scale if possible, otherwise extract raw number.")
    field_of_study: Optional[str] = Field(None, description="The primary major, field of study, or research area.")
    country: Optional[str] = Field(None, description="The user's country of origin or current residence.")
    degree_level: Optional[str] = Field(None, description="The current or target degree level (e.g., 'undergraduate', 'masters', 'phd').")
    skills: list[str] = Field(default_factory=list, description="A list of technical, academic, or language skills.")
    research_interests: list[str] = Field(default_factory=list, description="A list of research interests or academic focus areas.")


class ProfileAgentError(RuntimeError):
    """Raised when profile extraction fails."""


def _get_client() -> OpenAI:
    """Return an OpenAI client using the OPENAI_API_KEY env var."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ProfileAgentError("Missing required environment variable: OPENAI_API_KEY")
    return OpenAI(api_key=api_key)


def parse_profile(text: str, *, model: str = DEFAULT_MODEL) -> AcademicProfile:
    """Parse unstructured text into a structured academic profile.

    Parameters
    ----------
    text:
        Unstructured profile data (e.g., from a form, resume, or conversational input).
    model:
        The OpenAI model to use.

    Returns
    -------
    AcademicProfile
        The structured profile object.

    Raises
    ------
    ProfileAgentError
        If the API call fails or structured parsing fails.
    ValueError
        If the input text is empty.
    """
    text = text.strip()
    if not text:
        raise ValueError("Cannot parse empty profile text")

    client = _get_client()
    
    try:
        completion = client.beta.chat.completions.parse(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an academic profile extraction assistant. Extract the user's "
                        "academic profile from the provided text into a structured format. "
                        "If a piece of information is not present, leave it null/empty. "
                        "Map degree levels to 'undergraduate', 'masters', or 'phd' if possible."
                    ),
                },
                {"role": "user", "content": text},
            ],
            response_format=AcademicProfile,
        )
    except Exception as exc:
        raise ProfileAgentError(f"Failed to parse profile: {exc}") from exc

    profile = completion.choices[0].message.parsed
    if profile is None:
        raise ProfileAgentError("Model returned empty parsed response")
        
    return profile
