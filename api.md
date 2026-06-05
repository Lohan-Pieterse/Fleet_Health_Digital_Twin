# API Documentation

## Overview
This comprehensive reference describes all HTTP endpoints exposed by the **Fleet Health Digital Twin** service. For each route we list:
- HTTP method and URL path
- Required request parameters (path, query, JSON body)
- Brief description of the operation
- Typical success and error responses

---

## Heartbeat API (`routes/heartbeat_Routes.js`)
| Method | Path | Description |
|--------|------|-------------|
| **POST** | `/` | Ingest a new heartbeat entry |
| **GET** | `/` | Retrieve the latest heartbeat for **all** hosts |
| **GET** | `/:hostId/latest` | Retrieve the latest heartbeat for a specific host |
| **GET** | `/:hostId/history` | Retrieve heartbeat history for a host |

### POST `/`
**Request Body (JSON)**
```json
{
  "host": "string",            // Host identifier (required)
  "timestamp": "ISO8601",      // Timestamp of the heartbeat (required)
  "cpu_load": number,          // CPU load percentage (required)
  "mem_used_mb": number,        // Memory used in MB (required)
  "services": ["svc1", ...],  // Optional array of active services
  "ip": "string"               // IP address of the host (required)
}
```
**Behaviour**: Validates required fields, updates host metadata via `update_Host`, then stores the heartbeat using `insertHeartbeat`. Returns the created heartbeat record.
**Success Response** (`201`):
```json
{ "data": { /* heartbeat record */ } }
```
**Error Responses**:
- `400` – Missing required fields.
- `500` – Internal server error.

### GET `/`
**Behaviour**: Calls `getLatestHeartbeatAllHosts` to fetch the most recent heartbeat for each registered host.
**Success Response** (`200`):
```json
{ "data": [ /* array of heartbeat objects */ ] }
```

### GET `/:hostId/latest`
**Path Parameter**:
- `hostId` – Identifier of the host.
**Behaviour**: Returns the most recent heartbeat for the given host or `404` if none exists.
**Success Response** (`200`):
```json
{ "data": { /* heartbeat object */ } }
```
**Error**: `404` – No heartbeat found for the host.

### GET `/:hostId/history`
**Path Parameter**: `hostId`
**Query Parameter**:
- `limit` (optional, integer) – Maximum number of records to return (default 50). Must be a positive integer.
**Behaviour**: Returns an array of heartbeat records ordered by timestamp descending, up to the specified limit.
**Success Response** (`200`):
```json
{ "data": [ /* heartbeat array */ ] }
```
**Error**: `400` – Invalid `limit` value.

#### Controller Functions (`controllers/heartbeat_Controller.js`)
- `handleIngestHeartbeat`
- `handleGetLatestHeartbeatByHost`
- `handleGetLatestHeartbeatAllHosts`
- `handleGetHeartbeatHistory`

---

## Host API (`routes/host_Routes.js`)
| Method | Path | Description |
|--------|------|-------------|
| **POST** | `/` | Create or update a host (upsert) |
| **GET** | `/` | Retrieve a list of all registered hosts |
| **GET** | `/status/:hostId` | Retrieve status information for a specific host |

### POST `/`
**Request Body (JSON)**
```json
{
  "host": "string",   // Host identifier (required)
  "ip": "string",     // IP address (required)
  "metadata": { ... }  // Optional additional metadata
}
```
**Behaviour**: Inserts a new host or updates an existing host via `upsertHost`. Returns the upserted host record.
**Success Response** (`200` or `201`):
```json
{ "data": { /* host record */ } }
```
**Error**: `400` – Validation error; `500` – Internal error.

### GET `/`
**Behaviour**: Returns an array of all host objects.
**Success Response** (`200`):
```json
{ "data": [ /* host array */ ] }
```

### GET `/status/:hostId`
**Path Parameter**: `hostId`
**Behaviour**: Returns status/details for the specified host.
**Success Response** (`200`):
```json
{ "data": { /* host status */ } }
```
**Error**: `404` – Host not found.

#### Controller Functions (`controllers/host_Controller.js`)
- `handleUpsertHost`
- `handleGetAllHosts`
- `handleGetHostById`

---

## Incident API (`routes/incident_Routes.js`)
| Method | Path | Description |
|--------|------|-------------|
| **POST** | `/error` | Ingest a new incident error report |
| **GET** | `/` | Retrieve recent incidents across all hosts |
| **GET** | `/latest` | Retrieve the latest incident for all hosts |

### POST `/error`
**Request Body (JSON)**
```json
{
  "host": "string",          // Host identifier (required)
  "timestamp": "ISO8601",   // When the incident occurred (required)
  "error": "string",         // Error message or code (required)
  "details": { ... }          // Optional additional details
}
```
**Behaviour**: Stores the incident using `insertIncident` (implementation defined). Returns the stored incident record.
**Success Response** (`201`):
```json
{ "data": { /* incident record */ } }
```
**Error**: `400` – Missing fields; `500` – Internal error.

### GET `/`
**Behaviour**: Returns a collection of recent incidents (most recent first).
**Success Response** (`200`):
```json
{ "data": [ /* incident array */ ] }
```

### GET `/latest`
**Behaviour**: Returns the most recent incident for each host.
**Success Response** (`200`):
```json
{ "data": [ /* latest incident per host */ ] }
```

#### Controller Functions (`controllers/incident_Controller.js`)
- `handleIngestIncident`
- `handleGetRecentIncidents`
- `handleGetLatestIncidentAllHosts`

---

## Server / Health API (`routes/server_Routes.js`)
| Method | Path | Description |
|--------|------|-------------|
| **GET** | `/health` | Health check endpoint |

### GET `/health`
**Behaviour**: Executes a simple DB connectivity test (`SELECT 1`). Responds with JSON:
- **When DB reachable**:
```json
{ "status": "ok", "db": "ok", "uptime": <seconds> }
```
- **When DB unreachable**:
```json
{ "status": "degraded", "db": "unreachable", "error": "<error message>" }
```

---

## Notes
- All route files are mounted in **`server.js`** using `app.use`. Example: `app.use('/heartbeat', heartbeatRoutes);`
- Successful responses use a `{ data: … }` envelope; error responses use `{ error: … }`.
- The current codebase does not implement authentication or authorization middleware.

---

*Generated by Antigravity.*
