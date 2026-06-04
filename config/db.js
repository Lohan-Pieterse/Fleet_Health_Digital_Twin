const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "db",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "P@ssW0rd123",
  database: process.env.DB_NAME || "server_health_db",
});

pool.on("error", (err) => {
  console.error(
    JSON.stringify({
      level: "error",
      event: "db_pool_error",
      message: err.message,
    }),
  );
});

module.exports = { pool };
