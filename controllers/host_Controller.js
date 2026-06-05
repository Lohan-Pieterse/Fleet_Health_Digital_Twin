const {
  update_Host,
  getAllHosts,
  getHostById,
  getHostsSummary,
} = require("../models/host_Model");
const handleUpsertHost = async (req, res) => {
  let host;
  try {
    const { ip, eventType, eventTimestamp, eventDetails, status } =
      req.body;
    host = req.body.host;

    if (!host || !ip) {
      return res.status(400).json({ error: "host and ip are required" });
    }
    if (!eventType || !eventTimestamp || !eventDetails) {
      console.log(
        JSON.stringify({
          level: "info",
          message: "Warning: one of the elements in req.body is empty",
          timestamp: new Date().toISOString(),
          hostId: host,
        }),
      );
    }
    const result = await update_Host(
      host,
      ip,
      eventType,
      eventTimestamp,
      eventDetails,
      status,
    );

    return res
      .status(201)
      .json({ data: await getHostById(host), message: result });
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Error in handleUpsertHost",
        timestamp: new Date().toISOString(),
        error: error.message,
        event: "handleUpsertHost",
        hostId: host,
      }),
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleGetAllHosts = async (req, res) => {
  try {
    // let { limit } = req.body;

    let limit = 50;

    if (req.body?.limit) {
      limit = parseInt(req.body.limit, 10);
    }
    const hosts = await getAllHosts(limit);
    return res.status(200).json({ data: hosts });
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Error in handleGetAllHosts",
        timestamp: new Date().toISOString(),
        error: error.message,
        event: "handleGetAllHosts",
      }),
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleGetHostById = async (req, res) => {
  try {
    const { hostId } = req.params;

    const host = await getHostById(hostId);

    if (!host) {
      return res.status(404).json({ error: `Host ${hostId} not found` });
    }

    return res.status(200).json({ data: host });
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Error in handleGetHostById",
        timestamp: new Date().toISOString(),
        error: error.message,
        event: "handleGetHostById",
        hostId: hostId,
      }),
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleGetHostsSummary = async (req, res) => {
  try {
    const summary = await getHostsSummary();
    return res.status(200).json({ data: summary });
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Error in handleGetHostsSummary",
        timestamp: new Date().toISOString(),
        error: error.message,
        event: "handleGetHostsSummary",
      }),
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  handleUpsertHost,
  handleGetAllHosts,
  handleGetHostById,
  handleGetHostsSummary,
};
