const express = require("express");
const router = express.Router();

const homeController = require("../../../controllers/frontoffice/home/home");

router.get("/", homeController.getHome);

router.get("/categories/:category", homeController.getBookByCategories);

router.post("/search", homeController.searchBook);

module.exports = { router };
