const { pool } = require("../config/db");

const insertHeartbeat = async (
  hostId,
  hostTimestamp,
  cpuLoad,
  memUsedMb,
  services,
) => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO heartbeats (host_id, host_timestamp, cpu_load, mem_used_mb, services)
       VALUES ($1, $2, $3, $4, $5)`,
      [hostId, hostTimestamp, cpuLoad, memUsedMb, JSON.stringify(services)],
    );
    return await getLatestHeartbeatByHost(hostId);
  } catch (error) {
    console.error("Error inserting heartbeat:", error);
  }
};

const getLatestHeartbeatByHost = async (hostId) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM heartbeats
       WHERE host_id = $1
       ORDER BY host_timestamp DESC
       LIMIT 1`,
      [hostId],
    );
    return rows[0] ?? null;
  } catch (error) {
    console.error("Error fetching latest heartbeat for host:", error);
  }
};

const getLatestHeartbeatAllHosts = async () => {
  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT ON (host_id)
         host_id, host_timestamp, cpu_load, mem_used_mb, services, received_at
       FROM heartbeats
       ORDER BY host_id, host_timestamp DESC`,
    );
    return rows;
  } catch (error) {
    console.error("Error fetching latest heartbeats for all hosts:", error);
  }
};

const getHeartbeatHistory = async (hostId, limit = 50) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM heartbeats
       WHERE host_id = $1
       ORDER BY host_timestamp DESC
       LIMIT $2`,
      [hostId, limit],
    );
    return rows;
  } catch (error) {
    console.error("Error fetching heartbeat history:", error);
  }
};

module.exports = {
  insertHeartbeat,
  getLatestHeartbeatByHost,
  getLatestHeartbeatAllHosts,
  getHeartbeatHistory,
};
