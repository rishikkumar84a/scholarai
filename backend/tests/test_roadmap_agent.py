"""Tests for the Roadmap Agent."""

from __future__ import annotations

import pytest
from pydantic import BaseModel

from backend.agents import roadmap_agent


class FakeMessage(BaseModel):
    parsed: roadmap_agent.Roadmap | None


class FakeChoice(BaseModel):
    message: FakeMessage


class FakeCompletion(BaseModel):
    choices: list[FakeChoice]


class FakeChatCompletions:
    def parse(self, model: str, messages: list[dict], response_format: type) -> FakeCompletion:
        user_msg = next((m["content"] for m in messages if m["role"] == "user"), "")
        if "FAIL_LLM" in user_msg:
            raise Exception("LLM down")
        if "FAIL_PARSE" in user_msg:
            return FakeCompletion(choices=[FakeChoice(message=FakeMessage(parsed=None))])

        roadmap = roadmap_agent.Roadmap(
            roadmap=[
                roadmap_agent.RoadmapMonth(
                    month="June 2026",
                    milestone="Preparation Phase",
                    tasks=[
                        roadmap_agent.RoadmapTask(task="Request recommendation letters", priority="high", duration_days=7),
                        roadmap_agent.RoadmapTask(task="Start MEXT research proposal draft", priority="high", duration_days=14),
                    ],
                ),
                roadmap_agent.RoadmapMonth(
                    month="July 2026",
                    milestone="Drafting Phase",
                    tasks=[
                        roadmap_agent.RoadmapTask(task="Finalize SOP draft", priority="high", duration_days=10),
                        roadmap_agent.RoadmapTask(task="Prepare language test", priority="medium", duration_days=21),
                    ],
                ),
                roadmap_agent.RoadmapMonth(
                    month="August 2026",
                    milestone="Submission Phase",
                    tasks=[
                        roadmap_agent.RoadmapTask(task="Submit MEXT application", priority="high", duration_days=3),
                        roadmap_agent.RoadmapTask(task="Follow up with referees", priority="low", duration_days=5),
                    ],
                ),
            ]
        )
        return FakeCompletion(choices=[FakeChoice(message=FakeMessage(parsed=roadmap))])


class FakeChat:
    def __init__(self):
        self.completions = FakeChatCompletions()


class FakeBeta:
    def __init__(self):
        self.chat = FakeChat()


class FakeClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.beta = FakeBeta()


def test_missing_api_key_raises_error(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    with pytest.raises(roadmap_agent.RoadmapAgentError, match="OPENAI_API_KEY"):
        roadmap_agent._get_client()


def test_roadmap_returns_monthly_milestones(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(roadmap_agent, "_get_client", lambda: FakeClient("fake-key"))

    result = roadmap_agent.generate_roadmap(
        profile_summary="CS student, GPA 3.8, India",
        target_scholarships=["MEXT (Japan)", "Fulbright (USA)"],
        current_date="May 2026",
    )

    assert len(result.roadmap) >= 3
    for month in result.roadmap:
        assert month.milestone  # non-empty


def test_each_task_has_priority_field(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(roadmap_agent, "_get_client", lambda: FakeClient("fake-key"))

    result = roadmap_agent.generate_roadmap(
        profile_summary="CS student, GPA 3.8, India",
        target_scholarships=["MEXT (Japan)"],
    )

    for month in result.roadmap:
        for task in month.tasks:
            assert task.priority in ("high", "medium", "low")


def test_roadmap_covers_at_least_3_months(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(roadmap_agent, "_get_client", lambda: FakeClient("fake-key"))

    result = roadmap_agent.generate_roadmap(
        profile_summary="CS student, GPA 3.8, India",
        target_scholarships=["DAAD (Germany)"],
    )

    assert len(result.roadmap) >= 3


def test_empty_profile_raises_error() -> None:
    with pytest.raises(ValueError, match="cannot be empty"):
        roadmap_agent.generate_roadmap(
            profile_summary="   ",
            target_scholarships=["MEXT"],
        )


def test_empty_scholarships_raises_error() -> None:
    with pytest.raises(ValueError, match="At least one target scholarship"):
        roadmap_agent.generate_roadmap(
            profile_summary="CS student",
            target_scholarships=[],
        )


def test_llm_failure(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(roadmap_agent, "_get_client", lambda: FakeClient("fake-key"))

    with pytest.raises(roadmap_agent.RoadmapAgentError, match="LLM roadmap generation failed: LLM down"):
        roadmap_agent.generate_roadmap(
            profile_summary="FAIL_LLM",
            target_scholarships=["MEXT"],
        )
