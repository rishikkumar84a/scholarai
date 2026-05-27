"""Tests for the Paper Agent."""

from __future__ import annotations

import pytest
from pydantic import BaseModel

from backend.agents import paper_agent


class FakeMessage(BaseModel):
    parsed: paper_agent.PaperSummary | None


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
            
        summary = paper_agent.PaperSummary(
            title="Attention Is All You Need",
            one_line_summary="A new network architecture based solely on attention mechanisms.",
            problem_statement="Recurrent models are slow and hard to parallelize.",
            methodology="The Transformer relies entirely on self-attention to compute representations.",
            key_findings=["Finding 1", "Finding 2", "Finding 3"],
            limitations="Requires large amounts of data to train from scratch.",
            relevance_to_user="Highly relevant to NLP interests.",
            key_citations=["Vaswani et al. (2017) - Original paper"],
            further_reading=["BERT", "GPT-3"]
        )
        return FakeCompletion(choices=[FakeChoice(message=FakeMessage(parsed=summary))])


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
    with pytest.raises(paper_agent.PaperAgentError, match="OPENAI_API_KEY"):
        paper_agent._get_client()


def test_paper_agent_returns_all_6_sections(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(paper_agent, "_get_client", lambda: FakeClient("fake-key"))
    
    summary = paper_agent.summarize_paper("Raw text of the paper...")
    
    assert summary.title == "Attention Is All You Need"
    assert summary.problem_statement == "Recurrent models are slow and hard to parallelize."
    assert summary.methodology == "The Transformer relies entirely on self-attention to compute representations."
    assert len(summary.key_findings) == 3
    assert summary.limitations == "Requires large amounts of data to train from scratch."
    assert summary.relevance_to_user == "Highly relevant to NLP interests."
    assert len(summary.key_citations) == 1


def test_key_findings_is_a_list(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(paper_agent, "_get_client", lambda: FakeClient("fake-key"))
    
    summary = paper_agent.summarize_paper("Raw text of the paper...")
    assert isinstance(summary.key_findings, list)


def test_one_line_summary_is_under_100_words(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(paper_agent, "_get_client", lambda: FakeClient("fake-key"))
    
    summary = paper_agent.summarize_paper("Raw text of the paper...")
    word_count = len(summary.one_line_summary.split())
    assert word_count < 100


def test_summarize_empty_text_raises_error() -> None:
    with pytest.raises(paper_agent.PaperAgentError, match="No extractable text"):
        paper_agent.summarize_paper("   \n   ")


def test_summarize_url_download_failure(monkeypatch: pytest.MonkeyPatch) -> None:
    def mock_fetch(url):
        raise paper_agent.PaperAgentError("Failed to download PDF from http://fake.com: 404 Not Found")
        
    monkeypatch.setattr(paper_agent, "_fetch_pdf_bytes_from_url", mock_fetch)
    
    with pytest.raises(paper_agent.PaperAgentError, match="Failed to download PDF from http://fake.com: 404 Not Found"):
        paper_agent.summarize_paper("http://fake.com")


def test_llm_failure(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(paper_agent, "_get_client", lambda: FakeClient("fake-key"))
    
    with pytest.raises(paper_agent.PaperAgentError, match="LLM summarization failed: LLM down"):
        paper_agent.summarize_paper("Raw text FAIL_LLM")
