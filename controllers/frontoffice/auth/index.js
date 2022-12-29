const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { encrypt, decrypt } = require("../../../util/encrypted");

exports.getLogin = (req, res, next) => {
  res.render("frontoffice/auth/index");
};
