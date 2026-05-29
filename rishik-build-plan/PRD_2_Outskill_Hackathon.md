# PRD — ScholarAI: AI Research & Scholarship Copilot
## OpenAI x Outskill AI Builders Hackathon
## MVP Direction: May 27 | Final Submission: May 29

---

## 1. PRODUCT OVERVIEW

**Product Name:** ScholarAI
**Tagline:** Your AI copilot for scholarships, research, and academic applications.
**Type:** Multi-agent AI platform
**Built for:** OpenAI x Outskill AI Builders Hackathon
**Primary AI Tool:** OpenAI GPT-4o + text-embedding-3-small (via OpenAI API)

### The Problem
Students applying for scholarships, PhD programs, and research positions spend
hundreds of hours doing tasks that are highly repetitive, stressful, and solvable
with AI:
- Manually browsing dozens of scholarship websites to check eligibility
- Reading 20-page research papers just to find 3 relevant points
- Writing and rewriting SOPs without knowing what to improve
- Having no structured plan for when to do what in a 6-month application cycle
- Building research proposals without knowing the current literature gap

### The Solution
ScholarAI is a multi-agent AI copilot that handles every step of the scholarship
and research application journey — from discovering opportunities to submitting
a polished application — using specialized AI agents working together.

### Why This Wins the Hackathon
- Solves a real, massive pain point (millions of students apply annually)
- Genuinely uses OpenAI APIs in non-trivial ways (embeddings, RAG, agents)
- Has 5 distinct AI features, not just one chatbot
- Aligns perfectly with Codex + OpenAI ecosystem
- Deployable live within hackathon timeline

---

## 2. TARGET USERS

| User Type | Pain Point Solved |
|---|---|
| Undergraduate students | Find scholarships they're actually eligible for |
| Masters/PhD applicants | Write better SOPs and research proposals |
| Research students | Quickly understand research papers without reading fully |
| International students (India focus) | Navigate complex scholarship processes like MEXT, Fulbright, DAAD |

---

## 3. TECH STACK

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS | SSR, fast, modern |
| UI Components | shadcn/ui | Clean, accessible, production-grade |
| Backend | Python 3.11 + FastAPI | Async, OpenAI SDK native |
| LLM | OpenAI GPT-4o | Best reasoning for SOP, roadmap, plans |
| Embeddings | OpenAI text-embedding-3-small | Fast, cheap, accurate |
| Vector Store | Supabase pgvector (free tier) | Postgres + vector in one |
| Database | Supabase (PostgreSQL) | Auth + DB + vector in one platform |
| Auth | Supabase Auth (Google OAuth) | Quick setup, no custom auth needed |
| PDF Parsing | PyMuPDF (fitz) | Extract text from research papers |
| Agent Orchestration | LangGraph (Python) | Multi-agent state machine |
| Frontend Hosting | Vercel | Free, auto-deploy from GitHub |
| Backend Hosting | Railway | Free tier, Docker support |
| Testing | pytest (backend) + Vitest (frontend) | |
| DevOps | GitHub strict workflow (GITHUB_DEVOPS_RULES.md) | |

---

## 4. AGENT ARCHITECTURE

```
USER INPUT (profile + request)
          |
          v
   [Orchestrator Agent]
   (LangGraph StateGraph)
          |
          |──────────────────────────────────────────────|
          |                    |                         |
          v                    v                         v
  [ProfileAgent]      [MatchAgent]              [PaperAgent]
  - Parses user        - Embeds user             - Accepts PDF URL
    academic profile     profile                   or text input
  - Extracts: GPA,     - Runs vector             - Extracts text
    field, country,      similarity search         with PyMuPDF
    degree, skills       against scholarship      - Structured
  - Returns:             embeddings DB              summary:
    profile_json       - Returns: top 10            problem,
                         matched scholarships       method,
                         with % match scores        results,
                                                    relevance,
                                                    citations
          |
          |──────────────────────────────────────────────|
          |                    |                         |
          v                    v                         v
    [SOPAgent]        [RoadmapAgent]         [ResearchPlanAgent]
    - Accepts SOP      - Takes profile +      - Takes research
      text input         target scholarships    topic + profile
    - Scores on 5      - Generates month-     - Identifies key
      dimensions:        by-month timeline      sub-questions
      clarity, fit,    - Task breakdown       - Literature gap
      motivation,        with deadlines         analysis
      specificity,     - Priority flags       - Methodology
      grammar          - Returns: JSON          suggestions
    - Returns            roadmap              - Returns:
      detailed                                  research_plan
      feedback +
      rewritten SOP
```

---

## 5. FEATURE SPECIFICATIONS

