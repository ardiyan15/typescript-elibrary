const express = require("express");
const router = express.Router();

const homeController = require("../../../controllers/frontoffice/home/home");
const bookController = require("../../../controllers/frontoffice/book/index");

router.get("/", homeController.getHome);

router.get("/:id", bookController.showBook);

router.get("/categories/:category", homeController.getBookByCategories);

router.post("/search", homeController.searchBook);

module.exports = { router };
