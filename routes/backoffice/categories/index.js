const express = require("express");
const router = express.Router();

const categoryController = require("../../../controllers/backoffice/categories/index");
const isAuth = require("../../../middleware/is-auth");

router.get("/categories", categoryController.getCategories);

router.get("/categories/:id", categoryController.getCategory);

router.get("/categories/form", categoryController.addCategory);

router.post("/categories", categoryController.saveCategory);

router.post("/categorydelete", categoryController.deleteCategory);

router.post("/updatecategory/:id", categoryController.updateCategory);

module.exports = { router };
