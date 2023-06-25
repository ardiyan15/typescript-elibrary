import { Sequelize } from "sequelize";

const sequelize = new Sequelize("e_library_typescript", "root", "", {
  dialect: "mysql",
  host: "localhost",
  logging: false,
  timezone: "+07:00",
});

export default sequelize;
