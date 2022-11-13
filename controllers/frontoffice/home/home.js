const Book = require("../../../models/backoffice/books/book");

exports.getHome = (req, res, next) => {
  Book.findAll()
    .then((books) => {
      res.render("frontoffice/home/index", {
        books,
      });
    })
    .catch((err) => console.log(err));
  //   res.render("frontoffice/home/index");
};
