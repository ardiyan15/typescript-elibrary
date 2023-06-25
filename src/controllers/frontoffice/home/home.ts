import { RequestHandler } from "express";

import Book from "../../../models/backoffice/books/book";

import { encrypt } from "../../../utils/secure";
import sequelize from "../../../utils/connection";

export const getHome: RequestHandler = async (req, res, next) => {
  let isLoggedIn = false;
  let user;
  if (req.session?.frontOffice) {
    if (req.session.frontOffice.user) {
      isLoggedIn = true;
      user = req.session.frontOffice.user;
      if (user) {
        user.id = encrypt(user.id.toString());
      }
    }
  }

  try {
    const Books = await Book.findAll({
      attributes: ["*"],
      raw: true,
      nest: true,
      include: [
        {
          model: Rating,
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("rate")), "total_review"],
          ],
          required: true, // true to force to using inner join
        },
      ],
      group: "bookId",
    });

    const Banners = await Banner.findAll({
      raw: true,
      where: {
        type: "Website",
      },
    });

    const results: any[] = [];
    let index = 0;
    let idEncrypted = "";
    const categories = [];

    Books.forEach((book) => {
      idEncrypted = encrypt(book.id.toString());
      if (results.length == 0) {
        categories.push(book.category);
        results.push({
          category: book.category,
          book: [
            {
              id: idEncrypted,
              title: book.title,
              author: book.author,
              description: book.description,
              image: book.image,
              createdAt: book.createdAt,
              totalReview: book.ratings.total_review,
            },
          ],
        });
      } else {
        if (book.category == results[index].category) {
          results[index].book.push({
            id: idEncrypted,
            title: book.title,
            author: book.author,
            description: book.description,
            image: book.image,
            createdAt: book.createdAt,
            totalReview: book.ratings.total_review,
          });
        } else if (!categories.includes(book.category)) {
          categories.push(book.category);
          results.push({
            category: book.category,
            book: [
              {
                id: idEncrypted,
                title: book.title,
                author: book.author,
                description: book.description,
                image: book.image,
                createdAt: book.createdAt,
                totalReview: book.ratings.total_review,
              },
            ],
          });
          index++;
        } else if (categories.includes(book.category)) {
          categories.forEach((category) => {
            results.find((result) => {
              if (result.category === category && result.book.length == 4) {
                result.book.pop();
                result.book.unshift({
                  id: idEncrypted,
                  title: book.title,
                  author: book.author,
                  description: book.description,
                  image: book.image,
                  createdAt: book.createdAt,
                  totalReview: book.ratings.total_review,
                });
              }
            });
          });
        }
      }
    });
    res.render("frontoffice/home/index", {
      isLoggedIn,
      results,
      Banners,
      encrypt,
    });
  } catch (err) {
    res.render("frontoffice/error", {
      message: err.stack,
    });
  }

  res.render("frontoffice/home/index", {
    test: "test",
    isLoggedIn: false,
  });
};
