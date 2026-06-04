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

module.exports = {
  setupDatabase,
  updateHeartbeat,
};
