"""Tests for the Orchestrator."""

from __future__ import annotations

import pytest

from backend.agents import orchestrator
from backend.agents.orchestrator import AgentAction, OrchestratorRequest, OrchestratorResponse
from backend.agents.profile_agent import AcademicProfile


def _fake_parse_profile(text: str, **kwargs) -> AcademicProfile:
    return AcademicProfile(
        name="Test User",
        gpa=3.5,
        field_of_study="Physics",
        country="India",
        degree_level="masters",
        skills=["Python"],
        research_interests=["Quantum"],
    )


def test_dispatch_profile(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(orchestrator, "parse_profile", _fake_parse_profile)

    req = OrchestratorRequest(action=AgentAction.PROFILE, payload={"text": "I'm a physics student."})
    resp = orchestrator.run(req)

    assert resp.success is True
    assert resp.action == AgentAction.PROFILE
    assert resp.data["name"] == "Test User"
    assert resp.data["field_of_study"] == "Physics"


def test_dispatch_sop(monkeypatch: pytest.MonkeyPatch) -> None:
    from backend.agents import sop_agent
    from backend.agents.sop_agent import SOPAnalysisResult, SOPScore, SOPDimensionScore

    def fake_analyze(sop_text, **kwargs):
        dim = SOPDimensionScore(score=8, feedback="Good.")
        return SOPAnalysisResult(
            scores=SOPScore(clarity=dim, fit=dim, motivation=dim, specificity=dim, grammar=dim),
            improved_sop="Better SOP.",
        )

    monkeypatch.setattr(orchestrator, "analyze_sop", fake_analyze)

    req = OrchestratorRequest(action=AgentAction.SOP, payload={"sop_text": "My SOP draft."})
    resp = orchestrator.run(req)

    assert resp.success is True
    assert resp.data["improved_sop"] == "Better SOP."


def test_dispatch_roadmap(monkeypatch: pytest.MonkeyPatch) -> None:
    from backend.agents.roadmap_agent import Roadmap, RoadmapMonth, RoadmapTask

    def fake_roadmap(profile_summary, target_scholarships, **kwargs):
        return Roadmap(roadmap=[
            RoadmapMonth(month="June 2026", milestone="Prep", tasks=[
                RoadmapTask(task="Write SOP", priority="high", duration_days=7),
            ]),
        ])

    monkeypatch.setattr(orchestrator, "generate_roadmap", fake_roadmap)

    req = OrchestratorRequest(
        action=AgentAction.ROADMAP,
        payload={"profile_summary": "CS student", "target_scholarships": ["MEXT"]},
    )
    resp = orchestrator.run(req)

    assert resp.success is True
    assert len(resp.data["roadmap"]) == 1


def test_dispatch_research_plan(monkeypatch: pytest.MonkeyPatch) -> None:
    from backend.agents.research_plan_agent import ResearchPlan, WeeklyTask

    def fake_plan(topic, **kwargs):
        return ResearchPlan(
            topic=topic,
            sub_questions=["Q1", "Q2", "Q3", "Q4", "Q5"],
            methodology="Mixed methods",
            weekly_plan=[WeeklyTask(week=w, task=f"Week {w}") for w in range(1, 13)],
            foundational_papers=["P1", "P2", "P3", "P4", "P5"],
            literature_gap="Gap analysis.",
        )

    monkeypatch.setattr(orchestrator, "generate_research_plan", fake_plan)

    req = OrchestratorRequest(action=AgentAction.RESEARCH_PLAN, payload={"topic": "AI in Ed"})
    resp = orchestrator.run(req)

    assert resp.success is True
    assert resp.data["topic"] == "AI in Ed"
    assert len(resp.data["sub_questions"]) == 5


def test_dispatch_error_propagates(monkeypatch: pytest.MonkeyPatch) -> None:
    def bad_profile(text, **kwargs):
        raise ValueError("boom")

    monkeypatch.setattr(orchestrator, "parse_profile", bad_profile)

    req = OrchestratorRequest(action=AgentAction.PROFILE, payload={"text": "hi"})
    resp = orchestrator.run(req)

    assert resp.success is False
    assert "boom" in resp.error


def test_response_model_shape() -> None:
    resp = OrchestratorResponse(action=AgentAction.PROFILE, success=True, data={"name": "A"})
    assert resp.action == AgentAction.PROFILE
    assert resp.data == {"name": "A"}
    assert resp.error is None
