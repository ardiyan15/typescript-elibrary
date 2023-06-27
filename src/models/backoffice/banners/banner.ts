import Sequelize from "sequelize";

import sequelize from "../../../utils/connection";

const Banner = sequelize.define("banner", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: Sequelize.STRING(60),
  image: Sequelize.STRING(128),
  type: Sequelize.STRING(30),
});

export default Banner;
