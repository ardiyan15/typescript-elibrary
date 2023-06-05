const Transactions = require("../../../models/backoffice/transactions/transaction");

exports.getTransactions = async (req, res, next) => {
  //   if (!req.session.backOffice) {
  //     if (!req.session.backOffice || req.session.backOffice.roles != "admin") {
  //       return res.redirect("/backoffice");
  //     }
  //   }

  const flashMessage = req.flash("success");

  const results = await Transactions.findAll({
    raw: true,
  });

  res.render("backoffice/transactions/index", {
    flashMessage,
    results,
  });
};

exports.processTransaction = async (req, res, next) => {
  const { transaction_number, status } = req.body;

  let updateStatus = 1;
  if (status == 1) {
    updateStatus = 2;
  }

  Transactions.update(
    { status: updateStatus },
    {
      where: {
        transaction_number,
      },
    }
  );

  req.flash("success", "Successfully Process Transaction");
  res.redirect("/backoffice/transactions");
};

exports.getTransaction = async (req, res, next) => {
  const { transaction_number } = req.params;

  console.log(transaction_number);

  const transaction = await Transactions.findAll({
    where: {
      transaction_number,
    },
    raw: true,
  });

  res.render("backoffice/transactions/detail", {
    transaction,
  });
};
