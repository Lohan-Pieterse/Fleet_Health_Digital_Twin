const {
  insertHeartbeat,
  getLatestHeartbeatByHost,
  getLatestHeartbeatAllHosts,
  getHeartbeatHistory,
} = require("../models/heartbeat_Model");
const { update_Host } = require("../models/host_Model");

const handleIngestHeartbeat = async (req, res) => {
  try {
    /*
{
"host": "api-01",
"timestamp": "2025-03-10T15:04:05Z",
"cpu_load": 0.42,
"mem_used_mb": 512,
"services": [
{"name": "api", "healthy": true},
{"name": "worker", "healthy": false}
],
"ip": "10.0.0.21"
}
*/
    const { host, timestamp, cpu_load, mem_used_mb, services, ip } = req.body;

    if (!host || !timestamp || cpu_load == null || mem_used_mb == null || !ip) {
      return res
        .status(400)
        .json({
          error: "host, timestamp, cpu_load, mem_used_mb and ip are required",
        });
    }

    await update_Host(host, ip);
    const heartbeat = await insertHeartbeat(
      host,
      timestamp,
      cpu_load,
      mem_used_mb,
      services ?? [],
    );

    return res.status(201).json({ data: heartbeat });
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        event: "ingest_heartbeat",
        message: error.message,
      }),
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleGetLatestHeartbeatByHost = async (req, res) => {
  try {
    const { hostId } = req.params;

    const heartbeat = await getLatestHeartbeatByHost(hostId);

    if (!heartbeat) {
      return res
        .status(404)
        .json({ error: `No heartbeat found for host ${hostId}` });
    }

    return res.status(200).json({ data: heartbeat });
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        event: "get_latest_heartbeat_by_host",
        message: error.message,
      }),
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleGetLatestHeartbeatAllHosts = async (req, res) => {
  try {
    const heartbeats = await getLatestHeartbeatAllHosts();
    return res.status(200).json({ data: heartbeats });
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        event: "get_latest_heartbeat_all_hosts",
        message: error.message,
      }),
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleGetHeartbeatHistory = async (req, res) => {
  try {
    const { hostId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;

    if (isNaN(limit) || limit < 1) {
      return res
        .status(400)
        .json({ error: "limit must be a positive integer" });
    }

    const history = await getHeartbeatHistory(hostId, limit);
    return res.status(200).json({ data: history });
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        event: "get_heartbeat_history",
        message: error.message,
      }),
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  handleIngestHeartbeat,
  handleGetLatestHeartbeatByHost,
  handleGetLatestHeartbeatAllHosts,
  handleGetHeartbeatHistory,
};
