"""OpenAI embedding utilities for ScholarAI.

Provides a thin wrapper around the OpenAI embeddings API so that every
part of the codebase generates vectors with the same model and
dimensionality.
"""

from __future__ import annotations

import os
from typing import Sequence

from openai import OpenAI

# Default model per PRD — fast, cheap, 1536-dim vectors.
DEFAULT_MODEL = "text-embedding-3-small"


class EmbeddingError(RuntimeError):
    """Raised when the embedding API call fails."""


def _get_client() -> OpenAI:
    """Return an OpenAI client using the OPENAI_API_KEY env var."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise EmbeddingError("Missing required environment variable: OPENAI_API_KEY")
    return OpenAI(api_key=api_key)


def embed_text(text: str, *, model: str = DEFAULT_MODEL) -> list[float]:
    """Return the embedding vector for a single text string.

    Parameters
    ----------
    text:
        The input text to embed.  Leading/trailing whitespace is stripped.
    model:
        The OpenAI embedding model to use.

    Returns
    -------
    list[float]
        A 1536-dimensional vector (for text-embedding-3-small).

    Raises
    ------
    EmbeddingError
        If the API call fails or returns an unexpected response.
    ValueError
        If *text* is empty after stripping.
    """
    text = text.strip()
    if not text:
        raise ValueError("Cannot embed empty text")

    client = _get_client()
    try:
        response = client.embeddings.create(input=[text], model=model)
    except Exception as exc:
        raise EmbeddingError(f"OpenAI embedding request failed: {exc}") from exc

    return response.data[0].embedding


def embed_texts(
    texts: Sequence[str], *, model: str = DEFAULT_MODEL
) -> list[list[float]]:
    """Return embedding vectors for multiple texts in a single API call.

    Parameters
    ----------
    texts:
        A sequence of input strings.  Each is stripped individually.
    model:
        The OpenAI embedding model to use.

    Returns
    -------
    list[list[float]]
        One 1536-dimensional vector per input text.

    Raises
    ------
    EmbeddingError
        If the API call fails.
    ValueError
        If *texts* is empty or any element is blank after stripping.
    """
    if not texts:
        raise ValueError("texts must be a non-empty sequence")

    cleaned = [t.strip() for t in texts]
    for i, t in enumerate(cleaned):
        if not t:
            raise ValueError(f"Text at index {i} is empty after stripping")

    client = _get_client()
    try:
        response = client.embeddings.create(input=cleaned, model=model)
    except Exception as exc:
        raise EmbeddingError(f"OpenAI embedding request failed: {exc}") from exc

    # The API may return results in arbitrary order; sort by index.
    sorted_data = sorted(response.data, key=lambda d: d.index)
    return [d.embedding for d in sorted_data]
