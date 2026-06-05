require("dotenv").config();
const { pool } = require("./config/db");
const express = require("express");

// const pool = require("./db");

const port = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/hosts", require("./routes/host_Routes"));

app.use("/api/heartbeat", require("./routes/heartbeat_Routes"));

app.use("/api/server", require("./routes/server_Routes"));

app.use("/api/incidents", require("./routes/incident_Routes"));

const server = app.listen(port, () => {
  console.log(
    JSON.stringify({
      level: "info",
      message: `Server running on port ${port}`,
      timestamp: new Date().toISOString(),
    }),
  );
});

const cleanup = async () => {
  console.log(
    JSON.stringify({
      level: "info",
      message: "Shutdown signal received, closing server...",
      timestamp: new Date().toISOString(),
    }),
  );

  server.close(async () => {
    console.log(
      JSON.stringify({
        level: "info",
        message: "HTTP server closed.",
        timestamp: new Date().toISOString(),
      }),
    );

    try {
      await pool.end();
      console.log(
        JSON.stringify({
          level: "info",
          message: "Database pool closed.",
          timestamp: new Date().toISOString(),
        }),
      );
      process.exit(0);
    } catch (err) {
      console.error(
        JSON.stringify({
          level: "error",
          message: "Error closing database pool",
          timestamp: new Date().toISOString(),
          error: err.message,
        }),
      );
      process.exit(1);
    }
  });
};

process.on("SIGTERM", cleanup);
process.on("SIGINT", cleanup);
