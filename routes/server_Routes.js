const express = require("express");

const { healthHandler } = require("../controllers/server_Controller");

const router = express.Router();

router.get("/health", healthHandler);

module.exports = router;
