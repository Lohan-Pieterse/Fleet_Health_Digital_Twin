# TODO List for Digital Twin Project

## Phase 1 – Planning & Setup
<!-- - **Initialize Git** – Create a local repository to track progress. -->
- **Design DB schema** – Model heartbeat data in PostgreSQL; optimise for "latest status per host" queries.
- **Plan API** – Define URL paths and response shapes for ingestion and reporting endpoints.
- **Track AI usage** – Keep a scratchpad of prompts for later explanation.

## Phase 2 – Database & Orchestration Foundation
- **Draft `docker-compose.yml`** – Spin up PostgreSQL with a persistent volume and env‑var configuration.
- **Bootstrap script** – Write a SQL migration or script that creates the schema on container start.

## Phase 3 – Backend Development
- **Initialize Node.js project** (Node 18+; JS or TS).
- **Database connection** – Pull credentials from env vars, use a reusable pool.
- **Ingestion route** – Accept JSON heartbeat payloads; insert with parameterised queries.
- **Reporting routes** – Implement queries for:
  - Latest status per host.
  - Fleet‑wide summary.
- **Production polish** – Add JSON‑structured logging and graceful shutdown handling.

## Phase 4 – Containerising the App
- **Write multi‑stage Dockerfile** – Run the app as a non‑root user.
- **Add app service to `docker-compose.yml`.**
- **Health checks** – Ensure DB and app start only when healthy.

## Phase 5 – Operational Bash Script (`ops.sh`)
- Create a POSIX‑ish script to manage the stack.
- Sub‑commands: `start`, `stop`, `restart`, `status`.
- Utilities: tail/filter logs, snapshot DB, send synthetic heartbeat data.
- (Optional) Remote SSH helper sub‑command for diagnostics.

## Phase 6 – Documentation
- **README** – Instructions to run locally via the ops script and Compose.
- **SOLUTION.md** – Architecture rationale, design trade‑offs, and AI prompt logs.

## Phase 7 – Video Recording & Submission
- Record a 5‑10 min walkthrough (e.g., Loom).
- Explain key decisions and omitted alternatives.
- Share the GitHub repo and video link as required.