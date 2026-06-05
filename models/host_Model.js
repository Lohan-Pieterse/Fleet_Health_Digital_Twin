const { pool } = require("../config/db");

/*
 update_Host,
  getAllHosts,
  getHostById,
*/

const update_Host = async (
  hostId,
  ip,
  eventType = null,
  timestamp = null,
  details = null,
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
        console.error("Error processing host details:", error);
      }
    }

    console.log("Upserting host:", {
      hostId,
      ip,
      eventType,
      timestamp,
      details,
    }); // Debug log

    const { rows } = await pool.query(
      `INSERT INTO hosts (host_id, ip, last_event_type, last_event_timestamp, last_event_details)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (host_id)
       DO UPDATE SET ip = EXCLUDED.ip, last_event_type = EXCLUDED.last_event_type,
       last_event_timestamp = EXCLUDED.last_event_timestamp, 
       last_event_details = EXCLUDED.last_event_details`,
      [hostId, ip, eventType, timestamp, details],
    );
    return rows[0];
  } catch (error) {
    console.error("Error upserting host:", error);
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
    console.error("Error fetching all hosts:", error);
    return null;
  }
};

const getHostById = async (hostId) => {
  try {
    console.log("Fetching host by id:", hostId); // Debug log
    const { rows } = await pool.query(
      `SELECT * FROM hosts h WHERE h.host_id = $1 LIMIT 1`,
      [hostId],
    );
    return rows[0];
  } catch (error) {
    console.error("Error fetching host by id:", error);
    return null;
  }
};

module.exports = {
  update_Host,
  getAllHosts,
  getHostById,
  // GetLatestDataByHostId,
};
