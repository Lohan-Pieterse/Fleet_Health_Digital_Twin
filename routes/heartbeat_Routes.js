const express = require("express");
const router = express.Router();
const {
  handleIngestHeartbeat,
  handleGetLatestHeartbeatByHost,
  handleGetLatestHeartbeatAllHosts,
  handleGetHeartbeatHistory,
} = require("../controllers/heartbeat_Controller");

router.post("/", handleIngestHeartbeat);
router.get("/", handleGetLatestHeartbeatAllHosts);
router.get("/:hostId/latest", handleGetLatestHeartbeatByHost);
router.get("/:hostId/history", handleGetHeartbeatHistory);

module.exports = router;
