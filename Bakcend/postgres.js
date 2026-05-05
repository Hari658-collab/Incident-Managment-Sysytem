const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.POSTGRES_HOST || "postgres",
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
  database: process.env.POSTGRES_DB || "imsdb",
  port: 5432,
});

module.exports = pool;