const express = require("express");
const router = express.Router();

const bookController = require("../../../controllers/backoffice/books/index");
const isAuth = require("../../../middleware/is-auth");

router.get("/books", isAuth, bookController.getBooks);

router.get("/books/form", isAuth, bookController.getAddBook);

router.post("/books", bookController.saveBook);

router.get("/books/:id", isAuth, bookController.getBook);

router.post("/updatebook/:id", isAuth, bookController.updateBook);

router.post("/bookdelete/", isAuth, bookController.deleteBook);

module.exports = { router };
