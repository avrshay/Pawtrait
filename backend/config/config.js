require("dotenv").config();

const baseConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: "mysql",
  dialectOptions: process.env.DB_SSL === "true" ? { ssl: { rejectUnauthorized: false } } : {},
};

module.exports = {
  development: baseConfig,
  test: baseConfig,
  production: baseConfig,
};