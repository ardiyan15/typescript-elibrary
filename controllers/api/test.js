const Book = require("../../models/backoffice/books/book");
const Rating = require("../../models/frontoffice/rating");
const sequelize = require("../../util/database");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { encrypt, decrypt } = require("../../util/encrypted");
const encrypted = require("../../util/encrypted");

exports.getTest = async (req, res, next) => {
  let books = await Book.findAll({
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

  let results = [];
  let index = 0;
  let idEncrypted = "";
  let categories = [];

  books.forEach((book) => {
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

  return res.json({
    test: results,
  });
};
