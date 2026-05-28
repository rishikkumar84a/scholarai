"""Tests for the SOP Agent."""

from __future__ import annotations

import pytest
from pydantic import BaseModel

from backend.agents import sop_agent


class FakeMessage(BaseModel):
    parsed: sop_agent.SOPAnalysisResult | None


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
            
        result = sop_agent.SOPAnalysisResult(
            scores=sop_agent.SOPScore(
                clarity=sop_agent.SOPDimensionScore(score=7, feedback="Good clarity but some sentences are long."),
                fit=sop_agent.SOPDimensionScore(score=8, feedback="Strong fit, mentions the program nicely."),
                motivation=sop_agent.SOPDimensionScore(score=6, feedback="A bit generic motivation."),
                specificity=sop_agent.SOPDimensionScore(score=5, feedback="Could use more concrete examples."),
                grammar=sop_agent.SOPDimensionScore(score=9, feedback="Very few grammatical errors.")
            ),
            improved_sop="This is a fully rewritten and significantly improved Statement of Purpose that expands upon the original draft with much better flow, richer vocabulary, and stronger connections to the target program. It incorporates all the feedback provided above to ensure maximum impact."
        )
        return FakeCompletion(choices=[FakeChoice(message=FakeMessage(parsed=result))])


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
    with pytest.raises(sop_agent.SOPAgentError, match="OPENAI_API_KEY"):
        sop_agent._get_client()


def test_sop_score_returns_5_dimensions(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(sop_agent, "_get_client", lambda: FakeClient("fake-key"))
    
    result = sop_agent.analyze_sop("This is my draft SOP.")
    
    assert hasattr(result.scores, "clarity")
    assert hasattr(result.scores, "fit")
    assert hasattr(result.scores, "motivation")
    assert hasattr(result.scores, "specificity")
    assert hasattr(result.scores, "grammar")


def test_each_dimension_score_is_0_to_10(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(sop_agent, "_get_client", lambda: FakeClient("fake-key"))
    
    result = sop_agent.analyze_sop("This is my draft SOP.", target_program="MEXT")
    
    for dimension in [
        result.scores.clarity,
        result.scores.fit,
        result.scores.motivation,
        result.scores.specificity,
        result.scores.grammar
    ]:
        assert 0 <= dimension.score <= 10


def test_improved_sop_is_longer_than_feedback(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(sop_agent, "_get_client", lambda: FakeClient("fake-key"))
    
    result = sop_agent.analyze_sop("This is my draft SOP.")
    
    # Calculate total feedback length
    feedback_len = sum(len(d.feedback) for d in [
        result.scores.clarity,
        result.scores.fit,
        result.scores.motivation,
        result.scores.specificity,
        result.scores.grammar
    ])
    
    # In our mock, the improved_sop is quite long, so let's verify the logic holds.
    # We'll just assert it's a non-empty string for the test, but check the condition too.
    assert len(result.improved_sop) > 0
    # In a real scenario, the improved SOP might not strictly be longer than all feedback combined,
    # but the PRD requirement test logic checks this.
    assert len(result.improved_sop) > feedback_len


def test_analyze_empty_sop_raises_error() -> None:
    with pytest.raises(ValueError, match="cannot be empty"):
        sop_agent.analyze_sop("   \n   ")


def test_llm_failure(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(sop_agent, "_get_client", lambda: FakeClient("fake-key"))
    
    with pytest.raises(sop_agent.SOPAgentError, match="LLM analysis failed: LLM down"):
        sop_agent.analyze_sop("FAIL_LLM")
