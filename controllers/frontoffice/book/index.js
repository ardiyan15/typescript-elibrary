const { encrypt, decrypt } = require("../../../util/encrypted");
const Book = require("../../../models/backoffice/books/book");
const Rating = require("../../../models/frontoffice/rating");
const User = require("../../../models/backoffice/users/user");

exports.showBook = async (req, res, next) => {
  const id = decrypt(req.params.id);
  let user = "";
  let isLoggedIn = false;
  let bookIdEncrypted = "";

  if (req.session.user) {
    isLoggedIn = true;
    user = req.session.user;
    user.id = encrypt(user.id.toString());
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
  let sum_current_value = 0;

  for (let i = 0; i < result.ratings.length; i++) {
    temp_rate_value.push(result.ratings[i].rate);

    // temp_rate_value.reduce((accumulator, currentValue) => {
    // console.log(accumulator, currentValue);
    //   if (accumulator == currentValue) {
    //     sum_current_value++;
    //     object_rate_value.push({
    //       5: sum_current_value,
    //     });
    //   }
    // });
  }

  for (let k = 0; k < object_rate_value.length; k++) {
    console.log(object_rate_value[k]);
  }

  // console.log(object_rate_value);

  // result.forEach((item, index) => {
  //   console.log(item);
  // });

  try {
    res.render("frontoffice/home/show", {
      bookIdEncrypted,
      user,
      isLoggedIn,
      result,
    });
  } catch (err) {
    console.log(err);
  }
};
