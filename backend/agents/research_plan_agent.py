"""Research Plan Agent.

Generates a personalised research plan including sub-questions, methodology
suggestions, a weekly study plan, foundational papers, and a literature gap
analysis.
"""

from __future__ import annotations

import os

from openai import OpenAI
from pydantic import BaseModel, Field

DEFAULT_MODEL = "gpt-4o"


class WeeklyTask(BaseModel):
    """A single task in the weekly study plan."""

    week: int = Field(description="The week number (1-12 for a 3-month plan).")
    task: str = Field(description="Description of the task for this week.")


class ResearchPlan(BaseModel):
    """A structured research plan for a given topic."""

    topic: str = Field(description="The research topic.")
    sub_questions: list[str] = Field(description="5 research sub-questions to explore.")
    methodology: str = Field(description="Suggested research methodology.")
    weekly_plan: list[WeeklyTask] = Field(description="A 3-month (12-week) study plan with weekly tasks.")
    foundational_papers: list[str] = Field(description="5 foundational papers to read first.")
    literature_gap: str = Field(description="An analysis of the current gap in the literature for this topic.")


class ResearchPlanAgentError(RuntimeError):
    """Raised when research plan generation fails."""


def _get_client() -> OpenAI:
    """Return an OpenAI client using the OPENAI_API_KEY env var."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ResearchPlanAgentError("Missing required environment variable: OPENAI_API_KEY")
    return OpenAI(api_key=api_key)


def generate_research_plan(
    topic: str,
    knowledge_level: str = "intermediate",
    target_degree: str = "masters",
    available_hours_per_week: int = 10,
    model: str = DEFAULT_MODEL,
) -> ResearchPlan:
    """Generate a personalised research plan.

    Parameters
    ----------
    topic:
        The research topic to build a plan around.
    knowledge_level:
        The user's current knowledge level ('beginner', 'intermediate', 'advanced').
    target_degree:
        The target degree programme ('masters' or 'phd').
    available_hours_per_week:
        How many hours per week the user can dedicate to research.
    model:
        The OpenAI model to use.

    Returns
    -------
    ResearchPlan
        The structured research plan.
    """
    if not topic.strip():
        raise ValueError("Research topic cannot be empty.")

    client = _get_client()

    system_prompt = (
        "You are an expert research advisor. Your task is to generate a comprehensive, "
        "personalised research plan for a student. The plan must include exactly 5 research "
        "sub-questions, a suggested methodology, a 3-month (12-week) study plan with weekly "
        "tasks calibrated to the student's available time, 5 foundational papers to start with, "
        "and a clear analysis of the current literature gap for the topic."
    )

    user_prompt = (
        f"Topic: {topic}\n"
        f"Knowledge level: {knowledge_level}\n"
        f"Target degree: {target_degree}\n"
        f"Available hours per week: {available_hours_per_week}\n\n"
        "Please generate a comprehensive research plan."
    )

    try:
        completion = client.beta.chat.completions.parse(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format=ResearchPlan,
        )
    except Exception as exc:
        raise ResearchPlanAgentError(f"LLM research plan generation failed: {exc}") from exc

    result = completion.choices[0].message.parsed
    if not result:
        raise ResearchPlanAgentError("Model returned empty parsed response")

    return result
