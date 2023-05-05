'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_collection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_collection.init({
    bookId: DataTypes.NUMBER,
    userId: DataTypes.NUMBER,
    borrowDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'user_collection',
  });
  return user_collection;
};