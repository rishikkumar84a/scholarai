"""Tests for the Research Plan Agent."""

from __future__ import annotations

import pytest
from pydantic import BaseModel

from backend.agents import research_plan_agent


class FakeMessage(BaseModel):
    parsed: research_plan_agent.ResearchPlan | None


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

        plan = research_plan_agent.ResearchPlan(
            topic="LLMs in Education",
            sub_questions=[
                "How can LLMs personalise learning?",
                "What are the risks of AI-generated content in education?",
                "How do LLMs compare to human tutors?",
                "What accessibility gains do LLMs provide?",
                "How should LLM-based tools be evaluated?",
            ],
            methodology=(
                "Mixed-methods approach combining a systematic literature review "
                "with a controlled user study comparing LLM tutoring to human tutoring."
            ),
            weekly_plan=[
                research_plan_agent.WeeklyTask(week=w, task=f"Task for week {w}")
                for w in range(1, 13)
            ],
            foundational_papers=[
                "Vaswani et al. (2017) — Attention Is All You Need",
                "Brown et al. (2020) — GPT-3",
                "OpenAI (2023) — GPT-4 Technical Report",
                "Kasneci et al. (2023) — ChatGPT for Good?",
                "Mollick & Mollick (2023) — Using AI in Teaching",
            ],
            literature_gap=(
                "Most studies focus on ChatGPT in higher education; few examine "
                "K-12 or non-English-speaking contexts."
            ),
        )
        return FakeCompletion(choices=[FakeChoice(message=FakeMessage(parsed=plan))])


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
    with pytest.raises(research_plan_agent.ResearchPlanAgentError, match="OPENAI_API_KEY"):
        research_plan_agent._get_client()


def test_plan_has_5_sub_questions(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(research_plan_agent, "_get_client", lambda: FakeClient("fake-key"))

    plan = research_plan_agent.generate_research_plan("LLMs in Education")
    assert len(plan.sub_questions) == 5


def test_plan_has_12_week_study_plan(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(research_plan_agent, "_get_client", lambda: FakeClient("fake-key"))

    plan = research_plan_agent.generate_research_plan("LLMs in Education")
    assert len(plan.weekly_plan) == 12


def test_plan_has_5_foundational_papers(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(research_plan_agent, "_get_client", lambda: FakeClient("fake-key"))

    plan = research_plan_agent.generate_research_plan("LLMs in Education")
    assert len(plan.foundational_papers) == 5


def test_plan_has_literature_gap(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(research_plan_agent, "_get_client", lambda: FakeClient("fake-key"))

    plan = research_plan_agent.generate_research_plan("LLMs in Education")
    assert len(plan.literature_gap) > 0


def test_plan_with_custom_params(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(research_plan_agent, "_get_client", lambda: FakeClient("fake-key"))

    plan = research_plan_agent.generate_research_plan(
        topic="LLMs in Education",
        knowledge_level="beginner",
        target_degree="phd",
        available_hours_per_week=20,
    )
    assert plan.topic == "LLMs in Education"


def test_empty_topic_raises_error() -> None:
    with pytest.raises(ValueError, match="cannot be empty"):
        research_plan_agent.generate_research_plan("   ")


def test_llm_failure(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(research_plan_agent, "_get_client", lambda: FakeClient("fake-key"))

    with pytest.raises(research_plan_agent.ResearchPlanAgentError, match="LLM research plan generation failed"):
        research_plan_agent.generate_research_plan("FAIL_LLM")
