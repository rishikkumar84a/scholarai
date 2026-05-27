"""PDF parsing utility for ScholarAI."""

from __future__ import annotations

import io
from pathlib import Path
from typing import IO

import pypdf


class PdfParseError(RuntimeError):
    """Raised when PDF parsing fails."""


def extract_text_from_pdf(source: str | Path | bytes | IO[bytes]) -> str:
    """Extract text from a PDF document.

    Parameters
    ----------
    source:
        A file path (str or Path), raw PDF bytes, or an open binary IO stream.

    Returns
    -------
    str
        The extracted text, with pages joined by newlines.

    Raises
    ------
    PdfParseError
        If the file is not a valid PDF or extraction fails.
    """
    stream = None
    close_stream = False
    
    try:
        if isinstance(source, (str, Path)):
            stream = open(source, "rb")
            close_stream = True
        elif isinstance(source, bytes):
            stream = io.BytesIO(source)
            close_stream = True
        else:
            # Assume it's an IO stream
            stream = source

        try:
            reader = pypdf.PdfReader(stream)
        except Exception as exc:
            raise PdfParseError(f"Failed to read PDF: {exc}") from exc
        
        texts = []
        for page in reader.pages:
            try:
                page_text = page.extract_text()
                if page_text:
                    texts.append(page_text)
            except Exception as exc:
                raise PdfParseError(f"Failed to extract text from page: {exc}") from exc
                
        return "\n\n".join(texts)

    finally:
        if close_stream and stream is not None:
            stream.close()
