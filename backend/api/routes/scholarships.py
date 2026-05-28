"""Scholarship API routes."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.agents.profile_agent import AcademicProfile
from backend.agents.match_agent import MatchResult, MatchAgentError, get_top_scholarships
from backend.db.supabase_client import get_supabase_client, SupabaseConfigError

router = APIRouter()


class MatchRequest(BaseModel):
    """Request body for POST /api/scholarships/match."""

    profile: AcademicProfile = Field(..., description="The user's structured academic profile.")


class MatchResponse(BaseModel):
    """Response for POST /api/scholarships/match."""

    result: MatchResult


@router.post("/match", response_model=MatchResponse)
async def match_scholarships(body: MatchRequest):
    """Run vector similarity match against user profile."""
    try:
        result = get_top_scholarships(body.profile)
    except MatchAgentError as exc:
        raise HTTPException(status_code=502, detail=str(exc))
    return MatchResponse(result=result)


@router.get("/")
async def list_scholarships():
    """List all scholarships in the database."""
    try:
        supabase = get_supabase_client("service")
        response = supabase.table("scholarships").select(
            "id, name, country, degree_level, field, gpa_requirement, deadline, link, description"
        ).execute()
        return {"scholarships": response.data}
    except SupabaseConfigError as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/{scholarship_id}")
async def get_scholarship(scholarship_id: str):
    """Get a single scholarship by ID."""
    try:
        supabase = get_supabase_client("service")
        response = supabase.table("scholarships").select("*").eq("id", scholarship_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Scholarship not found")
        return {"scholarship": response.data[0]}
    except SupabaseConfigError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
