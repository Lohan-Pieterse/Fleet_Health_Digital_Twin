const {
  insertHeartbeat,
  getLatestHeartbeatByHost,
  getLatestHeartbeatAllHosts,
  getHeartbeatHistory,
} = require("../models/heartbeat_Model");
const { update_Host } = require("../models/host_Model");

/*
   handleIngestHeartbeat,
  handleGetLatestHeartbeatByHost,
  handleGetLatestHeartbeatAllHosts,
*/
const handleIngestHeartbeat = async (req, res) => {
  let host;
  try {
    const { timestamp, cpu_load, mem_used_mb, services, ip } = req.body;
    host = req.body.host;
    console.log(
      JSON.stringify({
        level: "info",
        message: "Received heartbeat",
        timestamp: new Date().toISOString(),
        hostId: host,
        ip: ip,
      }),
    );
    if (!host || !timestamp || cpu_load == null || mem_used_mb == null || !ip) {
      return res.status(400).json({
        error: "host, timestamp, cpu_load, mem_used_mb and ip are required",
      });
    }

    await update_Host(host, ip, "heartbeat", timestamp, services, "healthy");
    const heartbeat = await insertHeartbeat(
      host,
      timestamp,
      cpu_load,
      mem_used_mb,
      services ?? [],
    );

    return res.status(200).json({ data: heartbeat });
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Error in handleIngestHeartbeat",
        timestamp: new Date().toISOString(),
        error: error.message,
        event: "handleIngestHeartbeat",
        hostId: host,
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
        message: "Error in handleGetLatestHeartbeatByHost",
        timestamp: new Date().toISOString(),
        error: error.message,
        event: "handleGetLatestHeartbeatByHost",
        hostId: hostId,
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
        message: "Error in handleGetLatestHeartbeatAllHosts",
        timestamp: new Date().toISOString(),
        error: error.message,
        event: "handleGetLatestHeartbeatAllHosts",
      }),
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleGetHeartbeatHistory = async (req, res) => {
  try {
    const { hostId } = req.params;

    let limit = 50;
    if (req.body?.limit) {
      limit = parseInt(req.body.limit, 10);
    }

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
        message: "Error in handleGetHeartbeatHistory",
        timestamp: new Date().toISOString(),
        error: error.message,
        event: "handleGetHeartbeatHistory",
        hostId: hostId,
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
