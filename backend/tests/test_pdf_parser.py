"""Tests for the PDF parsing utility."""

from __future__ import annotations

import io
from pathlib import Path

import pytest

from backend.utils import pdf_parser


class FakePage:
    def __init__(self, text: str):
        self._text = text

    def extract_text(self) -> str:
        if self._text == "FAIL":
            raise RuntimeError("Fake extraction error")
        return self._text


class FakePdfReader:
    def __init__(self, stream):
        # Determine if it's a valid fake stream
        if hasattr(stream, "read"):
            content = stream.read()
            if b"INVALID" in content:
                raise ValueError("Invalid PDF structure")
        
        # Fake pages
        self.pages = [FakePage("Page 1 Text"), FakePage("Page 2 Text")]


def test_extract_text_from_bytes(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(pdf_parser.pypdf, "PdfReader", FakePdfReader)
    
    pdf_bytes = b"dummy pdf content"
    result = pdf_parser.extract_text_from_pdf(pdf_bytes)
    assert result == "Page 1 Text\n\nPage 2 Text"


def test_extract_text_from_io(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(pdf_parser.pypdf, "PdfReader", FakePdfReader)
    
    stream = io.BytesIO(b"dummy pdf content")
    result = pdf_parser.extract_text_from_pdf(stream)
    assert result == "Page 1 Text\n\nPage 2 Text"
    # Ensure stream was not closed by the function if it wasn't opened by it
    assert not stream.closed


def test_extract_text_from_file_path(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    monkeypatch.setattr(pdf_parser.pypdf, "PdfReader", FakePdfReader)
    
    pdf_path = tmp_path / "test.pdf"
    pdf_path.write_bytes(b"dummy pdf content")
    
    result = pdf_parser.extract_text_from_pdf(pdf_path)
    assert result == "Page 1 Text\n\nPage 2 Text"


def test_invalid_pdf_raises_error(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(pdf_parser.pypdf, "PdfReader", FakePdfReader)
    
    with pytest.raises(pdf_parser.PdfParseError, match="Failed to read PDF"):
        pdf_parser.extract_text_from_pdf(b"INVALID PDF")


def test_page_extraction_failure(monkeypatch: pytest.MonkeyPatch) -> None:
    class FailingPdfReader:
        def __init__(self, stream):
            self.pages = [FakePage("Page 1"), FakePage("FAIL")]

    monkeypatch.setattr(pdf_parser.pypdf, "PdfReader", FailingPdfReader)
    
    with pytest.raises(pdf_parser.PdfParseError, match="Failed to extract text from page"):
        pdf_parser.extract_text_from_pdf(b"dummy")
