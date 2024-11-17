import express from "express";

const router = express.Router();

import {
  getBook,
  getAddBook,
  saveBook,
} from "../../../controllers/backoffice/books/index";

router.get("/books", getBook);
router.get("/books/form", getAddBook);
router.post("/books", saveBook);

export default router;
