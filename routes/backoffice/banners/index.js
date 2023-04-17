const express = require("express");
const router = express.Router();

const bannerController = require("../../../controllers/backoffice/banners/index");
const isAuth = require("../../../middleware/is-auth");

router.get("/banners", isAuth, bannerController.getBanners);

router.get("/banners/form", bannerController.getForm);

router.post("/banners", bannerController.saveBanner);

module.exports = { router };
