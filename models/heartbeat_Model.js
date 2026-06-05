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
    console.error(JSON.stringify({ level: "error", message: "Error inserting heartbeat", timestamp: new Date().toISOString(), error: error.message }));
    return null;
  }
};

const getLatestHeartbeatByHost = async (hostId) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM heartbeats INNER JOIN hosts ON heartbeats.host_id = hosts.host_id
       WHERE heartbeats.host_id = $1
       ORDER BY heartbeats.host_timestamp DESC
       LIMIT 1`,
      [hostId],
    );
    return rows[0] ?? null;
  } catch (error) {
    console.error(JSON.stringify({ level: "error", message: "Error fetching latest heartbeat for host", timestamp: new Date().toISOString(), error: error.message }));
    return null;
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
    console.error(JSON.stringify({ level: "error", message: "Error fetching latest heartbeats for all hosts", timestamp: new Date().toISOString(), error: error.message }));
    return null;
  }
};

const getHeartbeatHistory = async (hostId, limit = 50) => {
  try {
    // const { rows } = await pool.query(
    //   `SELECT * FROM heartbeats
    //    WHERE host_id = $1
    //    ORDER BY host_timestamp DESC
    //    LIMIT $2`,
    //   [hostId, limit],
    // );
    const { rows } = await pool.query(
      `SELECT * FROM heartbeats
       WHERE host_id = $1
       ORDER BY host_timestamp DESC
       LIMIT $2`,
      [hostId, limit],
    );

    return rows;
  } catch (error) {
    console.error(JSON.stringify({ level: "error", message: "Error fetching heartbeat history", timestamp: new Date().toISOString(), error: error.message }));
    return null;
  }
};

module.exports = {
  insertHeartbeat,
  getLatestHeartbeatByHost,
  getLatestHeartbeatAllHosts,
  getHeartbeatHistory,
};
