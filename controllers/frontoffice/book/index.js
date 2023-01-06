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
        include: [{model: User}]
      }
    ],
  })
  
  bookIdEncrypted = encrypt(book.id.toString())

  let result = book.toJSON()
  
  try {
    res.render("frontoffice/home/show", {
      bookIdEncrypted,
      user,
      isLoggedIn,
      result,
    });
  } catch(err) {
    console.log(err)
  }
};
