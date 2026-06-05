const express = require("express");
const router = express.Router();
const {
  handleIngestIncident,
  //   handleGetIncidentsByHost,
  handleGetRecentIncidents,
  handleGetLatestIncidentAllHosts,
} = require("../controllers/incident_Controller");

router.post("/error", handleIngestIncident);
router.get("/", handleGetRecentIncidents);
router.get("/latest", handleGetLatestIncidentAllHosts);

module.exports = router;
