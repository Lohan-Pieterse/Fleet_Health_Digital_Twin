const { insertIncident, getIncidentsByHost, getRecentIncidents, getLatestIncidentAllHosts } = require('../models/incident_Model');
const { upsertHost } = require('../models/host_Model');

const handleIngestIncident = async (req, res) => {
  try {
    const { host, timestamp, type, message, ip } = req.body;

    if (!host || !timestamp || !type || !message || !ip) {
      return res.status(400).json({ error: 'host, timestamp, type, message and ip are required' });
    }

    await upsertHost(host, ip);
    const incident = await insertIncident(host, timestamp, type, message);

    return res.status(201).json({ data: incident });
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', event: 'ingest_incident', message: error.message }));
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const handleGetIncidentsByHost = async (req, res) => {
  try {
    const { hostId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;

    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({ error: 'limit must be a positive integer' });
    }

    const incidents = await getIncidentsByHost(hostId, limit);

    if (!incidents.length) {
      return res.status(404).json({ error: `No incidents found for host ${hostId}` });
    }

    return res.status(200).json({ data: incidents });
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', event: 'get_incidents_by_host', message: error.message }));
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const handleGetRecentIncidents = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;

    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({ error: 'limit must be a positive integer' });
    }

    const incidents = await getRecentIncidents(limit);
    return res.status(200).json({ data: incidents });
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', event: 'get_recent_incidents', message: error.message }));
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const handleGetLatestIncidentAllHosts = async (req, res) => {
  try {
    const incidents = await getLatestIncidentAllHosts();
    return res.status(200).json({ data: incidents });
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', event: 'get_latest_incident_all_hosts', message: error.message }));
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  handleIngestIncident,
  handleGetIncidentsByHost,
  handleGetRecentIncidents,
  handleGetLatestIncidentAllHosts,
};