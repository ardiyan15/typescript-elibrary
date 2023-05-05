const { encrypt } = require("../../../util/encrypted");
const sequelize = require("../../../util/database");
const Book = require("../../../models/backoffice/books/book");
const Rating = require("../../../models/frontoffice/rating");

exports.index = async (req, res, next) => {
  let isLoggedIn = false;
  if (req.session.frontOffice) {
    if (req.session.frontOffice.user) {
      isLoggedIn = true;
      user = req.session.frontOffice.user;
      user.id = encrypt(user.id.toString());
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

    let results = [];
    let index = 0;
    let idEncrypted = "";
    let categories = [];
    let stock = 0;

    Books.forEach((book) => {
      stock++;
      idEncrypted = encrypt(book.id.toString());
      if (results.length == 0) {
        stock++;
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
              stock,
            },
          ],
        });
      } else {
        stock = 0;
        if (book.category == results[index].category) {
          stock++;
          results[index].book.push({
            id: idEncrypted,
            title: book.title,
            author: book.author,
            description: book.description,
            image: book.image,
            createdAt: book.createdAt,
            totalReview: book.ratings.total_review,
            stock,
          });
        } else if (!categories.includes(book.category)) {
          stock++;
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
                stock,
              },
            ],
          });
          index++;
        } else if (categories.includes(book.category)) {
          stock++;
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
                  stock,
                });
              }
            });
          });
        }
      }
    });

    console.log(results[0].book);

    res.render("frontoffice/borrow/index", {
      isLoggedIn,
      results,
      encrypt,
    });
  } catch (err) {
    res.render("frontoffice/error", {
      message: err.stack,
    });
  }
};
