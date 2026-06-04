const { pool } = require('../config/db');

const insertIncident = async (hostId, hostTs, type, message) => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO incidents (host_id, host_ts, type, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [hostId, hostTs, type, message],
    );
    return rows[0];
  } catch (error) {
    console.error('Error inserting incident:', error);
  }
};

const getIncidentsByHost = async (hostId, limit = 20) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM incidents
       WHERE host_id = $1
       ORDER BY host_ts DESC
       LIMIT $2`,
      [hostId, limit],
    );
    return rows;
  } catch (error) {
    console.error('Error fetching incidents for host:', error);
  }
};

const getRecentIncidents = async (limit = 50) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM incidents
       ORDER BY host_ts DESC
       LIMIT $1`,
      [limit],
    );
    return rows;
  } catch (error) {
    console.error('Error fetching recent incidents:', error);
  }
};

const getLatestIncidentAllHosts = async () => {
  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT ON (host_id)
         host_id, host_ts, type, message, received_at
       FROM incidents
       ORDER BY host_id, host_ts DESC`,
    );
    return rows;
  } catch (error) {
    console.error('Error fetching latest incidents for all hosts:', error);
  }
};

module.exports = {
  insertIncident,
  getIncidentsByHost,
  getRecentIncidents,
  getLatestIncidentAllHosts,
};