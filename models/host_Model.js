// const pool = require("../config/db");
const { pool } = require("../config/db");

const setupDatabase = async () => {
  try {
    return await pool.query(
      `CREATE TABLE IF NOT EXISTS hosts (
      id SERIAL PRIMARY KEY, 
      hostname VARCHAR(255) UNIQUE NOT NULL, 
      last_heartbeat TIMESTAMP NOT NULL
    )`,
    );
  } catch (error) {
    console.error("Error setting up database:", error);
  }
};

const update_Host = async (hostId, ip) => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO hosts (host_id, ip)
       VALUES ($1, $2)
       ON CONFLICT (host_id)
       DO UPDATE SET ip = EXCLUDED.ip`,
      [hostId, ip],
    );
    return rows[0];
  } catch (error) {
    console.error("Error upserting host:", error);
  }
};

const getAllHosts = async () => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM hosts ORDER BY created_at DESC`,
    );
    return rows;
  } catch (error) {
    console.error("Error fetching all hosts:", error);
  }
};

const getHostById = async (hostId) => {
  try {
    console.log("Fetching host by id:", hostId); // Debug log
    const { rows } = await pool.query(
      `SELECT * FROM hosts h JOIN heartbeats hb ON h.host_id = hb.host_id WHERE h.host_id = $1 ORDER BY hb.host_timestamp DESC LIMIT 1`,
      [hostId],
    );
    return rows[0] ?? null;
  } catch (error) {
    console.error("Error fetching host by id:", error);
  }
};

const updateHeartbeat = async (hostname) => {
  try {
    return await pool.query(
      `INSERT INTO hosts (hostname, last_heartbeat) VALUES ($1, $2)
     ON CONFLICT (hostname) DO UPDATE SET last_heartbeat = EXCLUDED.last_heartbeat`,
      [hostname, new Date()],
    );
  } catch (error) {
    console.error("Error updating heartbeat:", error);
  }
};

module.exports = { update_Host, getAllHosts, getHostById };
