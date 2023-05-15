const express = require("express");
const router = express.Router();

const categoryController = require("../../../controllers/backoffice/categories/index");
const isAuth = require("../../../middleware/is-auth");
const Category = require("../../../models/backoffice/categories/category");

const { body } = require("express-validator");

router.get("/categories", isAuth, categoryController.getCategories);

router.get("/categories/form", isAuth, categoryController.addCategory);

router.get("/categories/:id", isAuth, categoryController.getCategory);

router.post(
  "/categories",
  isAuth,
  body("code")
    .notEmpty()
    .isLength({ min: 3, max: 3 })
    .withMessage("Code length must be 3 character")
    .custom((value) => {
      return Category.findOne({ where: { code: value } }).then(() => {
        return Promise.reject("Code already exists");
      });
    }),
  body("description")
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Description length at least 5 character"),
  categoryController.saveCategory
);

router.post("/categorydelete", isAuth, categoryController.deleteCategory);

router.post("/updatecategory/:id", isAuth, categoryController.updateCategory);

module.exports = { router };
