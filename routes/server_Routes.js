const express = require("express");
const router = express.Router();
const {
  handleIngestHeartbeat,
} = require("../controllers/heartbeat_Controller");

router.post("/heartbeat", handleIngestHeartbeat);

// routes/health.js
async function healthHandler(req, res) {
  try {
    await db.query("SELECT 1"); // lightweight DB ping

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

router.get("/health", healthHandler);

module.exports = router;
