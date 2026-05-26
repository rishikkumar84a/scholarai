from __future__ import annotations

import sys
from types import ModuleType

import pytest

from backend.db import supabase_client


class FakeClient:
    pass


def install_fake_supabase(monkeypatch: pytest.MonkeyPatch, calls: list[tuple[str, str]]) -> None:
    module = ModuleType("supabase")

    def create_client(url: str, key: str) -> FakeClient:
        calls.append((url, key))
        return FakeClient()

    module.Client = FakeClient
    module.create_client = create_client
    monkeypatch.setitem(sys.modules, "supabase", module)


def test_missing_supabase_url_raises_config_error(monkeypatch: pytest.MonkeyPatch) -> None:
    supabase_client.get_supabase_client.cache_clear()
    monkeypatch.delenv("SUPABASE_URL", raising=False)

    with pytest.raises(supabase_client.SupabaseConfigError, match="SUPABASE_URL"):
        supabase_client.get_supabase_client()


def test_service_client_uses_service_key(monkeypatch: pytest.MonkeyPatch) -> None:
    supabase_client.get_supabase_client.cache_clear()
    calls: list[tuple[str, str]] = []
    install_fake_supabase(monkeypatch, calls)
    monkeypatch.setenv("SUPABASE_URL", "https://example.supabase.co")
    monkeypatch.setenv("SUPABASE_SERVICE_KEY", "service-key")

    client = supabase_client.get_supabase_client("service")

    assert isinstance(client, FakeClient)
    assert calls == [("https://example.supabase.co", "service-key")]


def test_anon_client_uses_anon_key(monkeypatch: pytest.MonkeyPatch) -> None:
    supabase_client.get_supabase_client.cache_clear()
    calls: list[tuple[str, str]] = []
    install_fake_supabase(monkeypatch, calls)
    monkeypatch.setenv("SUPABASE_URL", "https://example.supabase.co")
    monkeypatch.setenv("SUPABASE_ANON_KEY", "anon-key")

    client = supabase_client.get_supabase_client("anon")

    assert isinstance(client, FakeClient)
    assert calls == [("https://example.supabase.co", "anon-key")]


def test_client_factory_caches_by_role(monkeypatch: pytest.MonkeyPatch) -> None:
    supabase_client.get_supabase_client.cache_clear()
    calls: list[tuple[str, str]] = []
    install_fake_supabase(monkeypatch, calls)
    monkeypatch.setenv("SUPABASE_URL", "https://example.supabase.co")
    monkeypatch.setenv("SUPABASE_SERVICE_KEY", "service-key")

    first = supabase_client.get_supabase_client("service")
    second = supabase_client.get_supabase_client("service")

    assert first is second
    assert len(calls) == 1
