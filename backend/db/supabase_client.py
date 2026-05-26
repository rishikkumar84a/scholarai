from __future__ import annotations

import os
from functools import lru_cache
from typing import Literal


SupabaseKeyRole = Literal["anon", "service"]


class SupabaseConfigError(RuntimeError):
    """Raised when required Supabase configuration is missing."""


def _required_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise SupabaseConfigError(f"Missing required environment variable: {name}")
    return value


@lru_cache(maxsize=2)
def get_supabase_client(role: SupabaseKeyRole = "service"):
    """Return a cached Supabase client for backend database operations."""

    if role not in ("anon", "service"):
        raise SupabaseConfigError(f"Invalid Supabase key role: {role}")

    url = _required_env("SUPABASE_URL")
    key_name = "SUPABASE_SERVICE_KEY" if role == "service" else "SUPABASE_ANON_KEY"
    key = _required_env(key_name)

    from supabase import Client, create_client

    client: Client = create_client(url, key)
    return client
