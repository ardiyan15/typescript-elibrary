const Transactions = require("../../../models/backoffice/transactions/transaction");
const Transaction_detail = require("../../../models/backoffice/transaction_details/transaction_details");
const { decrypt } = require("../../../util/encrypted");
const User = require("../../../models/backoffice/users/user");
const Book = require("../../../models/backoffice/books/book");

exports.index = async (req, res, next) => {
  let isLoggedIn = false;
  let userId = "";
  let id = "";

  //   if (req.session.frontOffice) {
  //     isLoggedIn = true;
  //     user = req.session.frontOffice.user;
  //     userId = decrypt(user.id);
  //   } else {
  //     return res.redirect("/");
  //   }

  let transaction = await Transactions.findOne({
    raw: true,
    nest: true,
    where: {
      created_by: 2,
    },
    include: [
      {
        model: Transaction_detail,
        raw: true,
        nest: true,
        include: [
          {
            model: Book,
            attributes: ["title", "image"],
            raw: true,
          },
        ],
      },
    ],
  });

  console.log(transaction.transaction_details.book);

  res.render("frontoffice/transaction/index", {
    isLoggedIn,
    id,
    transaction,
  });
};
