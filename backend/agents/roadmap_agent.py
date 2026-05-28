"""Roadmap Agent.

Generates a month-by-month application timeline for target scholarships,
including tasks, priority flags, and duration estimates.
"""

from __future__ import annotations

import os

from openai import OpenAI
from pydantic import BaseModel, Field

DEFAULT_MODEL = "gpt-4o"


class RoadmapTask(BaseModel):
    """A single actionable task in the roadmap."""

    task: str = Field(description="Description of the task.")
    priority: str = Field(description="Priority level: 'high', 'medium', or 'low'.")
    duration_days: int = Field(description="Estimated number of days to complete the task.")


class RoadmapMonth(BaseModel):
    """A single month in the roadmap timeline."""

    month: str = Field(description="The month and year label, e.g. 'June 2026'.")
    milestone: str = Field(description="The key milestone or phase for this month.")
    tasks: list[RoadmapTask] = Field(description="List of tasks for this month.")


class Roadmap(BaseModel):
    """A full application roadmap."""

    roadmap: list[RoadmapMonth] = Field(description="Month-by-month timeline of milestones and tasks.")


class RoadmapAgentError(RuntimeError):
    """Raised when roadmap generation fails."""


def _get_client() -> OpenAI:
    """Return an OpenAI client using the OPENAI_API_KEY env var."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RoadmapAgentError("Missing required environment variable: OPENAI_API_KEY")
    return OpenAI(api_key=api_key)


def generate_roadmap(
    profile_summary: str,
    target_scholarships: list[str],
    current_date: str | None = None,
    model: str = DEFAULT_MODEL,
) -> Roadmap:
    """Generate a month-by-month application roadmap.

    Parameters
    ----------
    profile_summary:
        A brief summary of the user's academic profile.
    target_scholarships:
        A list of scholarship names the user is targeting (with deadlines if available).
    current_date:
        The current date string (e.g. 'May 2026'). Used to anchor the timeline.
    model:
        The OpenAI model to use.

    Returns
    -------
    Roadmap
        A structured roadmap with months, milestones, and tasks.
    """
    if not profile_summary.strip():
        raise ValueError("Profile summary cannot be empty.")
    if not target_scholarships:
        raise ValueError("At least one target scholarship is required.")

    client = _get_client()

    scholarships_text = "\n".join(f"- {s}" for s in target_scholarships)

    system_prompt = (
        "You are an expert academic advisor who helps students plan their scholarship "
        "applications. Generate a detailed month-by-month roadmap starting from the current "
        "date. Each month should have a clear milestone and a list of actionable tasks. "
        "Tasks must have a priority ('high', 'medium', or 'low') and estimated duration in days. "
        "Cover at least 3 months. Include tasks like: gathering documents, requesting "
        "recommendation letters, writing SOPs, preparing for interviews, exam registration, "
        "language tests, research proposals, and submission deadlines."
    )

    date_context = f"The current date is {current_date}. " if current_date else ""
    user_prompt = (
        f"{date_context}"
        f"Student profile:\n{profile_summary}\n\n"
        f"Target scholarships:\n{scholarships_text}\n\n"
        "Please generate a comprehensive application roadmap."
    )

    try:
        completion = client.beta.chat.completions.parse(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format=Roadmap,
        )
    except Exception as exc:
        raise RoadmapAgentError(f"LLM roadmap generation failed: {exc}") from exc

    result = completion.choices[0].message.parsed
    if not result:
        raise RoadmapAgentError("Model returned empty parsed response")

    return result
