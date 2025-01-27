import express from "express";

const router = express.Router();

import { index, create, store, getBookssDataTable, deleteBook, getBook, update } from '@controllers/backoffice/books'
import { uploadImage } from "@utils/upload";
import { bookUpdateValidator, bookValidator } from "@validators/book";

router.get("/booksTable", getBookssDataTable)

router.get("/books", index);

router.get('/books/create', create)

router.get('/books/:id', getBook)

router.post('/books/store', uploadImage('book-image'), bookValidator, store)

router.post('/books/update', uploadImage('book-image'), bookUpdateValidator, update)

router.post("/books/delete/:id", deleteBook)

export default router;
