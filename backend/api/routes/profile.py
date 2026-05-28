"""Profile API routes."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.agents.profile_agent import AcademicProfile, parse_profile, ProfileAgentError

router = APIRouter()


class BuildProfileRequest(BaseModel):
    """Request body for POST /api/profile/build."""

    text: str = Field(..., min_length=1, description="Raw text describing the user's academic background.")


class BuildProfileResponse(BaseModel):
    """Response for POST /api/profile/build."""

    profile: AcademicProfile


@router.post("/build", response_model=BuildProfileResponse)
async def build_profile(body: BuildProfileRequest):
    """Parse unstructured text into a structured academic profile."""
    try:
        profile = parse_profile(body.text)
    except ProfileAgentError as exc:
        raise HTTPException(status_code=502, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    return BuildProfileResponse(profile=profile)
