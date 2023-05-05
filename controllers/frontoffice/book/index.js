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
  let haveRating = false;

  if (req.session.frontOffice) {
    isLoggedIn = true;
    user = req.session.frontOffice.user;
    let userId = decrypt(user.id.toString());
    let rating = Rating.findOne({ where: { id: userId } });

    if (rating != null) {
      haveRating = true;
    }
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
  console.log(haveRating);
  try {
    res.render("frontoffice/home/show", {
      user,
      isLoggedIn,
      result,
      encrypt,
      finalRating,
      haveRating,
    });
  } catch (err) {
    console.log(err);
  }
};
