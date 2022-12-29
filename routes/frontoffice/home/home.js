const express = require("express");
const router = express.Router();

const homeController = require("../../../controllers/frontoffice/home/home");
const bookController = require("../../../controllers/frontoffice/book/index");

router.get("/", homeController.getHome);

router.get("/show/:id", bookController.showBook);

router.get("/categories/:category", homeController.getBookByCategories);

router.post("/search", homeController.searchBook);

router.post("/review", homeController.saveReview);

module.exports = { router };
