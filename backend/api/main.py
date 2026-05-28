"""FastAPI application entry-point for ScholarAI backend."""

from __future__ import annotations

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes.profile import router as profile_router
from backend.api.routes.scholarships import router as scholarships_router
from backend.api.routes.papers import router as papers_router

app = FastAPI(
    title="ScholarAI API",
    description="AI copilot for scholarships, research, and academic applications.",
    version="0.1.0",
)

# CORS — allow the frontend origin (Vercel in prod, localhost in dev)
_frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[_frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Route registration ──────────────────────────────────────────────
app.include_router(profile_router, prefix="/api/profile", tags=["Profile"])
app.include_router(scholarships_router, prefix="/api/scholarships", tags=["Scholarships"])
app.include_router(papers_router, prefix="/api/papers", tags=["Papers"])


@app.get("/health", tags=["Health"])
async def health_check():
    """Simple health-check endpoint."""
    return {"status": "ok"}