### Feature 1 — AI Scholarship Matcher

**How it works:**
1. User fills profile: name, degree level, field of study, GPA, country, language proficiency, research interests
2. ProfileAgent converts profile to structured JSON
3. Profile is embedded using OpenAI text-embedding-3-small
4. Vector similarity search runs against pre-embedded scholarship database
5. Top 10 matches returned with eligibility score (0–100%) and reason

**Scholarship database (seed data for MVP):**
Pre-embed 50 scholarships covering: MEXT (Japan), Fulbright (USA), DAAD (Germany),
Chevening (UK), Commonwealth, Erasmus+, KAIST, NUS, IISC fellowships, and 20 others.

**Output format:**
```json
{
  "matches": [
    {
      "name": "MEXT Research Scholarship",
      "country": "Japan",
      "match_score": 92,
      "eligible": true,
      "reasons": ["Strong STEM background", "GPA above 3.5", "Research interest matches"],
      "deadline": "May 2027",
      "link": "https://...",
      "missing_requirements": ["Japanese language N5 preferred"]
    }
  ]
}
```

---

### Feature 2 — Research Paper Summarizer

**How it works:**
1. User uploads PDF or pastes arXiv URL or paper text
2. PyMuPDF extracts full text
3. PaperAgent sends to GPT-4o with structured output prompt
4. Returns 6-section structured summary

**Output format:**
```json
{
  "title": "...",
  "one_line_summary": "...",
  "problem_statement": "...",
  "methodology": "...",
  "key_findings": ["finding 1", "finding 2", "finding 3"],
  "limitations": "...",
  "relevance_to_user": "...",
  "key_citations": ["Author et al. (2023) — brief relevance"],
  "further_reading": ["suggested paper 1", "suggested paper 2"]
}
```

---

### Feature 3 — SOP & Resume Improvement Assistant

**How it works:**
1. User pastes SOP text and selects target scholarship/program
2. SOPAgent evaluates on 5 dimensions (0–10 each):
   - Clarity of purpose
   - Fit with program
   - Motivation authenticity
   - Specificity of goals
   - Language quality
3. Returns score, dimension-wise feedback, and rewritten improved version
4. User can iterate (up to 3 rounds in MVP)

**Resume analyzer:**
1. User pastes resume text
2. Agent checks: keyword alignment with target, missing sections, weak bullet points
3. Returns bullet-point rewrites and missing keywords

---

### Feature 4 — AI Application Roadmap Generator

**How it works:**
1. User selects target scholarships from their matches (or adds manually)
2. User enters current date and application deadlines
3. RoadmapAgent generates a month-by-month JSON timeline
4. Frontend renders as interactive visual roadmap

**Output format:**
```json
{
  "roadmap": [
    {
      "month": "June 2026",
      "milestone": "Preparation Phase",
      "tasks": [
        { "task": "Request professor recommendation letters", "priority": "high", "duration_days": 7 },
        { "task": "Start MEXT research proposal draft", "priority": "high", "duration_days": 14 }
      ]
    },
    ...
  ]
}
```

---

### Feature 5 — Personalized Research Plan Generator

**How it works:**
1. User enters: research topic, current knowledge level, target degree (MS/PhD), available time
2. ResearchPlanAgent generates:
   - 5 research sub-questions to explore
   - Suggested methodology
   - 3-month study plan with weekly tasks
   - 5 foundational papers to read first
   - Current gap in literature (based on GPT-4o knowledge)

---

## 6. DATABASE SCHEMA (Supabase PostgreSQL)

### users
```sql
id UUID PRIMARY KEY,
email TEXT UNIQUE,
name TEXT,
created_at TIMESTAMP,
profile JSONB  -- academic profile data
```

### scholarships
```sql
id UUID PRIMARY KEY,
name TEXT,
country TEXT,
degree_level TEXT[],  -- ['masters', 'phd', 'undergraduate']
field TEXT[],
gpa_requirement FLOAT,
deadline TEXT,
link TEXT,
description TEXT,
embedding VECTOR(1536),  -- pgvector
created_at TIMESTAMP
```

### papers (summarized)
```sql
id UUID PRIMARY KEY,
user_id UUID REFERENCES users,
title TEXT,
source_url TEXT,
raw_text TEXT,
summary JSONB,
created_at TIMESTAMP
```

### applications
```sql
id UUID PRIMARY KEY,
user_id UUID REFERENCES users,
scholarship_id UUID REFERENCES scholarships,
sop_text TEXT,
sop_score JSONB,
resume_text TEXT,
roadmap JSONB,
status TEXT DEFAULT 'draft',
created_at TIMESTAMP
```

