"""Research Plan API routes."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.agents.research_plan_agent import (
    ResearchPlan,
    ResearchPlanAgentError,
    generate_research_plan,
)

router = APIRouter()


class GenerateResearchPlanRequest(BaseModel):
    """Request body for POST /api/research-plan/generate."""

    topic: str = Field(..., min_length=1, description="The research topic.")
    knowledge_level: str = Field("intermediate", description="'beginner', 'intermediate', or 'advanced'.")
    target_degree: str = Field("masters", description="'masters' or 'phd'.")
    available_hours_per_week: int = Field(10, ge=1, le=80, description="Hours per week for research.")


class GenerateResearchPlanResponse(BaseModel):
    """Response for research plan generation."""

    plan: ResearchPlan


@router.post("/generate", response_model=GenerateResearchPlanResponse)
async def generate_research_plan_route(body: GenerateResearchPlanRequest):
    """Generate a personalised research plan."""
    try:
        result = generate_research_plan(
            body.topic,
            knowledge_level=body.knowledge_level,
            target_degree=body.target_degree,
            available_hours_per_week=body.available_hours_per_week,
        )
    except ResearchPlanAgentError as exc:
        raise HTTPException(status_code=502, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    return GenerateResearchPlanResponse(plan=result)
