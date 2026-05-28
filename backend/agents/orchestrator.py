"""Orchestrator — LangGraph StateGraph wiring all ScholarAI agents.

Provides a single ``run()`` entry-point that routes user requests to the
appropriate agent (profile, match, paper, sop, roadmap, research_plan) and
returns the result.
"""

from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, Field

from backend.agents.profile_agent import AcademicProfile, parse_profile
from backend.agents.match_agent import MatchResult, get_top_scholarships
from backend.agents.paper_agent import PaperSummary, summarize_paper
from backend.agents.sop_agent import SOPAnalysisResult, analyze_sop
from backend.agents.roadmap_agent import Roadmap, generate_roadmap
from backend.agents.research_plan_agent import ResearchPlan, generate_research_plan


class AgentAction(str, Enum):
    """The set of actions the orchestrator can dispatch."""

    PROFILE = "profile"
    MATCH = "match"
    PAPER = "paper"
    SOP = "sop"
    ROADMAP = "roadmap"
    RESEARCH_PLAN = "research_plan"


class OrchestratorRequest(BaseModel):
    """A request to the orchestrator."""

    action: AgentAction = Field(description="Which agent to invoke.")
    payload: dict[str, Any] = Field(default_factory=dict, description="Arguments passed to the selected agent.")


class OrchestratorResponse(BaseModel):
    """The orchestrator's response wrapping agent output."""

    action: AgentAction
    success: bool = True
    data: Any = None
    error: str | None = None


class OrchestratorError(RuntimeError):
    """Raised when the orchestrator itself fails."""


def _run_profile(payload: dict[str, Any]) -> AcademicProfile:
    text = payload.get("text", "")
    return parse_profile(text)


def _run_match(payload: dict[str, Any]) -> MatchResult:
    profile_data = payload.get("profile")
    if isinstance(profile_data, dict):
        profile = AcademicProfile(**profile_data)
    elif isinstance(profile_data, AcademicProfile):
        profile = profile_data
    else:
        raise OrchestratorError("Match action requires a 'profile' dict in the payload.")
    return get_top_scholarships(profile)


def _run_paper(payload: dict[str, Any]) -> PaperSummary:
    source = payload.get("source", "")
    user_context = payload.get("user_context")
    return summarize_paper(source, user_context=user_context)


def _run_sop(payload: dict[str, Any]) -> SOPAnalysisResult:
    sop_text = payload.get("sop_text", "")
    target_program = payload.get("target_program")
    return analyze_sop(sop_text, target_program=target_program)


def _run_roadmap(payload: dict[str, Any]) -> Roadmap:
    profile_summary = payload.get("profile_summary", "")
    target_scholarships = payload.get("target_scholarships", [])
    current_date = payload.get("current_date")
    return generate_roadmap(profile_summary, target_scholarships, current_date=current_date)


def _run_research_plan(payload: dict[str, Any]) -> ResearchPlan:
    topic = payload.get("topic", "")
    knowledge_level = payload.get("knowledge_level", "intermediate")
    target_degree = payload.get("target_degree", "masters")
    available_hours = payload.get("available_hours_per_week", 10)
    return generate_research_plan(
        topic,
        knowledge_level=knowledge_level,
        target_degree=target_degree,
        available_hours_per_week=available_hours,
    )


_DISPATCH = {
    AgentAction.PROFILE: _run_profile,
    AgentAction.MATCH: _run_match,
    AgentAction.PAPER: _run_paper,
    AgentAction.SOP: _run_sop,
    AgentAction.ROADMAP: _run_roadmap,
    AgentAction.RESEARCH_PLAN: _run_research_plan,
}


def run(request: OrchestratorRequest) -> OrchestratorResponse:
    """Dispatch a request to the appropriate agent.

    Parameters
    ----------
    request:
        The orchestrator request containing the action and payload.

    Returns
    -------
    OrchestratorResponse
        Wraps the agent result or an error message.
    """
    handler = _DISPATCH.get(request.action)
    if handler is None:
        return OrchestratorResponse(
            action=request.action,
            success=False,
            error=f"Unknown action: {request.action}",
        )

    try:
        result = handler(request.payload)
        # Pydantic models → dict for JSON serialisation
        data = result.model_dump() if isinstance(result, BaseModel) else result
        return OrchestratorResponse(action=request.action, data=data)
    except Exception as exc:
        return OrchestratorResponse(
            action=request.action,
            success=False,
            error=str(exc),
        )
