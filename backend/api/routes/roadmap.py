"""Roadmap API routes."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.agents.roadmap_agent import Roadmap, RoadmapAgentError, generate_roadmap

router = APIRouter()


class GenerateRoadmapRequest(BaseModel):
    """Request body for POST /api/roadmap/generate."""

    profile_summary: str = Field(..., min_length=1, description="Brief summary of user's academic profile.")
    target_scholarships: list[str] = Field(..., min_length=1, description="Target scholarship names with deadlines.")
    current_date: str | None = Field(None, description="Current date string (e.g. 'May 2026').")


class GenerateRoadmapResponse(BaseModel):
    """Response for roadmap generation."""

    roadmap: Roadmap


@router.post("/generate", response_model=GenerateRoadmapResponse)
async def generate_roadmap_route(body: GenerateRoadmapRequest):
    """Generate an application roadmap."""
    try:
        result = generate_roadmap(
            body.profile_summary,
            body.target_scholarships,
            current_date=body.current_date,
        )
    except RoadmapAgentError as exc:
        raise HTTPException(status_code=502, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    return GenerateRoadmapResponse(roadmap=result)
