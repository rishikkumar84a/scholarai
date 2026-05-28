"""Papers API routes."""

from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel, Field

from backend.agents.paper_agent import PaperSummary, PaperAgentError, summarize_paper

router = APIRouter()


class SummarizeTextRequest(BaseModel):
    """Request body for summarizing from text or URL."""

    source: str = Field(..., min_length=1, description="Raw paper text or a URL to a PDF.")
    user_context: str | None = Field(None, description="Optional user research context.")


class SummarizeResponse(BaseModel):
    """Response for paper summarization."""

    summary: PaperSummary


@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_paper_route(body: SummarizeTextRequest):
    """Summarize a paper from text or URL."""
    try:
        summary = summarize_paper(body.source, user_context=body.user_context)
    except PaperAgentError as exc:
        raise HTTPException(status_code=502, detail=str(exc))
    return SummarizeResponse(summary=summary)


@router.post("/summarize/upload", response_model=SummarizeResponse)
async def summarize_paper_upload(
    file: UploadFile = File(...),
    user_context: str | None = Form(None),
):
    """Summarize a paper from an uploaded PDF file."""
    if not file.filename or not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=422, detail="Only PDF files are supported.")
    try:
        pdf_bytes = await file.read()
        summary = summarize_paper(pdf_bytes, user_context=user_context)
    except PaperAgentError as exc:
        raise HTTPException(status_code=502, detail=str(exc))
    return SummarizeResponse(summary=summary)
