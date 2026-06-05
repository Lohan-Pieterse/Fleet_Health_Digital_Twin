const express = require("express");
const router = express.Router();
// const {
//   handleIngestIncident,
//   handleGetIncidentsByHost,
//   handleGetRecentIncidents,
//   handleGetLatestIncidentAllHosts,
// } = require('../controllers/incident_Controller');

// router.post('/', handleIngestIncident);
// router.get('/', handleGetRecentIncidents);
// router.get('/latest', handleGetLatestIncidentAllHosts);
// router.get('/:hostId', handleGetIncidentsByHost);

const { handleIngestIncident } = require("../controllers/incident_Controller");

router.post("/heartbeat/error", handleIngestIncident);

module.exports = router;
