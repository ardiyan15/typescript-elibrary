const encrypted = require("../../../util/encrypted");
const Book = require("../../../models/backoffice/books/book");
const sequelize = require("../../../util/database");

exports.getBooks = (req, res, next) => {
  const flashMessage = req.flash("success");
  Book.findAll({
    attributes: {
      include: [
        [
          sequelize.fn(
            "date_format",
            sequelize.col("createdAt"),
            "%d %M %Y %H:%i"
          ),
          "createdAt",
        ],
        [
          sequelize.fn(
            "date_format",
            sequelize.col("updatedAt"),
            "%d %M %Y %H:%i"
          ),
          "updatedAt",
        ],
      ],
    },
    order: [["id", "DESC"]],
  })
    .then((books) => {
      res.render("backoffice/books/index", {
        books,
        flashMessage,
        encrypt: encrypted.encrypt,
      });
    })
    .catch((err) => console.log(err));
};

exports.getAddBook = (req, res, next) => {
  res.render("backoffice/books/form", {
    formTitle: "Add Book",
    buttonText: "Submit",
    book: [],
  });
};

exports.saveBook = (req, res, next) => {
  const {
    title,
    category,
    author,
    description,
    publication_date,
    isbn,
    language,
    publisher,
    number_of_pages,
    heavy,
    width,
    length,
  } = req.body;
  const image = req.file;

  const imageUrl = image.path;

  Book.create({
    title,
    author,
    category,
    description,
    publication_date,
    isbn,
    language,
    publisher,
    number_of_pages,
    heavy,
    width,
    length,
    image: imageUrl,
  })
    .then((result) => {
      req.flash("success", "Successfully add Book");
      res.redirect("/backoffice/books");
    })
    .catch((err) => {
      res.render("/backoffice/404/error");
    });
};

exports.getBook = (req, res, next) => {
  const bookId = encrypted.decrypt(req.params.id, req.params.id);

  Book.findByPk(bookId)
    .then((book) => {
      let bookIdEncrypted = encrypted.encrypt(bookId);
      res.render("backoffice/books/form", {
        formTitle: "Edit Book",
        buttonText: "Update",
        book,
        bookIdEncrypted,
      });
    })
    .catch((err) => console.log(err));
};

exports.updateBook = (req, res, next) => {
  const { id, title, author, description } = req.body;
  const image = req.file;

  const bookIdDecrypted = encrypted.decrypt(id);

  Book.findByPk(bookIdDecrypted)
    .then((book) => {
      book.title = title;
      book.author = author;
      book.description = description;
      if (image) {
        book.image = image.path;
      }
      book.save();
      req.flash("success", "Successfully update book");
      res.redirect("/backoffice/books");
    })
    .catch((err) => console.log(err));
};

exports.deleteBook = (req, res, next) => {
  const { bookId } = req.body;

  let bookIdDecrypted = encrypted.decrypt(bookId);

  Book.findByPk(bookIdDecrypted)
    .then((book) => {
      return book.destroy();
    })
    .then((result) => {
      req.flash("success", "Successfully delete book");
      res.redirect("/backoffice/books");
    })
    .catch((err) => console.log(err));
};
