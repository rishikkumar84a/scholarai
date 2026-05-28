"""SOP API routes."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.agents.sop_agent import SOPAnalysisResult, SOPAgentError, analyze_sop

router = APIRouter()


class AnalyzeSOPRequest(BaseModel):
    """Request body for POST /api/sop/analyze."""

    sop_text: str = Field(..., min_length=1, description="The draft Statement of Purpose.")
    target_program: str | None = Field(None, description="Optional target program or scholarship name.")


class AnalyzeSOPResponse(BaseModel):
    """Response for SOP analysis."""

    result: SOPAnalysisResult


@router.post("/analyze", response_model=AnalyzeSOPResponse)
async def analyze_sop_route(body: AnalyzeSOPRequest):
    """Score and improve an SOP."""
    try:
        result = analyze_sop(body.sop_text, target_program=body.target_program)
    except SOPAgentError as exc:
        raise HTTPException(status_code=502, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    return AnalyzeSOPResponse(result=result)


@router.post("/iterate", response_model=AnalyzeSOPResponse)
async def iterate_sop_route(body: AnalyzeSOPRequest):
    """Re-run improvement on an updated SOP (same logic, different intent)."""
    try:
        result = analyze_sop(body.sop_text, target_program=body.target_program)
    except SOPAgentError as exc:
        raise HTTPException(status_code=502, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    return AnalyzeSOPResponse(result=result)
