const { encrypt } = require("../../../util/encrypted");
const sequelize = require("../../../util/database");
const Book = require("../../../models/backoffice/books/book");
const Rating = require("../../../models/frontoffice/rating");
const Transaction = require("../../../models/backoffice/transactions/transaction");
const Transaction_detail = require("../../../models/backoffice/transaction_details/transaction_details");
const moment = require("moment");

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
        if (book.isBorrow == 0) {
          stock++;
        }
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
          if (book.category == results[index].category && book.isBorrow == 0) {
            stock++;
          }
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
          if (book.isBorrow == 0) {
            stock++;
          }
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
          if (book.isBorrow == 0) {
            stock++;
          }
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

exports.save = async (req, res, next) => {
  const { title, qty, address } = req.body;
  let transactionNumber = "";
  let date = moment().format("D");
  let month = moment().format("MM");
  let year = moment().format("YY");

  const db_transaction = await sequelize.transaction();

  try {
    const transaction = await Transaction.findAll({
      limit: 1,
      order: [["createdAt", "DESC"]],
    });

    if (transaction.length == 0) {
      transactionNumber += `TRX${date}${month}${year}00001`;
    } else {
      transactionNumber = transaction[0].transaction_number;
      let lastNumber = transactionNumber.substr(9, 5);
      transactionNumber = +lastNumber + 1;
      transactionNumber = ("0000" + transactionNumber).slice(-5);
    }

    let transaction_inserted = await Transaction.create(
      {
        transaction_number: transactionNumber,
        address_delivery: address,
        status: 0,
      },
      { transaction: db_transaction }
    );

    for (let i = 0; i < qty; i++) {
      const book = await Book.findAll({
        limit: 1,
        where: {
          title,
          isBorrow: 0,
        },
        raw: true,
        order: [["createdAt", "DESC"]],
      });

      let getBook = await Book.findByPk(book[0].id);

      getBook.isBorrow = 1;
      getBook.save();

      // if (book.length != 0) {
      await Transaction_detail.create(
        {
          transaction_id: transaction_inserted.id,
          book_id: book[0].id,
        },
        {
          transaction: db_transaction,
        }
      );
      // }
    }

    await db_transaction.commit();
    res.send("here");
  } catch (err) {
    console.log(err);
    await db_transaction.rollback();
  }

  // let books = await Book.findAll({
  //   where: {
  //     title,
  //   },
  //   raw: true,
  // });

  // let transactions = await Transaction.findAll();
  // console.log(transactions);

  // console.log(req.body);
  // res.send("here");
};
