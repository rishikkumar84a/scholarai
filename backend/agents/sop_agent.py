"""SOP Agent.

Analyzes a Statement of Purpose (SOP) on 5 key dimensions:
clarity, fit, motivation, specificity, and grammar.
Returns scores, detailed feedback, and an improved rewritten version.
"""

from __future__ import annotations

import os

from openai import OpenAI
from pydantic import BaseModel, Field

DEFAULT_MODEL = "gpt-4o"


class SOPDimensionScore(BaseModel):
    """Score and feedback for a single dimension."""
    
    score: int = Field(description="Score from 0 to 10.")
    feedback: str = Field(description="Detailed feedback explaining the score and how to improve.")


class SOPScore(BaseModel):
    """Evaluation of an SOP across 5 dimensions."""
    
    clarity: SOPDimensionScore = Field(description="Clarity of purpose and narrative flow.")
    fit: SOPDimensionScore = Field(description="Fit with the target program or scholarship.")
    motivation: SOPDimensionScore = Field(description="Authenticity and strength of the applicant's motivation.")
    specificity: SOPDimensionScore = Field(description="Specificity of goals and past experiences (avoiding vague statements).")
    grammar: SOPDimensionScore = Field(description="Language quality, grammar, and professional tone.")


class SOPAnalysisResult(BaseModel):
    """The full analysis result including scores and a rewritten version."""
    
    scores: SOPScore = Field(description="The evaluation scores and feedback.")
    improved_sop: str = Field(description="A fully rewritten, improved version of the SOP incorporating the feedback.")


class SOPAgentError(RuntimeError):
    """Raised when SOP analysis fails."""


def _get_client() -> OpenAI:
    """Return an OpenAI client using the OPENAI_API_KEY env var."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise SOPAgentError("Missing required environment variable: OPENAI_API_KEY")
    return OpenAI(api_key=api_key)


def analyze_sop(
    sop_text: str, 
    target_program: str | None = None,
    model: str = DEFAULT_MODEL
) -> SOPAnalysisResult:
    """Evaluate an SOP and generate improvements.

    Parameters
    ----------
    sop_text:
        The draft Statement of Purpose text.
    target_program:
        Optional context about the target scholarship or degree program.
    model:
        The OpenAI model to use.

    Returns
    -------
    SOPAnalysisResult
        The scores, feedback, and rewritten SOP.
    """
    if not sop_text.strip():
        raise ValueError("SOP text cannot be empty.")

    client = _get_client()
    
    system_prompt = (
        "You are an expert admissions consultant and essay reviewer. Your task is to evaluate "
        "a draft Statement of Purpose (SOP) and provide constructive feedback across 5 dimensions: "
        "clarity, fit, motivation, specificity, and grammar. Score each dimension from 0 to 10. "
        "After providing feedback, rewrite the entire SOP to significantly improve its quality, "
        "flow, and impact, while retaining the applicant's core experiences and voice."
    )
    if target_program:
        system_prompt += f"\n\nThe applicant is targeting the following program/scholarship: {target_program}. Ensure the 'fit' dimension and the rewrite align with this target."

    try:
        completion = client.beta.chat.completions.parse(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Here is the draft SOP:\n\n{sop_text}"},
            ],
            response_format=SOPAnalysisResult,
        )
    except Exception as exc:
        raise SOPAgentError(f"LLM analysis failed: {exc}") from exc

    result = completion.choices[0].message.parsed
    if not result:
        raise SOPAgentError("Model returned empty parsed response")

    return result
