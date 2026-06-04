const { Pool } = require("pg");

const pool = new Pool({
  host: "db",
  port: 5432,
  user: "admin",
  password: "P@ssW0rd123",
  database: "server_health_db",
});

module.exports = { pool };
