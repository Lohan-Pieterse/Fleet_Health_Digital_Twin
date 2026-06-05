# Fleet Health Digital Twin

## Overview

A lightweight Node.js/Express service that provides a digital twin for fleet health monitoring. The application runs a PostgreSQL database and an Express API server, both containerised with Docker Compose. It includes helper scripts (`ops.sh`) for common dev‑ops tasks.

---

## Prerequisites

- **Node.js** (v20 or later) – for local development without Docker.
- **npm** – comes with Node.
- **Docker Desktop** (or Docker Engine) – to run the containers.
- **Docker Compose** – included with Docker Desktop.
- **Git** – to clone the repository.
- **dotenv** – environment variables are loaded from a `.env` file (generated automatically from the template).

---

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lohan-Pieterse/Fleet_Health_Digital_Twin.git
   cd Fleet_Health_Digital_Twin
   ```
2. **Install Node dependencies**
   ```bash
   npm install
   ```
3. **Create a `.env` file**
   Copy the example and adjust values if needed:
   ```bash
   cp .env.example .env  # if an example exists; otherwise create manually
   ```
   Minimum required variables (the `ops.sh` script will automatically export them when present):
   ```env
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=postgres
   DB_HOST=db
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=postgres
   ```
4. **Initialize the database schema** (optional – Docker will run `config/index.sql` on first start). Ensure the `config` folder contains `index.sql`.

---

## Running Locally

### Option 1 – Docker Compose (recommended)

```bash
# Start the services in the background
./ops.sh start

# View logs (optional)
./ops.sh logs

# Stop the services
./ops.sh stop
```

The API will be reachable at `http://localhost:13000`. Health can be checked with:

```bash
curl http://localhost:3000/api/server/health
```

### Option 2 – Direct Node execution (for rapid iteration)

```bash
# Run the server with auto‑restart on file changes
npm run dev
```

The server listens on port **3000** by default. Ensure the PostgreSQL container is running (use `./ops.sh start` or `docker compose up -d db`).

---

## Helper Commands (`ops.sh`)

| Command | Description |
|---------|-------------|
| `./ops.sh start`    | Starts containers in detached mode. |
| `./ops.sh stop`     | Stops and removes containers. |
| `./ops.sh restart`  | Restarts the stack. |
| `./ops.sh status`   | Shows container status. |
| `./ops.sh logs`     | Streams live logs (all services). |
| `./ops.sh snapshot` | Creates a `config/sqlbackups/backup_<timestamp>.sql` dump of the DB. |
| `./ops.sh seed`     | Placeholder for seeding data (extend as needed). |

---

## Testing the API

The repository includes a simple health endpoint:

- **GET** `/api/server/health` – returns `{ "status": "ok" }` when the server is up.

You can test it locally with:

```bash
curl http://localhost:3000/api/server/health
```

Add further routes under `routes/` and controllers under `controllers/` as the project evolves.

---

## Project Structure

```
├─ config/               # Docker init scripts, SQL backups
├─ controllers/          # Express controller logic
├─ models/               # Database models / query helpers
├─ routes/               # API route definitions
├─ server.js             # Entry point for the Express app
├─ ops.sh                # Convenience Docker‑Compose wrapper
├─ docker-compose.yaml   # Service definitions
├─ package.json          # npm scripts & dependencies
└─ README.md            # (this file)
```

---

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Ensure linting passes (`npm run lint` if configured).
4. Open a Pull Request with a clear description of changes.

---

## License

This project is licensed under the **ISC** license. See the `LICENSE` file for details.
