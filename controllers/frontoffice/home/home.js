const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { encrypt, decrypt } = require("../../../util/encrypted");
const Book = require("../../../models/backoffice/books/book");

exports.getHome = (req, res, next) => {
  Book.findAll({
    raw: true,
  })
    .then((books) => {
      let results = [];
      let index = 0;
      let idEncrypted = "";
      books.forEach((book) => {
        idEncrypted = encrypt(book.id.toString());
        if (results.length == 0) {
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
            });
          } else if (!book.category.includes(results[index].category)) {
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
                },
              ],
            });
            index++;
          }
        }
      });
      res.render("frontoffice/home/index", {
        results,
        encrypt,
      });
    })
    .catch((err) => {
      res.render("frontoffice/error", {
        message: err.stack,
      });
    });
};

exports.getBookByCategories = (req, res, next) => {
  const category = decrypt(req.params.category);

  Book.findAll({
    raw: true,
    where: { category },
  })
    .then((results) => {
      res.render("frontoffice/home/categories", {
        results,
      });
    })
    .catch((err) => {
      res.render("frontoffice/error", {
        message: err.stack,
      });
    });
};

exports.searchBook = (req, res, next) => {
  const { search } = req.body;
  console.log(search);

  Book.findAll({
    raw: true,
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          category: {
            [Op.like]: `%${search}%`,
          },
        },
      ],
    },
  })
    .then((results) => {
      res.render("frontoffice/home/search", {
        search,
        results,
      });
    })
    .catch((err) => console.log(err));
};
