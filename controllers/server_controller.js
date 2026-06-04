const { setupDatabase, updateHeartbeat } = require("../models/server_models");

const getHello = async (req, res) => {
  res.send({ message: "Hello World! for api Lowhammms" });
};

const setupDb = async (req, res) => {
  try {
    await setupDatabase();
    res.send({ message: "Database setup complete" });
  } catch (error) {
    console.error("Error setting up database:", error);
    res.status(500).send({ message: "Error setting up database" });
  }
};

const receiveHeartbeat = async (req, res) => {
  try {
    const { hostname } = req.body;
    await updateHeartbeat(hostname);
    res.send({ message: "Heartbeat received" });
  } catch (error) {
    console.error("Error processing heartbeat:", error);
    res.status(500).send({ message: "Error processing heartbeat" });
  }
};

const getHost = async (req, res) => {
  try {
    const hostname = req.params.hostname;
    console.log("Received request for host:", hostname);
    res.status(200).send({ host: hostname });
  } catch (error) {
    console.error("Error retrieving host:", error);
    res.status(500).send({ message: "Error retrieving host" });
  }
};

module.exports = {
  getHello,
  setupDb,
  receiveHeartbeat,
  getHost,
};