### research_plans
```sql
id UUID PRIMARY KEY,
user_id UUID REFERENCES users,
topic TEXT,
plan JSONB,
created_at TIMESTAMP
```

---

## 7. API ENDPOINTS (FastAPI)

### Profile
```
POST /api/profile/build        → Build profile from form input
GET  /api/profile/me           → Get current user profile
PUT  /api/profile/me           → Update profile
```

### Scholarships
```
POST /api/scholarships/match   → Run vector match against user profile
GET  /api/scholarships/        → List all scholarships in DB
GET  /api/scholarships/:id     → Get one scholarship detail
```

### Papers
```
POST /api/papers/summarize     → Summarize paper (PDF upload or URL)
GET  /api/papers/              → List user's summarized papers
GET  /api/papers/:id           → Get one paper summary
DELETE /api/papers/:id
```

### SOP
```
POST /api/sop/analyze          → Score and improve SOP
POST /api/sop/iterate          → Re-run improvement on updated SOP
POST /api/resume/analyze       → Analyze resume
```

### Roadmap
```
POST /api/roadmap/generate     → Generate application roadmap
GET  /api/roadmap/:id          → Get saved roadmap
```

### Research Plan
```
POST /api/research-plan/generate  → Generate research plan
GET  /api/research-plan/          → List user's plans
GET  /api/research-plan/:id
```

---

## 8. FRONTEND PAGES (Next.js App Router)

```
/                         Landing page — hero, features, CTA
/auth/login               Google OAuth login (Supabase)
/dashboard                Main dashboard after login
/profile/setup            Onboarding — fill academic profile
/scholarships             Scholarship matcher — input + results
/scholarships/:id         Single scholarship detail page
/papers                   Research paper library
/papers/new               Upload/paste paper for summarization
/papers/:id               View structured paper summary
/sop                      SOP analyzer and improver
/resume                   Resume analyzer
/roadmap                  Application roadmap view
/research-plan            Research plan generator
/research-plan/:id        View saved research plan
```

---

## 9. FOLDER STRUCTURE

```
scholarai/
├── frontend/                        (Next.js 14)
│   ├── app/
│   │   ├── page.tsx                 Landing
│   │   ├── dashboard/page.tsx
│   │   ├── profile/setup/page.tsx
│   │   ├── scholarships/page.tsx
│   │   ├── papers/page.tsx
│   │   ├── sop/page.tsx
│   │   ├── roadmap/page.tsx
│   │   └── research-plan/page.tsx
│   ├── components/
│   │   ├── ScholarshipCard.tsx
│   │   ├── PaperSummaryCard.tsx
│   │   ├── SOPScoreCard.tsx
│   │   ├── RoadmapTimeline.tsx
│   │   ├── ProfileForm.tsx
│   │   └── AgentProgressBar.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── api.ts
│   ├── tests/
│   └── package.json
│
├── backend/                         (FastAPI)
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── orchestrator.py
│   │   ├── profile_agent.py
│   │   ├── match_agent.py
│   │   ├── paper_agent.py
│   │   ├── sop_agent.py
│   │   ├── roadmap_agent.py
│   │   └── research_plan_agent.py
│   ├── api/
│   │   ├── routes/
│   │   │   ├── profile.py
│   │   │   ├── scholarships.py
│   │   │   ├── papers.py
│   │   │   ├── sop.py
│   │   │   ├── roadmap.py
│   │   │   └── research_plan.py
│   │   └── main.py
│   ├── db/
│   │   ├── supabase_client.py
│   │   └── seed_scholarships.py     ← seeds 50 scholarships with embeddings
│   ├── utils/
│   │   ├── pdf_parser.py
│   │   └── embeddings.py
│   ├── tests/
│   │   ├── test_match_agent.py
│   │   ├── test_paper_agent.py
│   │   ├── test_sop_agent.py
│   │   └── test_roadmap_agent.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 10. ENVIRONMENT VARIABLES

```
# backend/.env.example
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
SUPABASE_ANON_KEY=
PORT=8000
FRONTEND_URL=https://scholarai.vercel.app

# frontend/.env.example
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=https://your-railway-backend.up.railway.app
```

---

## 11. GITHUB DEVOPS — FEATURE BRANCHES (in order)

All branches follow GITHUB_DEVOPS_RULES.md strictly.
One file written → immediately committed and pushed.
Max 10 files per PR. Copilot reviews all PRs.

```
Phase 1 — Foundation
  feature/project-scaffold           → folder structure, README, .env.example, .gitignore
  feature/supabase-setup             → DB schema SQL, supabase client, pgvector extension
  feature/ci-github-actions          → .github/workflows/ci.yml

