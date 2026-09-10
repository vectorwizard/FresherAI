# FresherAI

FresherAI is an AI-powered career preparation platform for students and freshers. The project combines a React frontend with a set of Express microservices that help users prepare for interviews, build resumes, generate learning roadmaps, and buy interview coins for premium AI usage.

The experience is built around a simple idea: make interview practice accessible, measurable, and personalized.

**Live App:** [fresher-ai-two.vercel.app](https://fresher-ai-two.vercel.app/)

## Overview

This repository is structured as a monorepo with two main areas:

- `frontend/` — Vite + React application for the end-user experience
- `backend/` — API gateway and multiple backend services for auth, resume analysis, interviews, roadmaps, and billing

The application uses Google sign-in, Redis session storage, MongoDB persistence, Firebase-admin auth, Groq-powered LLM workflows, and a Razorpay payment flow for interview coins.

## Key Features

- Google authentication with Firebase
- Session-based user tracking in Redis
- Resume builder and resume scoring workflow
- ATS-style resume analysis using AI
- HR and technical mock interview generation
- Real-time interview feedback and final summary report
- Personalized roadmap generation by role and target package
- Learning resources with YouTube video lookup and article suggestions
- Interview coin system with plan-based upgrades
- Razorpay payment integration for coin purchases
- Dashboard analytics for interview performance

## System Architecture

The app is split into a gateway and service layer:

- `backend/gateway` handles public API routing, session validation, and cookie-based auth checks
- `backend/services/auth` handles Google login, logout, coin usage, and session creation
- `backend/services/resume` extracts resume text, calls the AI agent, and stores analyzed resume data
- `backend/services/interview` generates interview questions, scores answers, and creates final reports
- `backend/services/roadmap` builds personalized learning plans and fetches learning resources
- `backend/services/billing` creates and verifies Razorpay orders and updates coin balances

### Microservice Architecture Diagram

```text
┌──────────────────────────────────────────────────────────────────────┐
│                          Frontend (React + Vite)                     │
│  /, /dashboard, /resume, /scorer, /interview, /roadmap, /billing     │
└───────────────────────────────────────────────┬──────────────────────┘
                                                │ HTTP / REST / cookies
                                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                           API Gateway                                │
│                    backend/gateway/index.js                          │
│  - CORS and cookie parsing                                           │
│  - route proxying to services                                        │
│  - auth middleware checks                                            │
└───────────────────────────────┬──────────────────────────────────────┘
                                │
                                ▼
                    ┌────────────────────────────────────┐
                    │        Auth + Core Services        │
                    │                                    │
                    │  ┌──────────────┐  ┌──────────────┐│
                    │  │ Auth Service │  │ Resume       ││
                    │  │ :6001        │  │ Service      ││
                    │  │ Login/logout │  │ :6002        ││
                    │  │ session      │  │ PDF parse    ││
                    │  └──────────────┘  └──────────────┘│ 
                    │                                    │
                    │                                    │
                    │                                    │
                    │  ┌──────────────┐  ┌──────────────┐│
                    │  │ Interview    │  │ Roadmap      ││
                    │  │ Service      │  │ Service      ││
                    │  │ :6003        │  │ :6004        ││
                    │  │ mock Qs      │  │ roadmap gen  ││
                    │  │ feedback     │  │ learning res ││
                    │  └──────────────┘  └──────────────┘│
                    │                                    │
                    │  ┌──────────────┐                  │
                    │  │ Billing      │                  │
                    │  │ Service      │                  │
                    │  │ :6005        │                  │
                    │  │ Razorpay     │                  │
                    │  │ coin updates │                  │
                    │  └──────────────┘                  │
                    └────────────────────────────┬───────┘
                                                 │
                                                 ▼
                               ┌────────────────────────────────────┐
                               │ MongoDB + Redis + Firebase         │
                               │ - users / resumes / interviews     │
                               │ - roadmaps / sessions / cache      │
                               │ - Firebase auth validation         │
                               └────────────────────────────────────┘
```

This is the real request flow in the project: all frontend requests are sent to the gateway first, and the gateway proxies them to the correct microservice. Each service is independent but shares the same user session and persistence layer.

## AI & Orchestration Layer

The project uses LangChain and LangGraph for its AI workflows:

- `@langchain/core` and `@langchain/groq` are used to build model calls and prompt execution
- `@langchain/langgraph` is used in the roadmap and interview services to model stateful multi-step workflows
- The interview service uses a graph with nodes for interview generation, answer feedback, and summary generation
- The roadmap service uses a graph with a roadmap generation node and a resource enrichment node
- The resume service also invokes a structured LLM flow to turn parsed PDF text into ATS-focused JSON output

In practice, LangGraph is used to orchestrate multi-step agent logic, while LangChain handles message construction, model invocation, and result parsing.

### LangGraph Diagram for Interview Flow

```text
START
  │
  ├─ action = "start" ──> interviewAgent
  │                         │
  │                         └──> END
  │
  └─ action = "feedback" ──> feedbackAgent
                              │
                              ├─ completed == true ──> summaryAgent ──> END
                              │
                              └─ completed == false ───────────────> END
```

The actual interview graph in the code is a `StateGraph` with these nodes:

- `interviewAgent`
- `feedbackAgent`
- `summaryAgent`

Route logic:

- start flow goes to `interviewAgent`
- feedback flow goes to `feedbackAgent`
- if the answer completes the interview, it calls `summaryAgent`

### LangGraph Diagram for Roadmap Flow

```text
START
  │
  ▼
roadmapAgent
  │
  ▼
resourceAgent
  │
  ▼
END
```

The roadmap graph is also a `StateGraph` built in `backend/services/roadmap/graph/roadmap.graph.js` and performs two sequential steps:

1. `roadmapAgent` generates the learning plan from role, target package, and optionally resume data
2. `resourceAgent` enriches each module with article links and YouTube references

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Redux Toolkit
- Tailwind CSS
- Recharts
- Firebase web SDK
- Axios
- Framer Motion style animations

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- Redis with ioredis
- Firebase Admin SDK
- LangChain + LangGraph
- Groq models via `@langchain/groq`
- Razorpay
- Multer + PDF parsing for resume upload analysis
- Stateful AI pipelines for resume scoring, mock interviews, and roadmap generation

## Repository Structure

```text
FresherAI/
├── backend/
│   ├── docker-compose.yml
│   ├── gateway/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── shared/
│   │   ├── utils/
│   │   ├── index.js
│   │   └── package.json
│   ├── services/
│   │   ├── auth/
│   │   ├── billing/
│   │   ├── interview/
│   │   ├── resume/
│   │   ├── roadmap/
│   │   └── ...
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── .gitignore
└── README.md
```

## Core User Journey

1. User signs in with Google.
2. The auth service verifies the Firebase token and creates a secure session in Redis.
3. The user can create or update their resume.
4. Resume scoring extracts PDF text and passes it to an AI analysis agent.
5. The user starts a technical or HR mock interview.
6. The interview engine asks questions, evaluates the answer, and generates a summary report.
7. The user can generate a road map for target roles and package expectations.
8. The user can pay for more interview coins and continue using the platform.

## Environment Configuration

The app depends on environment variables for MongoDB, Redis, Firebase, Groq, Razorpay, and YouTube search.

### Frontend variables

Create a `.env` file inside `frontend/`:

```env
VITE_BACKEND_URL=http://localhost:6000
VITE_FIREBASE_APIKEY=your_firebase_web_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Gateway variables

Create a `.env` file inside `backend/gateway/`:

```env
PORT=6000
AUTH_SERVICE_URL=http://localhost:6001
RESUME_SERVICE_URL=http://localhost:6002
INTERVIEW_SERVICE_URL=http://localhost:6003
ROADMAP_SERVICE_URL=http://localhost:6004
BILLING_SERVICE_URL=http://localhost:6005
REDIS_URL=redis://localhost:6379
```

### Auth service variables

Create a `.env` file inside `backend/services/auth/`:

```env
PORT=6001
MONGODB_URL=mongodb://localhost:27017/fresherai
REDIS_URL=redis://localhost:6379
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Resume service variables

Create a `.env` file inside `backend/services/resume/`:

```env
PORT=6002
MONGODB_URL=mongodb://localhost:27017/fresherai
REDIS_URL=redis://localhost:6379
GROQ_API_KEY=your_groq_api_key
```

### Interview service variables

Create a `.env` file inside `backend/services/interview/`:

```env
PORT=6003
MONGODB_URL=mongodb://localhost:27017/fresherai
REDIS_URL=redis://localhost:6379
GROQ_API_KEY=your_groq_api_key
```

### Roadmap service variables

Create a `.env` file inside `backend/services/roadmap/`:

```env
PORT=6004
MONGODB_URL=mongodb://localhost:27017/fresherai
REDIS_URL=redis://localhost:6379
GROQ_API_KEY=your_groq_api_key
YOUTUBE_API_KEY=your_youtube_data_api_key
```

### Billing service variables

Create a `.env` file inside `backend/services/billing/`:

```env
PORT=6005
MONGODB_URL=mongodb://localhost:27017/fresherai
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## API Endpoints

Below are the request routes used by the frontend and proxied through the gateway.

### Gateway / User-facing API

#### Auth

- `GET /api/me` — fetch the authenticated user from the session
- `POST /api/auth/login` — Google login, verifies Firebase token and creates a Redis session
- `POST /api/auth/logout` — logs out the user and clears the session cookie
- `POST /api/auth/use-coins` — deducts coins for a feature like resume scoring, interviews, or roadmap generation
- `POST /api/auth/add-coins` — credits coins after a successful payment

#### Resume

- `POST /api/resume/upload` — uploads a PDF resume and triggers resume analysis
- `GET /api/resume/get-resume` — fetches the current user’s analyzed resume

#### Interview

- `POST /api/interview/start` — starts a new HR or technical interview and returns the first question
- `POST /api/interview/answer` — submits an answer and receives feedback or the next question
- `GET /api/interview/all` — fetches interview history, metrics, and analytics for the current user
- `GET /api/interview/:id` — fetches one interview session by id

#### Roadmap

- `POST /api/roadmap/generate` — generates a personalized roadmap for a target role and cost package
- `GET /api/roadmap/all` — fetches all saved roadmaps for the current user
- `GET /api/roadmap/:id` — fetches a specific roadmap by id

#### Billing

- `POST /api/billing/create` — creates a Razorpay order for a coin plan
- `POST /api/billing/verify` — verifies Razorpay payment signature and marks the payment as successful

#### Root

- `GET /` — gateway health check, returns a simple hello message

### Service-Level Routes (internal/private)

These are the direct routes inside each microservice before the gateway passes them through:

#### Auth Service

- `POST /login` — Google auth handler
- `POST /logout` — logout handler
- `POST /use-coins` — use interview coins
- `POST /add-coins` — add coins manually / after purchase

#### Resume Service

- `POST /upload` — upload and analyze resume PDF
- `GET /get-resume` — retrieve saved resume data

#### Interview Service

- `POST /start` — create a mock interview
- `POST /answer` — evaluate answer and continue interview
- `GET /all` — all interviews for a user
- `GET /:id` — fetch a single interview

#### Roadmap Service

- `POST /generate` — generate roadmap
- `GET /all` — fetch all roadmaps
- `GET /:id` — fetch roadmap by id

#### Billing Service

- `POST /create` — create Razorpay order
- `POST /verify` — verify payment

## Local Development Setup

### 1. Start Redis

```bash
cd backend
docker compose up -d redis
```

### 2. Install dependencies

Install dependencies for each package in the monorepo:

```bash
cd frontend && npm install
cd ../backend/gateway && npm install
cd ../backend/services/auth && npm install
cd ../backend/services/resume && npm install
cd ../backend/services/interview && npm install
cd ../backend/services/roadmap && npm install
cd ../backend/services/billing && npm install
```

### 3. Start backend services

Open separate terminals and run:

```bash
cd backend/gateway && npm run dev
cd backend/services/auth && npm run dev
cd backend/services/resume && npm run dev
cd backend/services/interview && npm run dev
cd backend/services/roadmap && npm run dev
cd backend/services/billing && npm run dev
```

### 4. Start frontend

```bash
cd frontend
npm run dev
```

The frontend usually runs on Vite's default port `5173`, while the backend gateway is exposed on `6000` and each service uses ports `6001` through `6005`.

## Application Flow

### Resume Builder and Scorer

Users can upload a PDF resume. The resume service extracts text, sends it to an AI agent, and parses the output into structured data like summary, skills, projects, education, strengths, weaknesses, and suggested role. The frontend then displays the resume score and recommendations.

### Interview Engine

Users choose a target role and interview type. The interview service creates personalized technical or HR questions. Every answer is evaluated with a feedback model, and the system stores the final interview report with score, strengths, weaknesses, and recommendations.

### Roadmap Generator

The roadmap service uses a LangGraph workflow. One agent creates the road map, and a second agent enhances it with relevant YouTube and article resources. This helps users move from a target job role to a structured learning path.

### Billing and Coins

Each AI feature consumes interview coins. Users can buy a starter pack using Razorpay. The billing service creates an order, verifies the payment, and credits the user's coins in the auth flow.

## Notes

- The project is built as a microservice architecture rather than a single app server.
- The app relies on secure HTTP-only cookies for session tracking.
- Several modules use Redis to cache user data and reduce repeated database queries.
- The codebase is designed around AI-driven workflows for interview preparation and career guidance.
- As shipped, this repository does not include a centralized root test suite; the project is primarily run and validated through local development and manual API usage.

## License

This project currently uses the ISC license as defined in the package metadata for the backend and frontend package files.

## Summary

FresherAI is a full-stack, AI-first interview coaching platform focused on fresher hiring readiness. It blends resume intelligence, mock interview practice, coach-like evaluation, roadmap guidance, and a coin-based monetization model into one cohesive product experience.
