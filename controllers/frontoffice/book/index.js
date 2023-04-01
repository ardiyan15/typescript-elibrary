const { encrypt, decrypt } = require("../../../util/encrypted");
const Book = require("../../../models/backoffice/books/book");
const Rating = require("../../../models/frontoffice/rating");
const User = require("../../../models/backoffice/users/user");
const sequelize = require("../../../util/database");

exports.showBook = async (req, res, next) => {
  const id = decrypt(req.params.id);
  let user = "";
  let isLoggedIn = false;
  let bookIdEncrypted = "";

  if (req.session.user) {
    isLoggedIn = true;
    user = req.session.user;
  }

  let book = await Book.findByPk(id, {
    nest: true,
    include: [
      {
        model: Rating,
        include: [{ model: User }],
      },
    ],
  });

  bookIdEncrypted = encrypt(book.id.toString());

  let result = book.toJSON();

  let temp_rate_value = [];
  let object_rate_value = [
    {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  ];

  let ratings = await Rating.findAll({
    attributes: [
      ["rate", "rate"],
      [sequelize.fn("COUNT", sequelize.col("rate")), "total"],
    ],
    where: { bookId: id },
    raw: true,
    group: "rate",
  });

  let multiplicationRating = 0;
  let sumRating = 0;
  ratings.forEach((item, index) => {
    multiplicationRating += item.rate * item.total;
    sumRating += item.total;
  });

  let finalRating = Math.round(multiplicationRating / sumRating);

  try {
    res.render("frontoffice/home/show", {
      user,
      isLoggedIn,
      result,
      encrypt,
      finalRating,
    });
  } catch (err) {
    console.log(err);
  }
};
