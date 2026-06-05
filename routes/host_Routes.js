// routes/server.routes.js
const express = require("express");
const router = express.Router();

const {
  handleGetAllHosts,
  handleGetHostById,
  handleUpsertHost,

  // getLatestData,
} = require("../controllers/host_Controller");

router.post("/", handleUpsertHost);
router.get("/", handleGetAllHosts);
router.get("/status/:hostId", handleGetHostById);

module.exports = router;
