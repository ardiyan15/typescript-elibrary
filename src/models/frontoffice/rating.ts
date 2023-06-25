import Sequelize from "sequelize";

import sequelize from "../../utils/connection";

const Rating = sequelize.define("rating", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

export default Rating;
