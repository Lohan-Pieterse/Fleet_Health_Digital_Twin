const {
  insertIncident,
  getIncidentsByHost,
  getRecentIncidents,
  getLatestIncidentAllHosts,
} = require("../models/incident_Model");
const { update_Host } = require("../models/host_Model");
const handleIngestIncident = async (req, res) => {
  let host;
  try {
    const { timestamp, type, message, ip } = req.body;
    host = req.body.host;
    console.log(
      JSON.stringify({
        level: "info",
        message: "Received incident",
        timestamp: new Date().toISOString(),
        hostId: host,
        type: type,
        ip: ip,
      }),
    );
    if (!host || !timestamp || !type || !message || !ip) {
      return res
        .status(400)
        .json({ error: "host, timestamp, type, message and ip are required" });
    }

    await update_Host(host, ip, "incident", timestamp, message, "unhealthy");
    const incident = await insertIncident(host, timestamp, type, message);

    return res.status(200).json({ data: await getIncidentsByHost(host, 1) });
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Error in handleIngestIncident",
        timestamp: new Date().toISOString(),
        error: error.message,
        event: "handleIngestIncident",
        hostId: host,
      }),
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleGetRecentIncidents = async (req, res) => {
  try {
    let limit = 50;
    if (req.body?.limit) {
      limit = parseInt(req.body.limit, 10);
    }

    if (isNaN(limit) || limit < 1) {
      return res
        .status(400)
        .json({ error: "limit must be a positive integer" });
    }

    const incidents = await getRecentIncidents(limit);
    return res.status(200).json({ data: incidents });
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Error in handleGetRecentIncidents",
        timestamp: new Date().toISOString(),
        error: error.message,
        event: "handleGetRecentIncidents",
      }),
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleGetLatestIncidentAllHosts = async (req, res) => {
  try {
    const incidents = await getLatestIncidentAllHosts();
    return res.status(200).json({ data: incidents });
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Error in handleGetLatestIncidentAllHosts",
        timestamp: new Date().toISOString(),
        error: error.message,
        event: "handleGetLatestIncidentAllHosts",
      }),
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};

// const handleGetIncidentsByHost = async (req, res) => {
//   try {
//     const { hostId } = req.params;
//     const limit = req.body.limit ;

//     if (isNaN(limit) || limit < 1) {
//       return res
//         .status(400)
//         .json({ error: "limit must be a positive integer" });
//     }

//     const incidents = await getIncidentsByHost(hostId, limit);

//     if (!incidents.length) {
//       return res
//         .status(404)
//         .json({ error: `No incidents found for host ${hostId}` });
//     }

//     return res.status(200).json({ data: incidents });
//   } catch (error) {
//     console.error(
//       JSON.stringify({
//         level: "error",
//         message: "Error in handleGetIncidentsByHost",
//         timestamp: new Date().toISOString(),
//         error: error.message,
//         event: "handleGetIncidentsByHost",
//         hostId: hostId,
//       }),
//     );
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

module.exports = {
  handleIngestIncident,
  // handleGetIncidentsByHost,
  handleGetRecentIncidents,
  handleGetLatestIncidentAllHosts,
};
