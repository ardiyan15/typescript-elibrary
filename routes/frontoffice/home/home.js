const express = require("express");
const router = express.Router();

const homeController = require("../../../controllers/frontoffice/home/home");

router.get("/", homeController.getHome);

module.exports = { router };
