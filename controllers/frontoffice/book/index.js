const { encrypt, decrypt } = require("../../../util/encrypted");
const Book = require("../../../models/backoffice/books/book");

exports.showBook = (req, res, next) => {
  const id = decrypt(req.params.id);
  let user = "";
  let isLoggedIn = false;
  let bookIdEncrypted = "";

  if (req.session.user) {
    isLoggedIn = true;
    user = req.session.user;
    user.id = encrypt(user.id.toString());
  }

  Book.findByPk(id, {
    raw: true,
  })
    .then((result) => {
      bookIdEncrypted = encrypt(result.id.toString());
      res.render("frontoffice/home/show", {
        bookIdEncrypted,
        user,
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
