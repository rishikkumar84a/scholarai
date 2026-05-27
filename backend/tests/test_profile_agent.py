"""Tests for the Profile Agent."""

from __future__ import annotations

import pytest
from pydantic import BaseModel

from backend.agents import profile_agent


class FakeMessage(BaseModel):
    parsed: profile_agent.AcademicProfile | None


class FakeChoice(BaseModel):
    message: FakeMessage


class FakeCompletion(BaseModel):
    choices: list[FakeChoice]


class FakeChatCompletions:
    def parse(self, model: str, messages: list[dict], response_format: type) -> FakeCompletion:
        # Check if we should simulate a failure based on input text
        user_msg = next((m["content"] for m in messages if m["role"] == "user"), "")
        if "FAIL_API" in user_msg:
            raise Exception("API down")
        if "FAIL_PARSE" in user_msg:
            return FakeCompletion(choices=[FakeChoice(message=FakeMessage(parsed=None))])
            
        profile = profile_agent.AcademicProfile(
            name="John Doe",
            gpa=3.8,
            field_of_study="Computer Science",
            country="India",
            degree_level="masters",
            skills=["Python", "Machine Learning"],
            research_interests=["NLP", "AI Agents"]
        )
        return FakeCompletion(choices=[FakeChoice(message=FakeMessage(parsed=profile))])


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


def install_fake_client(monkeypatch: pytest.MonkeyPatch, error: Exception | None = None) -> None:
    def _get_client():
        if error:
            raise error
        return FakeClient("fake-key")
    monkeypatch.setattr(profile_agent, "_get_client", _get_client)


def test_missing_api_key_raises_error(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    with pytest.raises(profile_agent.ProfileAgentError, match="OPENAI_API_KEY"):
        profile_agent._get_client()


def test_parse_profile_success(monkeypatch: pytest.MonkeyPatch) -> None:
    install_fake_client(monkeypatch)
    profile = profile_agent.parse_profile("My name is John Doe, studying CS in India.")
    
    assert profile.name == "John Doe"
    assert profile.gpa == 3.8
    assert profile.field_of_study == "Computer Science"
    assert profile.country == "India"
    assert profile.degree_level == "masters"
    assert "Python" in profile.skills
    assert "NLP" in profile.research_interests


def test_parse_profile_empty_raises_error() -> None:
    with pytest.raises(ValueError, match="empty profile text"):
        profile_agent.parse_profile("   \n   ")


def test_parse_profile_api_failure(monkeypatch: pytest.MonkeyPatch) -> None:
    install_fake_client(monkeypatch)
    with pytest.raises(profile_agent.ProfileAgentError, match="Failed to parse profile: API down"):
        profile_agent.parse_profile("Some text FAIL_API")


def test_parse_profile_empty_parsed_response(monkeypatch: pytest.MonkeyPatch) -> None:
    install_fake_client(monkeypatch)
    with pytest.raises(profile_agent.ProfileAgentError, match="Model returned empty parsed response"):
        profile_agent.parse_profile("Some text FAIL_PARSE")
