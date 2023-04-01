const express = require("express");
const router = express.Router();

const loginController = require("../../../controllers/frontoffice/auth/index");

router.get("/", loginController.getLogin);

router.get("/user", loginController.getRegister);

router.post("/user", loginController.saveRegister);

router.post("/", loginController.authLogin);

module.exports = { router };
