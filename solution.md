# Solution.md

## Overview

This service is a lightweight internal "digital twin" that ingests heartbeat and incident signals from servers, persists them to PostgreSQL, and exposes reporting endpoints. It 
is containerised with Docker Compose and ships with an ops.sh helper script for day-to-day operations.

## Project Structure

The project follows an MVC-like layout:
- config/ # DB connection pool and SQL schema/backup file
- controllers/ # Request handlers — input validation and response shaping
- models/ # All SQL queries — the only layer that touches the DB
- routes/ # Express routers mapping HTTP verbs to controllers
- server.js # Entry point, signal handling, graceful shutdown
- ops.sh # Operational helper script
- docker-compose.yaml
- Dockerfile

By separating all the different types of code it is easier to know where to look for something if you would want to change code or add new code.

## API Design

All responses are wrapped in a {data: ...} envelope for consistency.
Please view the planning/Other/api.md for more info on the apis.

### Heartbeat
- POST /api/heartbeat/ — Ingest a heartbeat (upserts the host record AND inserts a heartbeat row)
- GET /api/heartbeat/ — Latest heartbeat for every known host
- GET /api/heartbeat/latest/:hostId — Latest heartbeat for a specific host
- GET /api/heartbeat/history/:hostId — Full heartbeat history for a specific host

### Hosts
- POST /api/hosts — Upsert a host record
- GET /api/hosts/ — All known hosts
- GET /api/hosts/summary — Unified latest-status summary across all known hosts
- GET /api/hosts/status/:hostId — Latest status for a specific host

### Incidents
- POST /api/incidents/error — Ingest an error/incident signal
- GET /api/incidents/ — Recent incidents (default limit 50)
- GET /api/incidents/latest — Latest incident per host

### Server
- GET /api/server/health — Database connectivity check and server uptime

### HTTP Status Codes

- 200 — success
- 400 — bad request (e.g. malformed or missing fields in the payload)
- 404 — host or resource not found
- 500 — unexpected server error (caught in the catch block)

## Database Schema

### hosts

Stores one row per known host. The row is continuously updated to reflect the latest known state (IP, CPU load, memory, service health, last seen timestamp). This acts as a 
live snapshot.

### heartbeats

Append-only table. Every inbound heartbeat is inserted here, giving a full time-series history per host.

### incidents

Append-only table. Every inbound error signal is inserted here, referencing the host.

### Design decision — denormalised hosts row

The hosts table duplicates some data that also exists in heartbeats and incidents. This was a deliberate trade-off: keeping the latest state on hosts means the summary and 
latest-status endpoints are a single cheap query (SELECT * FROM hosts) rather than a correlated subquery or DISTINCT ON against potentially large heartbeat tables. The cost is 
that writes touch two tables, but for a heartbeat ingest pattern that cost is acceptable.

### Indexes


CREATE INDEX IF NOT EXISTS idx_hosts_created_at ON hosts (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_heartbeats_host_timestamp ON heartbeats (host_id, host_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_incidents_host_ts ON incidents (host_id, host_timestamp DESC);


The compound indexes on `(host_id, host_timestamp DESC)` support efficient lookups of history for a given host in reverse-chronological order. All indexes use `IF NOT EXISTS` so re-running the schema file on an existing database is safe.

## Schema Initialisation
The schema SQL lives in config/sqlbackups/backup.sql. In docker-compose.yaml this file is mounted into the PostgreSQL container at /docker-entrypoint-initdb.d/index.sql, which 
the official Postgres image automatically executes on first startup.

This path was also chosen because ops.sh snapshot writes its pg_dump output to the same file. This means that after taking a snapshot, if the Docker volume is ever torn down 
and recreated, the next docker compose up will restore the database to the state captured in the snapshot — effectively making the snapshot the new baseline.

## Docker
Multi-stage Dockerfile: builder installs dependencies, production copies only what is needed and runs as the non-root node user. The app has a wget health check; Compose starts 
the app only after Postgres passes its pg_isready check.

## Logging & Shutdown
Structured JSON logs via native JSON.stringify — no external library needed for this scope. On SIGINT/SIGTERM, the server stops accepting connections first, then the DB pool is 
closed.

## Trade-offs

- No auth
  - acceptable for an internal service; production would need API key validation.
- No DELETE/PUT
  - signals are immutable by design. A corrective signal replaces a bad one, deleting operational history can be bad if we needed that data in the future.
- Denormalised hosts 
  - double-write cost on ingestion, but read queries are trivially simple.
- JavaScript over TypeScript
  - TypeScript would have improved type safety and made the codebase more robust, but the time cost of setting it up and typing the whole service was not justified given the 
    tight scope of this assignment. It would be the first thing added if this were extended.