const express = require("express");
const router = express.Router();

const homeController = require("../../../controllers/frontoffice/home/home");

router.get("/", homeController.getHome);

router.get('/categories', homeController.getBookByCategories);

module.exports = { router };
