const express = require("express");
const router = express.Router();

const homeController = require("../../../controllers/backoffice/home/home");
const isAuth = require("../../../middleware/is-auth");

router.get("/home", homeController.getHome);

module.exports = {
  router,
};
