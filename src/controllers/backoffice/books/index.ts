import { RequestHandler } from "express";
import Book from "@models/backoffice/books/book";

import { encrypt } from "@utils/secure";
import sequelize from "@utils/connection";

export const getBook: RequestHandler = async (req, res) => {
  const flashMessage = req.flash();

  const books = await Book.findAll({
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
          "createdAt",
        ],
      ],
    },
    order: [["id", "DESC"]],
  });

  res.render("backoffice/books/index", {
    books,
    flashMessage,
    encrypt,
  });
};

export const getAddBook: RequestHandler = (_, res) => {
  res.render("backoffice/books/form", {
    formTitle: "Add Book",
    buttonText: "Submit",
    book: [],
  });
};

export const saveBook: RequestHandler = async (
  req,
  res,
): Promise<any> => {
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

  const book = await Book.create({
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
  });

  if (book) {
    req.flash("success", "Successfully add Book");
    res.redirect("/backoffice/books");
  } else {
    res.render("/backoffice/404/error");
  }
};
