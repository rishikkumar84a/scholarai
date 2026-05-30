"""Resume API routes."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, UploadFile, File, Form

from backend.agents.resume_agent import ResumeAnalysisResult, ResumeAgentError, analyze_resume

router = APIRouter()


@router.post("/analyze", response_model=ResumeAnalysisResult)
async def analyze_resume_upload(
    file: UploadFile = File(...),
    target_program: str | None = Form(None),
):
    """Analyze a resume from an uploaded PDF file."""
    if not file.filename or not file.filename.endswith(".pdf"):
        # We can expand to DOCX later, but for now stick to PDF per pdf_parser capabilities
        raise HTTPException(status_code=422, detail="Only PDF files are supported.")
    try:
        pdf_bytes = await file.read()
        result = analyze_resume(pdf_bytes, target_program=target_program)
    except ResumeAgentError as exc:
        raise HTTPException(status_code=502, detail=str(exc))
    return result
