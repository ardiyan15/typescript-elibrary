const express = require("express");
const router = express.Router();

const transactionController = require("../../../controllers/backoffice/transactions/index");
const isAuth = require("../../../middleware/is-auth");

router.get("/transactions", transactionController.getTransactions);

router.post("/transactions/process", transactionController.processTransaction);

router.get(
  "/transactions/:transaction_number",
  transactionController.getTransaction
);

// router.get("/users/form", isAuth, userController.getAddUser);

// router.post("/users", isAuth, userController.saveUser);

// router.post("/updateuser/:id", isAuth, userController.updateUser);

// router.post("/userdelete/", isAuth, userController.deleteUser);

module.exports = { router };
