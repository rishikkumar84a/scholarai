"""Tests for the OpenAI embeddings wrapper."""

from __future__ import annotations

import pytest

from backend.utils import embeddings


class FakeData:
    def __init__(self, index: int, embedding: list[float]):
        self.index = index
        self.embedding = embedding


class FakeResponse:
    def __init__(self, data: list[FakeData]):
        self.data = data


class FakeEmbeddings:
    def create(self, input: list[str], model: str) -> FakeResponse:
        return FakeResponse([
            FakeData(index=i, embedding=[float(i), 0.1, 0.2])
            for i in range(len(input))
        ])


class FakeClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.embeddings = FakeEmbeddings()


def install_fake_client(monkeypatch: pytest.MonkeyPatch, error: Exception | None = None) -> None:
    def _get_client():
        if error:
            raise error
        return FakeClient("fake-key")
    monkeypatch.setattr(embeddings, "_get_client", _get_client)


def test_missing_api_key_raises_error(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    with pytest.raises(embeddings.EmbeddingError, match="OPENAI_API_KEY"):
        embeddings._get_client()


def test_embed_text_success(monkeypatch: pytest.MonkeyPatch) -> None:
    install_fake_client(monkeypatch)
    vector = embeddings.embed_text("  hello world  ")
    assert vector == [0.0, 0.1, 0.2]


def test_embed_text_empty_raises_error() -> None:
    with pytest.raises(ValueError, match="empty text"):
        embeddings.embed_text("   \n   ")


def test_embed_text_api_failure(monkeypatch: pytest.MonkeyPatch) -> None:
    def _fail(*args, **kwargs):
        raise Exception("API down")
    
    class FailingEmbeddings:
        def create(self, input, model):
            raise Exception("API down")
            
    class FailingClient:
        def __init__(self, api_key):
            self.embeddings = FailingEmbeddings()

    monkeypatch.setattr(embeddings, "_get_client", lambda: FailingClient("fake"))
    
    with pytest.raises(embeddings.EmbeddingError, match="OpenAI embedding request failed: API down"):
        embeddings.embed_text("hello")


def test_embed_texts_success(monkeypatch: pytest.MonkeyPatch) -> None:
    install_fake_client(monkeypatch)
    vectors = embeddings.embed_texts(["first", "  second  "])
    assert len(vectors) == 2
    assert vectors[0] == [0.0, 0.1, 0.2]
    assert vectors[1] == [1.0, 0.1, 0.2]


def test_embed_texts_empty_sequence() -> None:
    with pytest.raises(ValueError, match="non-empty sequence"):
        embeddings.embed_texts([])


def test_embed_texts_contains_empty_string() -> None:
    with pytest.raises(ValueError, match="empty after stripping"):
        embeddings.embed_texts(["valid", "   "])
