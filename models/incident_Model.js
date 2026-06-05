const { pool } = require("../config/db");

const insertIncident = async (hostId, hostTs, type, message) => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO incidents (host_id, host_timestamp, type, message)
       VALUES ($1, $2, $3, $4)`,
      [hostId, hostTs, type, message],
    );
    return rows[0];
  } catch (error) {
    console.error("Error inserting incident:", error);
    return null;
  }
};

const getIncidentsByHost = async (hostId, limit = 20) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM incidents
       WHERE host_id = $1
       ORDER BY host_timestamp DESC
       LIMIT $2`,
      [hostId, limit],
    );
    return rows;
  } catch (error) {
    console.error("Error fetching incidents for host:", error);
    return null;
  }
};

const getRecentIncidents = async (limit = 50) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM incidents
       ORDER BY host_timestamp DESC
       LIMIT $1`,
      [limit],
    );
    return rows;
  } catch (error) {
    console.error("Error fetching recent incidents:", error);
    return null;
  }
};

const getLatestIncidentAllHosts = async () => {
  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT ON (host_id)
       host_id, 
       host_timestamp, 
       type, 
       message, 
       received_at
FROM incidents
ORDER BY host_id, host_timestamp DESC;`,
    );
    return rows;
  } catch (error) {
    console.error("Error fetching latest incidents for all hosts:", error);
    return null;
  }
};

module.exports = {
  insertIncident,
  getIncidentsByHost,
  getRecentIncidents,
  getLatestIncidentAllHosts,
};
