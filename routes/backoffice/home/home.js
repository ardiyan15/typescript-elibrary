const express = require("express");
const router = express.Router();

const homeController = require("../../../controllers/backoffice/home/home");

router.get("/home", homeController.getHome);

module.exports = {
  router,
};
