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
router.get("/latest/:hostId", handleGetLatestHeartbeatByHost);
router.get("/history/:hostId", handleGetHeartbeatHistory);

module.exports = router;
