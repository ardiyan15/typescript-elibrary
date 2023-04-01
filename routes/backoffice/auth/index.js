const express = require("express");
const router = express.Router();

const loginController = require("../../../controllers/backoffice/auth/login");
const logoutController = require("../../../controllers/backoffice/auth/logout");
const isAuth = require("../../../middleware/is-auth");

router.get("/", loginController.login);

router.post("/login", loginController.postLogin);

router.post("/logout", logoutController.logout);

module.exports = { router };
