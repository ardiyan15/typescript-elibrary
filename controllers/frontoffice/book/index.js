const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { encrypt, decrypt } = require("../../../util/encrypted");
const Book = require("../../../models/backoffice/books/book");

exports.showBook = (req, res, next) => {
  const id = decrypt(req.params.id);

  Book.findByPk(id, {
    raw: true,
  })
    .then((result) => {
      res.render("frontoffice/home/show", {
        result,
      });
    })
    .catch((err) => {
      res.render("frontoffice/error", {
        message: err.stack,
      });
    });
};
