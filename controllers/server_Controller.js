const { pool } = require("../config/db");
async function healthHandler(req, res) {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      status: "ok",
      db: "ok",
      uptime: Math.floor(process.uptime()),
    });
  } catch (err) {
    res.status(503).json({
      status: "degraded",
      db: "unreachable",
      error: err.message,
    });
  }
}

module.exports = { healthHandler };
