import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME || "e_library_typescript",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    dialect: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306, 
    logging: false,
    timezone: "+07:00",
  });

export default sequelize;
