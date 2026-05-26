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
python -m pip install -r backend/requirements.txt
```

Apply `backend/db/schema.sql` in the Supabase SQL editor or through the Supabase CLI after creating a project. The schema enables pgvector, creates the MVP tables, and adds a scholarship vector search function.

Frontend install commands will be added when that workspace is scaffolded.

## Running Tests

```bash
python -m pytest backend/tests
```

Frontend test commands will be added with the frontend test suite.

## API Documentation

FastAPI endpoint documentation will be available at `/docs` when the backend is running.

## Demo Video Link

To be added.

## Live Deployment URL

To be added.
