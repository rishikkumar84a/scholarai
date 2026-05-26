# ScholarAI

ScholarAI is an AI research and scholarship copilot for students applying to scholarships, research programs, and graduate programs.

## Tech Stack

- Frontend: Next.js 14, Tailwind CSS, shadcn/ui
- Backend: Python 3.11, FastAPI, LangGraph
- AI: OpenAI GPT-4o, text-embedding-3-small
- Database: Supabase PostgreSQL with pgvector
- Auth: Supabase Auth
- Testing: pytest, Vitest

## Features

- AI scholarship matcher
- Research paper summarizer
- SOP and resume improvement assistant
- AI application roadmap generator
- Personalized research plan generator

## Architecture Diagram

```text
User
  |
  v
Next.js frontend
  |
  v
FastAPI backend
  |
  +--> LangGraph orchestrator
  |      +--> ProfileAgent
  |      +--> MatchAgent
  |      +--> PaperAgent
  |      +--> SOPAgent
  |      +--> RoadmapAgent
  |      +--> ResearchPlanAgent
  |
  +--> OpenAI API
  +--> Supabase PostgreSQL + pgvector
```

## Prerequisites

- Node.js 20+
- Python 3.11+
- GitHub CLI
- Supabase project
- OpenAI API key

## Environment Variables

Copy the relevant `.env.example` files and fill in local values. Never commit real secrets.

- Root template: `.env.example`
- Backend template: `backend/.env.example`
- Frontend template: `frontend/.env.example`

## Installation & Local Setup

```bash
git clone https://github.com/rishikkumar84a/scholarai.git
cd scholarai
```

Backend and frontend install commands will be added when those workspaces are scaffolded.

## Running Tests

Backend and frontend test commands will be added with their test suites.

## API Documentation

FastAPI endpoint documentation will be available at `/docs` when the backend is running.

## Demo Video Link

To be added.

## Live Deployment URL

To be added.
