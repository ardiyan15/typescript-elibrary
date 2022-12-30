const { decrypt } = require("../../../util/encrypted");
const Book = require("../../../models/backoffice/books/book");

exports.showBook = (req, res, next) => {
  const id = decrypt(req.params.id);
  let isLoggedIn = false;

  Book.findByPk(id, {
    raw: true,
  })
    .then((result) => {
      if (req.session.user && req.session.user.roles == "user") {
        isLoggedIn = true;
      }
      res.render("frontoffice/home/show", {
        isLoggedIn,
        result,
      });
    })
    .catch((err) => {
      res.render("frontoffice/error", {
        message: err.stack,
      });
    });
};
