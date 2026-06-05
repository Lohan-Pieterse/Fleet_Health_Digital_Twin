const { pool } = require("../config/db");

const HEALTH_THRESHOLD_SECONDS = 60;

/*
 update_Host,
  getAllHosts,
  getHostById,
  getHostsSummary,
*/

const update_Host = async (
  hostId,
  ip,
  eventType = null,
  timestamp = null,
  details = null,
  status = null,
) => {
  /*
   host_id VARCHAR(100) PRIMARY KEY,
    ip INET NOT NULL,
    last_event_type VARCHAR(50),
    last_event_timestamp TIMESTAMPTZ,
    last_event_details JSONB,
  */
  try {
    if (details !== null) {
      try {
        details = JSON.stringify(details);
      } catch (error) {
        console.error(JSON.stringify({ level: "error", message: "Error processing host details", timestamp: new Date().toISOString(), error: error.message }));
      }
    }

    console.log(JSON.stringify({ level: "info", message: `Upserting host: ${hostId}`, timestamp: new Date().toISOString() }));

    const { rows } = await pool.query(
      `INSERT INTO hosts (host_id, ip, last_event_type, last_event_timestamp, last_event_details, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (host_id)
       DO UPDATE SET ip = EXCLUDED.ip, last_event_type = EXCLUDED.last_event_type,
       last_event_timestamp = EXCLUDED.last_event_timestamp, 
       last_event_details = EXCLUDED.last_event_details,
       status = EXCLUDED.status
       RETURNING *;
       `,
      [hostId, ip, eventType, timestamp, details, status],
    );
    return rows[0];
  } catch (error) {
    console.error(JSON.stringify({ level: "error", message: "Error upserting host", timestamp: new Date().toISOString(), error: error.message }));
    return null;
  }
};

const getAllHosts = async (limit) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM hosts ORDER BY created_at DESC LIMIT $1`,
      [limit],
    );
    return rows;
  } catch (error) {
    console.error(JSON.stringify({ level: "error", message: "Error fetching all hosts", timestamp: new Date().toISOString(), error: error.message }));
    return null;
  }
};

const getHostById = async (hostId) => {
  try {
    console.log(JSON.stringify({ level: "info", message: `Fetching host by id: ${hostId}`, timestamp: new Date().toISOString() }));
    const { rows } = await pool.query(
      `SELECT * FROM hosts h WHERE h.host_id = $1 LIMIT 1`,
      [hostId],
    );
    return rows[0];
  } catch (error) {
    console.error(JSON.stringify({ level: "error", message: "Error fetching host by id", timestamp: new Date().toISOString(), error: error.message }));
    return null;
  }
};

const getHostsSummary = async () => {
  try {
    const { rows } = await pool.query(`SELECT * from hosts`, []);
    return rows;
  } catch (error) {
    console.error(JSON.stringify({ level: "error", message: "Error fetching hosts summary", timestamp: new Date().toISOString(), error: error.message }));
    return null;
  }
};

module.exports = {
  update_Host,
  getAllHosts,
  getHostById,
  getHostsSummary,

  // GetLatestDataByHostId,
};
