const {
  update_Host,
  getAllHosts,
  getHostById,
} = require("../models/host_Model");

const handleUpsertHost = async (req, res) => {
  try {
    
    const { host, ip, eventType, eventTimestamp, eventDetails } = req.body;

    if (!host || !ip) {
      return res.status(400).json({ error: "host and ip are required" });
    }
    if (!eventType || !eventTimestamp || !eventDetails) {
      console.log("Warning one of the elements in req.body is empty", req.body);
    }
    const result = await update_Host(
      host,
      ip,
      eventType,
      eventTimestamp,
      eventDetails,
    );

    return res
      .status(201)
      .json({ data: await getHostById(host), message: result });
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        event: "handleUpsertHost",
        message: error.message,
      }),
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleGetAllHosts = async (req, res) => {
  try {
    // let { limit } = req.body;

    let limit = null;

    if (req.body.limit) {
      limit = parseInt(req.body.limit);
    } else {
      limit = 50;
    }
    const hosts = await getAllHosts(limit);
    return res.status(200).json({ data: hosts });
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        event: "handleGetAllHosts",
        message: error.message,
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
        event: "handleGetHostById",
        message: error.message,
      }),
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  handleUpsertHost,
  handleGetAllHosts,
  handleGetHostById,
};
