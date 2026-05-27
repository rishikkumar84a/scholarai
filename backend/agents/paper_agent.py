"""Paper Agent.

Summarizes a research paper from raw text, a file path, or a URL, extracting
key findings, methodology, and relevance to the user using OpenAI structured outputs.
"""

from __future__ import annotations

import os
import urllib.request
from pathlib import Path
from typing import Any

from openai import OpenAI
from pydantic import BaseModel, Field

from backend.utils.pdf_parser import extract_text_from_pdf

DEFAULT_MODEL = "gpt-4o"


class PaperSummary(BaseModel):
    """Structured summary of a research paper."""
    
    title: str = Field(description="The title of the research paper.")
    one_line_summary: str = Field(description="A concise one-line summary (under 100 words).")
    problem_statement: str = Field(description="The main problem or research gap the paper addresses.")
    methodology: str = Field(description="A brief description of the methodology used.")
    key_findings: list[str] = Field(description="A list of 3-5 key findings or results.")
    limitations: str = Field(description="Any limitations mentioned by the authors.")
    relevance_to_user: str = Field(description="How this paper is relevant to the user's research interests (if provided), or general significance.")
    key_citations: list[str] = Field(description="Important citations/references from the paper with brief context (e.g. 'Author et al. (2023) — Context').")
    further_reading: list[str] = Field(description="Suggested topics or papers for further reading.")


class PaperAgentError(RuntimeError):
    """Raised when paper parsing or summarization fails."""


def _get_client() -> OpenAI:
    """Return an OpenAI client using the OPENAI_API_KEY env var."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise PaperAgentError("Missing required environment variable: OPENAI_API_KEY")
    return OpenAI(api_key=api_key)


def _fetch_pdf_bytes_from_url(url: str) -> bytes:
    """Download PDF bytes from a URL."""
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as response:
            return response.read()
    except Exception as exc:
        raise PaperAgentError(f"Failed to download PDF from {url}: {exc}") from exc


def summarize_paper(
    source: str | Path | bytes, 
    user_context: str | None = None,
    model: str = DEFAULT_MODEL
) -> PaperSummary:
    """Extract text from a source and generate a structured summary.

    Parameters
    ----------
    source:
        Can be raw paper text (if very long, will be truncated by LLM limits),
        a file path to a local PDF, or a URL pointing to a PDF.
    user_context:
        Optional context about the user's research interests to personalize the relevance section.
    model:
        The OpenAI model to use.

    Returns
    -------
    PaperSummary
        The structured summary.
    """
    text = ""

    if isinstance(source, bytes):
        try:
            text = extract_text_from_pdf(source)
        except Exception as exc:
            raise PaperAgentError(f"Failed to parse PDF bytes: {exc}") from exc
    elif isinstance(source, Path):
        try:
            text = extract_text_from_pdf(source)
        except Exception as exc:
            raise PaperAgentError(f"Failed to parse PDF file: {exc}") from exc
    elif isinstance(source, str):
        source = source.strip()
        if source.startswith("http://") or source.startswith("https://"):
            pdf_bytes = _fetch_pdf_bytes_from_url(source)
            try:
                text = extract_text_from_pdf(pdf_bytes)
            except Exception as exc:
                raise PaperAgentError(f"Failed to parse downloaded PDF: {exc}") from exc
        elif source.endswith(".pdf") and os.path.exists(source):
            try:
                text = extract_text_from_pdf(source)
            except Exception as exc:
                raise PaperAgentError(f"Failed to parse PDF file: {exc}") from exc
        else:
            # Assume it's raw text
            text = source

    if not text.strip():
        raise PaperAgentError("No extractable text found in the source.")

    # In production, we might want to truncate text to fit the context window,
    # but GPT-4o has 128k context so it can handle most standard papers.
    # We will truncate to 100,000 chars just as a safety net.
    safe_text = text[:100000]

    client = _get_client()
    
    system_prompt = (
        "You are an expert AI research assistant. Your task is to read a provided research paper "
        "and generate a highly structured, accurate summary. Extrapolate the key findings, "
        "methodology, and problem statement clearly. "
    )
    if user_context:
        system_prompt += f"Pay special attention to how this paper relates to this user context: {user_context}."
    else:
        system_prompt += "Since no user context was provided, evaluate its general significance for the field."

    try:
        completion = client.beta.chat.completions.parse(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Please summarize the following paper text:\n\n{safe_text}"},
            ],
            response_format=PaperSummary,
        )
    except Exception as exc:
        raise PaperAgentError(f"LLM summarization failed: {exc}") from exc

    summary = completion.choices[0].message.parsed
    if not summary:
        raise PaperAgentError("Model returned empty parsed response")

    return summary
