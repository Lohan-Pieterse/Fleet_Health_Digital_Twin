-- init.sql
CREATE TABLE IF NOT EXISTS hosts (
    host_id VARCHAR(100) PRIMARY KEY,
    ip INET NOT NULL,
    last_event_type VARCHAR(50),
    last_event_timestamp TIMESTAMPTZ,
    last_event_details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS heartbeats (
    id SERIAL PRIMARY KEY,
    host_id VARCHAR(100) NOT NULL REFERENCES hosts(host_id) ON DELETE CASCADE,
    host_timestamp TIMESTAMPTZ NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cpu_load NUMERIC(4, 2) NOT NULL,
    mem_used_mb INTEGER NOT NULL,
    services JSONB NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS incidents (
    id SERIAL PRIMARY KEY,
    host_id VARCHAR(100) NOT NULL REFERENCES hosts(host_id),
    host_timestamp TIMESTAMPTZ NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    type VARCHAR(100) NOT NULL,
    message TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_hosts_created_at ON hosts (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_heartbeats_host_timestamp ON heartbeats (host_id, host_timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_incidents_host_ts ON incidents (host_id, host_timestamp DESC);