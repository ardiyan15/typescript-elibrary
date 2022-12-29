const express = require("express");
const router = express.Router();

const loginController = require("../../../controllers/frontoffice/auth/index");

router.get("/", loginController.getLogin);

module.exports = { router };