Phase 2 — Backend Agents
  feature/embeddings-util            → embeddings.py, openai client setup
  feature/pdf-parser                 → pdf_parser.py + tests
  feature/profile-agent              → profile_agent.py + test
  feature/match-agent                → match_agent.py + vector search + test
  feature/paper-agent                → paper_agent.py + test
  feature/sop-agent                  → sop_agent.py + test
  feature/roadmap-agent              → roadmap_agent.py + test
  feature/research-plan-agent        → research_plan_agent.py + test
  feature/orchestrator               → orchestrator.py (LangGraph graph) + test

Phase 3 — Backend API Routes
  feature/api-profile-routes         → routes/profile.py + main.py registration
  feature/api-scholarship-routes     → routes/scholarships.py
  feature/api-paper-routes           → routes/papers.py
  feature/api-sop-routes             → routes/sop.py
  feature/api-roadmap-routes         → routes/roadmap.py
  feature/api-research-plan-routes   → routes/research_plan.py

Phase 4 — Scholarship Seed Data
  feature/seed-scholarships          → seed_scholarships.py (50 scholarships + embeddings)

Phase 5 — Frontend
  feature/frontend-landing           → app/page.tsx + hero section
  feature/frontend-auth              → Supabase Google OAuth + login page
  feature/frontend-dashboard         → dashboard/page.tsx + layout
  feature/frontend-profile-setup     → profile/setup/page.tsx + ProfileForm.tsx
  feature/frontend-scholarship-match → scholarships/page.tsx + ScholarshipCard.tsx
  feature/frontend-paper-summarizer  → papers/page.tsx + PaperSummaryCard.tsx
  feature/frontend-sop-analyzer      → sop/page.tsx + SOPScoreCard.tsx
  feature/frontend-roadmap           → roadmap/page.tsx + RoadmapTimeline.tsx
  feature/frontend-research-plan     → research-plan/page.tsx

Phase 6 — Deployment
  feature/docker-setup               → Dockerfile + docker-compose.yml
  feature/vercel-config              → vercel.json
  feature/railway-config             → railway.json or Procfile
```

---

## 12. UNIT TESTS REQUIRED

```python
# backend/tests/test_match_agent.py
def test_match_agent_returns_10_results()
def test_match_score_is_between_0_and_100()
def test_match_reasons_are_non_empty()
def test_missing_requirements_returned_when_applicable()

# backend/tests/test_paper_agent.py
def test_paper_agent_returns_all_6_sections()
def test_key_findings_is_a_list()
def test_one_line_summary_is_under_100_words()

# backend/tests/test_sop_agent.py
def test_sop_score_returns_5_dimensions()
def test_each_dimension_score_is_0_to_10()
def test_improved_sop_is_longer_than_feedback()

# backend/tests/test_roadmap_agent.py
def test_roadmap_returns_monthly_milestones()
def test_each_task_has_priority_field()
def test_roadmap_covers_at_least_3_months()
```

---

## 13. DEPLOYMENT PLAN

| Service | Platform | Cost |
|---|---|---|
| Frontend | Vercel (free tier) | Free |
| Backend | Railway (free tier, 500hrs/month) | Free |
| Database + Vector | Supabase (free tier) | Free |
| OpenAI API | Pay per token | ~$2–5 for demo usage |
| Domain | scholarai.vercel.app | Free |

**Deploy order:**
1. Supabase project → run schema SQL → enable pgvector → seed scholarships
2. Backend → Railway → set env vars → get backend URL
3. Frontend → Vercel → set NEXT_PUBLIC_API_URL to Railway URL → deploy

---

## 14. DEMO VIDEO GUIDE (Record on May 28–29)

**Script (3 minutes):**
1. Open scholarai.vercel.app — show landing page
2. Login with Google
3. Fill profile: "Computer Science, BTech, India, GPA 8.4, AI/ML interests"
4. Run scholarship match — show MEXT, Fulbright, DAAD results with scores
5. Upload a research paper PDF — show structured summary appear
6. Paste a sample SOP — show score + improved version
7. Generate application roadmap — show timeline visualization
8. Generate research plan for "LLMs in Education"
9. Show GitHub repo — clean commit history, merged PRs, Copilot reviews

---

## 15. SUBMISSION CHECKLIST

```
[ ] GitHub repo PUBLIC: github.com/rishikkumar84a/scholarai
[ ] Live URL working: scholarai.vercel.app
[ ] README complete with all setup instructions
[ ] Demo video uploaded (Loom or YouTube unlisted, under 3 min)
[ ] All tests passing (CI green)
[ ] Submit MVP direction by May 27
[ ] Final submission by May 29
[ ] Share on LinkedIn using Outskill template: reflections.outskill.com/openai
```
