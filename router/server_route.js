// routes/server.routes.js
const express = require("express");
const router = express.Router();
const {
  getHello,
  setupDb,
  receiveHeartbeat,
  getHost,
} = require("../controllers/server_controller");

router.get("/", getHello);

router.get("/setup", setupDb);

router.post("/heartbeat", receiveHeartbeat);

router.get("/host/:hostname", getHost);

module.exports = router;
