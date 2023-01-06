const express = require("express");
const router = express.Router();

const userController = require("../../../controllers/frontoffice/user/index");

router.get("/user", userController.index);

module.exports = { router };
