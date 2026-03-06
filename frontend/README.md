# 🤖 AI Grant Generator

An intelligent, full-stack platform that leverages multi-agent AI workflows to help non-profits and organizations **discover**, **draft**, and **review** grant proposals — all powered by LangGraph, LangChain, FastAPI, and Next.js.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [AI Agents](#ai-agents)
  - [1. Grant Search Agent](#1-grant-search-agent)
  - [2. Grant Generation Agent](#2-grant-generation-agent)
  - [3. Grant Reviewer Agent](#3-grant-reviewer-agent)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
  - [Prerequisites](#prerequisites)
  - [Option A — Docker (Recommended)](#option-a--docker-recommended)
  - [Option B — Manual Setup](#option-b--manual-setup)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Deployment](#deployment)

---

## Overview

AI Grant Generator is a full-stack AI application that automates and streamlines the grant lifecycle:

1. **Search** relevant grant opportunities from [Grants.gov](https://grants.gov) based on a keyword and project description.
2. **Generate** a complete, professional grant proposal — including cover letter, executive summary, budget narrative, evaluation plan, and more — using a parallel multi-agent LangGraph pipeline.
3. **Review** an existing grant application and receive an AI-powered score, strengths analysis, and improvement suggestions.

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router & server components |
| **React 19** | UI component library |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS v4** | Utility-first styling |
| **Radix UI** | Accessible, headless UI primitives (Dialog, Select, Dropdown, etc.) |
| **Tiptap** | Rich text editor for grant proposal editing |
| **GSAP / Motion** | Animations and micro-interactions |
| **Zustand** | Lightweight global state management |
| **React Hook Form + Zod** | Form handling and schema validation |
| **Axios** | HTTP client for API calls |
| **React Toastify / Sonner** | Toast notification system |
| **Lucide React + Tabler Icons** | Icon libraries |
| **Three.js / @react-three/fiber** | 3D graphics for landing page visuals |
| **tsParticles** | Particle animations |

### Backend

| Technology | Purpose |
|---|---|
| **FastAPI** | High-performance Python REST API framework |
| **LangGraph** | Stateful multi-agent workflow orchestration |
| **LangChain** | LLM chaining, prompts, and output parsers |
| **Google Gemini (via `langchain-google-genai`)** | LLM powering grant review and resume generation |
| **Groq (OpenAI-compatible, via `langchain-groq`)** | LLM powering grant search scoring and generation |
| **MongoDB (Motor)** | Async NoSQL database for user data and grant history |
| **Redis** | Session caching and rate limiting |
| **Pydantic** | Data validation and schema definition |
| **WeasyPrint / ReportLab / python-docx** | PDF and DOCX export of grant proposals and resumes |
| **PyPDF** | PDF parsing for uploaded documents |
| **Passlib + Argon2 + python-jose** | Authentication (hashing & JWT tokens) |
| **Uvicorn** | ASGI server for FastAPI |

### Infrastructure

| Tool | Purpose |
|---|---|
| **Docker + Docker Compose** | Containerised local and production deployment |
| **Vercel** | Frontend hosting |
| **Render** | Backend hosting |

---

## AI Agents

All agents are implemented as **LangGraph `StateGraph` pipelines**, where each node is an async function responsible for one discrete task. State is passed between nodes and accumulated until the graph reaches its finish point.

---

### 1. Grant Search Agent

**File:** `backend/app/ai_agents/search_grant.py`

This agent uses a two-node sequential graph to find and rank grant opportunities that match a user's project.

```
[search_grants] ──► [fetch_and_score]
```

**How it works:**

1. **`search_grants` node**
   - Calls the [Grants.gov REST API](https://api.grants.gov) with a user-provided keyword (e.g., `"education"`, `"healthcare"`).
   - Fetches up to 10 matching grant opportunities and extracts metadata: title, agency, open/close dates, and the direct Grants.gov link.

2. **`fetch_and_score` node**
   - For each grant found, fetches the full opportunity detail (synopsis) from Grants.gov.
   - Truncates the synopsis to 150 words and sends it along with the user's project description to a **Groq-hosted LLM**.
   - The LLM scores relevance from **1–100** using the prompt:
     > *"Score relevance of this grant synopsis to the project description from 1 to 100."*
   - All grants are scored concurrently using `asyncio.gather`.
   - The final list is sorted by score (highest first) and returned to the frontend.

**Output:** A ranked list of grant opportunities with relevance scores, ready to display in the UI.

---

### 2. Grant Generation Agent

**File:** `backend/app/ai_agents/generate_grant.py`

This is the core agent of the platform. It uses a **parallel multi-node LangGraph pipeline** to generate all sections of a grant proposal simultaneously, then aggregates them into a structured document.

```
             ┌─► cover_letter          ─┐
             ├─► executive_summary     ─┤
             ├─► statement_of_need     ─┤
START ───────├─► project_description  ─┼──► aggregate ──► END
             ├─► organization_background─┤
             ├─► evaluation_plan      ─┤
             ├─► budget_section       ─┤
             ├─► sustainability_plan  ─┤
             └─► additional_section   ─┘
```

All section nodes fan out from `START` in parallel (using `add_edge(START, node)` for each), dramatically reducing total generation time.

**Grant Sections Generated:**

| Section | What the LLM Produces |
|---|---|
| **Cover Letter** | Formal letter addressed to the funder with project overview and funding ask |
| **Executive Summary** | Concise synthesis of the problem, solution, impact, and budget |
| **Statement of Need** | Data-backed narrative explaining why the project is urgently necessary |
| **Project Description** | Detailed blueprint: goals, activities, timeline, risk mitigation |
| **Organization Background** | History, mission/vision, and key achievements of the applicant org |
| **Evaluation Plan** | SMART objectives and measurement framework for project success |
| **Budget Section** | Itemised budget table with justification for each expense line |
| **Sustainability Plan** | Strategy for maintaining project impact after the grant period |
| **Additional Section** | Dynamically titled and written custom section (e.g. mentorship, partnerships) |

**Aggregation node** re-orders all sections into the correct sequence, and the final structured document is returned to the API.

The agent supports **multi-language output** — all sections are generated in the language specified by the user.

---

### 3. Grant Reviewer Agent

**File:** `backend/app/services/grant_reviewer/utils.py`

This agent accepts an uploaded grant proposal document (PDF/DOCX) and a description of what the grant is for, then uses **Google Gemini** to produce a structured review.

**How it works:**

1. The uploaded file is parsed into plain text using a document loader (`PyPDF` / `python-docx`).
2. The text is sent along with the grant description to **Gemini (`gemini-2.5-flash-lite`)** using a `ChatPromptTemplate`.
3. A `PydanticOutputParser` enforces a structured JSON output matching the `GrantReviewOutput` schema.

**Review Output Includes:**
- **Score** (funding selection likelihood)
- **Strengths** of the proposal
- **Weaknesses / Areas for Improvement**
- **Specific Recommendations**



---

## Project Structure

```
AI_GRANT_GENERATOR/
├── docker-compose.yml          # Orchestrates frontend, backend, and MongoDB
├── frontend/                   # Next.js application
│   ├── app/
│   │   ├── (agents)/           # Agent pages (grant search, generate, review, resume)
│   │   ├── (auth)/             # Login & registration pages
│   │   ├── (user)/             # User profile & history
│   │   └── landing-pages/      # Marketing / home pages
│   ├── components/             # Reusable UI components
│   ├── lib/                    # API clients, utilities, hooks
│   └── package.json
└── backend/                    # FastAPI application
    ├── app/
    │   ├── ai_agents/          # LangGraph agent definitions
    │   │   ├── search_grant.py
    │   │   ├── generate_grant.py
    │   │   ├── resume_agent.py
    │   │   └── grant_reviewer.py
    │   ├── api/v1/             # REST API route handlers
    │   ├── services/           # Business logic per agent
    │   ├── models/             # MongoDB document models
    │   ├── schemas/            # Pydantic request/response schemas
    │   ├── utils/              # Shared utilities (document loaders, etc.)
    │   └── main.py             # FastAPI app entry point
    └── requirements.txt
```

---

## Local Setup

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [Python](https://www.python.org/) 3.10+
- [Docker](https://www.docker.com/) & Docker Compose (for Option A)
- [MongoDB](https://www.mongodb.com/) (for Option B — manual)

---

### Option A — Docker (Recommended)

This spins up the frontend, backend, and MongoDB database together.

**1. Clone the repository**

```bash
git clone https://github.com/your-username/AI_GRANT_GENERATOR.git
cd AI_GRANT_GENERATOR
```

**2. Create the root `.env` file**

```bash
cp .env.example .env   # or create it manually (see Environment Variables below)
```

**3. Start all services**

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| MongoDB | mongodb://localhost:27017 |

**4. Stop all services**

```bash
docker compose down
```

---

### Option B — Manual Setup

#### Backend

**1. Navigate to the backend directory and create a virtual environment**

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Linux/macOS
# venv\Scripts\activate        # Windows
```

**2. Install dependencies**

```bash
pip install -r requirements.txt
```

**3. Create `backend/.env`** (see [Environment Variables](#environment-variables))

**4. Start the FastAPI server**

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`. Swagger docs at `http://localhost:8000/docs`.

---

#### Frontend

**1. Navigate to the frontend directory**

```bash
cd frontend
```

**2. Install dependencies**

```bash
npm install
```

**3. Create `frontend/.env`**

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**4. Start the development server**

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

### Root `.env` (used by Docker Compose)

```env
# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=yourpassword
MONGO_INITDB_DATABASE=grant_db

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend (Vercel / Render URLs for production)
VERCEL_FRONTEND_URL=
RENDER_EXTERNAL_HOSTNAME=
```

### Backend `.env`

```env
# AI Provider Keys
GOOGLE_API_KEY=your_google_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# MongoDB
MONGO_URL=mongodb://admin:yourpassword@localhost:27017/grant_db?authSource=admin

# Auth
SECRET_KEY=your_jwt_secret_key

# Deployment
VERCEL_FRONTEND_URL=
RENDER_EXTERNAL_HOSTNAME=
```

> **API Keys:**
> - Get a **Google Gemini** API key from [Google AI Studio](https://aistudio.google.com/)
> - Get a **Groq** API key from [console.groq.com](https://console.groq.com/)

---

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive JWT token |
| `POST` | `/agents/search-grants` | Search and score grant opportunities |
| `POST` | `/agents/generate-grant` | Generate a full grant proposal |
| `POST` | `/agents/review-grant` | Review an uploaded grant proposal |
| `POST` | `/agents/resume` | Generate an ATS-optimised resume |
| `GET` | `/users/history` | Retrieve user's grant history |
| `POST` | `/export/pdf` | Export grant as PDF |
| `POST` | `/export/docx` | Export grant as DOCX |

Full interactive API documentation is available at `http://localhost:8000/docs` when the backend is running.

---

## Deployment

### Frontend — Vercel

The frontend is configured for Vercel deployment via `frontend/vercel.json`. Connect your GitHub repo to Vercel and set the `NEXT_PUBLIC_API_URL` environment variable to point to your deployed backend.

### Backend — Render

The backend is configured for deployment on [Render](https://render.com). Set all required environment variables in the Render dashboard. The `RENDER_EXTERNAL_HOSTNAME` variable is automatically injected by Render and is used for CORS configuration.

### Docker Production Deployment

Remove the `volumes` (hot-reload mounts) from `docker-compose.yml` before deploying to production:

```yaml
# Remove these lines in production:
volumes:
  - ./backend:/app
  - ./frontend:/app
```

---

> Built with ❤️ using LangGraph, FastAPI, and Next.js.
