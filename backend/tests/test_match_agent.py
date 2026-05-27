"""Tests for the Match Agent."""

from __future__ import annotations

import pytest
from pydantic import BaseModel

from backend.agents import match_agent
from backend.agents.profile_agent import AcademicProfile


class FakeMessage(BaseModel):
    parsed: match_agent.MatchResult | None


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
            
        matches = [
            match_agent.MatchedScholarship(
                id="fake-id",
                name="MEXT Scholarship",
                country="Japan",
                match_score=92,
                eligible=True,
                reasons=["STEM background", "High GPA"],
                deadline="2027",
                link="http://mext",
                missing_requirements=["N5 Japanese"]
            )
        ]
        return FakeCompletion(choices=[FakeChoice(message=FakeMessage(parsed=match_agent.MatchResult(matches=matches)))])


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


class FakeRpcResponse:
    def __init__(self, data: list[dict]):
        self.data = data


class FakeRpc:
    def __init__(self, name: str, args: dict, fail: bool = False):
        self.fail = fail

    def execute(self) -> FakeRpcResponse:
        if self.fail:
            raise Exception("DB down")
        return FakeRpcResponse(data=[{"id": "fake-id", "name": "MEXT Scholarship", "similarity": 0.85}])


class FakeSupabase:
    def __init__(self, fail_rpc: bool = False):
        self.fail_rpc = fail_rpc

    def rpc(self, name: str, args: dict) -> FakeRpc:
        return FakeRpc(name, args, self.fail_rpc)


def test_missing_api_key_raises_error(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    with pytest.raises(match_agent.MatchAgentError, match="OPENAI_API_KEY"):
        match_agent._get_client()


def test_get_top_scholarships_success(monkeypatch: pytest.MonkeyPatch) -> None:
    # Mocks
    monkeypatch.setattr(match_agent, "embed_text", lambda x: [0.1] * 1536)
    monkeypatch.setattr(match_agent, "get_supabase_client", lambda role: FakeSupabase())
    monkeypatch.setattr(match_agent, "_get_client", lambda: FakeClient("fake-key"))

    profile = AcademicProfile(
        name="John Doe",
        gpa=3.8,
        field_of_study="Computer Science",
        country="India",
        degree_level="masters",
        skills=["Python"],
        research_interests=["AI"]
    )
    
    result = match_agent.get_top_scholarships(profile)
    assert len(result.matches) == 1
    assert result.matches[0].name == "MEXT Scholarship"
    assert result.matches[0].match_score == 92
    assert result.matches[0].eligible is True
    assert "High GPA" in result.matches[0].reasons


def test_get_top_scholarships_embed_fail(monkeypatch: pytest.MonkeyPatch) -> None:
    def fail_embed(x):
        raise Exception("Embed down")
        
    monkeypatch.setattr(match_agent, "embed_text", fail_embed)
    profile = AcademicProfile()
    
    with pytest.raises(match_agent.MatchAgentError, match="Failed to embed profile: Embed down"):
        match_agent.get_top_scholarships(profile)


def test_get_top_scholarships_db_fail(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(match_agent, "embed_text", lambda x: [0.1] * 1536)
    monkeypatch.setattr(match_agent, "get_supabase_client", lambda role: FakeSupabase(fail_rpc=True))
    profile = AcademicProfile()
    
    with pytest.raises(match_agent.MatchAgentError, match="Supabase RPC failed: DB down"):
        match_agent.get_top_scholarships(profile)


def test_get_top_scholarships_empty_db(monkeypatch: pytest.MonkeyPatch) -> None:
    class FakeEmptyRpc:
        def execute(self):
            return FakeRpcResponse(data=[])
            
    class FakeEmptySupabase:
        def rpc(self, name, args):
            return FakeEmptyRpc()
            
    monkeypatch.setattr(match_agent, "embed_text", lambda x: [0.1] * 1536)
    monkeypatch.setattr(match_agent, "get_supabase_client", lambda role: FakeEmptySupabase())
    profile = AcademicProfile()
    
    result = match_agent.get_top_scholarships(profile)
    assert len(result.matches) == 0


def test_get_top_scholarships_llm_fail(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(match_agent, "embed_text", lambda x: [0.1] * 1536)
    monkeypatch.setattr(match_agent, "get_supabase_client", lambda role: FakeSupabase())
    monkeypatch.setattr(match_agent, "_get_client", lambda: FakeClient("fake-key"))
    
    profile = AcademicProfile(name="FAIL_LLM")
    
    with pytest.raises(match_agent.MatchAgentError, match="LLM evaluation failed: LLM down"):
        match_agent.get_top_scholarships(profile)
