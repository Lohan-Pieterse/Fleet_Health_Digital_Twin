// routes/server.routes.js
const express = require("express");
const router = express.Router();
const {
  getHello,
  handleUpsertHost,
  handleGetAllHosts,
  handleGetHostById,
} = require("../controllers/host_Controller");

router.get("/", getHello);

router.post("/", handleUpsertHost);
router.get("/", handleGetAllHosts);
router.get("/:hostId", handleGetHostById);

module.exports = router;
