const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const encrypted = require("../../../util/encrypted");
const Book = require("../../../models/backoffice/books/book");

exports.getHome = (req, res, next) => {
  Book.findAll({
    raw: true,
  })
    .then((books) => {
      let results = [];
      let index = 0;
      books.forEach((book) => {
        if (results.length == 0) {
          results.push({
            category: book.category,
            book: [
              {
                id: book.id,
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
              id: book.id,
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
                  id: book.id,
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
        encrypt: encrypted.encrypt,
      });
    })
    .catch((err) => console.log(err));
};

exports.getBookByCategories = (req, res, next) => {
  const category = encrypted.decrypt(req.params.category);

  Book.findAll({
    raw: true,
    where: { category },
  })
    .then((results) => {
      console.log(results);
      res.render("frontoffice/home/categories", {
        results,
      });
    })
    .catch((err) => console.log(err));
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
      console.log(results);
      res.render("frontoffice/home/search", {
        search,
        results,
      });
    })
    .catch((err) => console.log(err));
};
