const {
  update_Host,
  getAllHosts,
  getHostById,
} = require("../models/host_Model");

const getHello = async (req, res) => {
  res.send({ message: "Hello World! for api Lowhammms" });
};
const handleUpsertHost = async (req, res) => {
  try {
    const { host, ip } = req.body;

    if (!host || !ip) {
      return res.status(400).json({ error: "host and ip are required" });
    }

    const result = await update_Host(host, ip);
    return res.status(201).json({ data: result });
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        event: "upsert_host",
        message: error.message,
      }),
    );
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleGetAllHosts = async (req, res) => {
  try {
    const hosts = await getAllHosts();
    return res.status(200).json({ data: hosts });
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        event: "get_all_hosts",
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
        event: "get_host_by_id",
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
  getHello,
};
