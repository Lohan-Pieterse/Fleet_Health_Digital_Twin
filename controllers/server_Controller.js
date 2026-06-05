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
    console.error(
      JSON.stringify({
        level: "error",
        message: "Error in healthHandler",
        timestamp: new Date().toISOString(),
        error: error.message,
        event: "healthHandler",
        hostId: host,
      }),
    );
    res.status(503).json({
      status: "degraded",
      db: "unreachable",
      error: err.message,
    });
  }
}

module.exports = { healthHandler };
