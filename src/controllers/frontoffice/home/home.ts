import { RequestHandler } from "express";

import Book from "../../../models/backoffice/books/book";
import Rating from "../../../models/frontoffice/rating";
import Banner from "../../../models/backoffice/banners/banner";

import { encrypt } from "../../../utils/secure";
import sequelize from "../../../utils/connection";

interface BookL {
  id: string;
  category: string;
  title: string;
  author: string;
  image: string;
  description: string;
  createdAt: string;
  publication_date: string;
  publisher: string;
  language: string;
  number_of_page: string;
  heavy: string;
  width: string;
  length: string;
  isBorrow: string;
  ratings: {
    total_review: string;
  };
}

interface ResultL {
  category: string;
  book: any;
}

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

    const results: ResultL[] = [];
    let index = 0;
    let idEncrypted = "";
    const categories: string[] = [];

    Books.forEach((book: any) => {
      idEncrypted = encrypt(book.id.toString());

      if (results.length === 0) {
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
        if (book.category === results[index].category) {
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
              if (result.category === category && result.book.length === 4) {
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
      return results;
    });
    res.render("frontoffice/home/index", {
      isLoggedIn,
      results,
      Banners,
      encrypt,
    });
  } catch (err) {
    console.log(err);
    res.render("frontoffice/error", {
      message: err.stack,
    });
  }
};
