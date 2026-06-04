const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World! for api");
});

router.post("/heartbeat", (req, res) => {
  console.log("Received heartbeat:", req.body);
  res.status(200).send("Heartbeat received");
});

router.get("/host/:hostname", (req, res) => {
  const hostname = req.params.hostname;
  console.log("Received request for host:", hostname);
  res.status(200).send(`Host: ${hostname}`);
});



module.exports = router;
