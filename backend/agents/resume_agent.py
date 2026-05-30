"""Resume Agent.

Analyzes a resume or CV using OpenAI structured outputs.
Provides an overall score, strengths, weaknesses, and actionable suggestions
for improving it for scholarship applications.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

from openai import OpenAI
from pydantic import BaseModel, Field

from backend.utils.pdf_parser import extract_text_from_pdf

DEFAULT_MODEL = "gpt-4o"


class ResumeAnalysisResult(BaseModel):
    """Structured feedback for a resume/CV."""

    overallScore: int = Field(description="An overall score for the resume from 0 to 100 based on scholarship readiness.")
    strengths: list[str] = Field(description="A list of 3-5 strengths of the resume.")
    weaknesses: list[str] = Field(description="A list of 3-5 weaknesses or areas for improvement.")
    suggestions: list[str] = Field(description="A list of 3-5 specific, actionable suggestions to improve the resume.")


class ResumeAgentError(RuntimeError):
    """Raised when resume parsing or analysis fails."""


def _get_client() -> OpenAI:
    """Return an OpenAI client using the OPENAI_API_KEY env var."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ResumeAgentError("Missing required environment variable: OPENAI_API_KEY")
    return OpenAI(api_key=api_key)


def analyze_resume(
    source: str | Path | bytes,
    target_program: str | None = None,
    model: str = DEFAULT_MODEL
) -> ResumeAnalysisResult:
    """Extract text from a source and generate a structured analysis.

    Parameters
    ----------
    source:
        Can be raw resume text, a file path to a local PDF, or PDF bytes.
    target_program:
        Optional context about the user's target program/scholarship.
    model:
        The OpenAI model to use.

    Returns
    -------
    ResumeAnalysisResult
        The structured analysis.
    """
    text = ""

    if isinstance(source, bytes):
        try:
            text = extract_text_from_pdf(source)
        except Exception as exc:
            raise ResumeAgentError(f"Failed to parse PDF bytes: {exc}") from exc
    elif isinstance(source, Path):
        try:
            text = extract_text_from_pdf(source)
        except Exception as exc:
            raise ResumeAgentError(f"Failed to parse PDF file: {exc}") from exc
    elif isinstance(source, str):
        source = source.strip()
        if source.endswith(".pdf") and os.path.exists(source):
            try:
                text = extract_text_from_pdf(source)
            except Exception as exc:
                raise ResumeAgentError(f"Failed to parse PDF file: {exc}") from exc
        else:
            # Assume it's raw text
            text = source

    if not text.strip():
        raise ResumeAgentError("No extractable text found in the source.")

    safe_text = text[:100000]

    client = _get_client()

    system_prompt = (
        "You are an expert admissions consultant and career coach. Your task is to evaluate "
        "a resume or CV provided by a student applying for scholarships or graduate programs. "
        "Provide an overall score out of 100 based on how competitive this resume is. "
        "Identify key strengths, weaknesses, and actionable suggestions for improvement."
    )
    if target_program:
        system_prompt += f"\n\nThe applicant is specifically targeting: {target_program}. Tailor your feedback to this context."

    try:
        completion = client.beta.chat.completions.parse(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Here is the text extracted from the resume:\n\n{safe_text}"},
            ],
            response_format=ResumeAnalysisResult,
        )
    except Exception as exc:
        raise ResumeAgentError(f"LLM analysis failed: {exc}") from exc

    result = completion.choices[0].message.parsed
    if not result:
        raise ResumeAgentError("Model returned empty parsed response")

    return result
