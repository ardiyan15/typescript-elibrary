const express = require("express");
const router = express.Router();

const borrowController = require("../../../controllers/frontoffice/borrow/index");

router.get("/borrow", borrowController.index);

module.exports = { router };
