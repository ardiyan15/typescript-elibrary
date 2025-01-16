import bookService from '@services/bookService';
import { Request, Response } from 'express'

export const getBookssDataTable = async (req: Request, res: Response) => {
  const start = parseInt(req.query.start as string, 10) || 0
  const length = parseInt(req.query.length as string, 10) || 0
  const search = req.query.search as { value: string, regex: string }

  const results = await bookService.getBooks(start, length, search)

  res.json({
    draw: req.query.draw,
    recordsTotal: results.recordsTotal,
    recordsFiltered: results.recordsFiltered,
    data: results.data
  })
}

export const index = (req: Request, res: Response) => {
  const flashMessage = req.flash("success");
  const basePath = '/backoffice/books'


  res.render('backoffice/books/index', {
    flashMessage,
    basePath
  })
}

export const create = (_: Request, res: Response) => {
  const formTitle = "Create Book"
  const book: [] = []
  const basePath = '/backoffice/books'
  const action = "/backoffice/store"

  res.render('backoffice/books/form', {
    formTitle,
    book,
    basePath,
    action
  })
}

export const store = async (req: Request, res: Response) => {
  try {
    await bookService.createUser(req)
    res.redirect('/backoffice/books')
  } catch (error) {
    throw error
  }
}

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookId = req.params.id
    await bookService.deleteBook(bookId)
    req.flash("success", "Successfully delete User")
    res.redirect('/backoffice/books')
  } catch (error) {
    res.send(error)
  }
}

export const getBook = async (req: Request, res: Response) => {
  const formTitle = "Update Book"
  const bookId = req.params.id
  const book = await bookService.getBook(bookId)
  const action = "/backoffice/books/update"
  res.render("backoffice/books/form", {
    book,
    bookId,
    formTitle,
    action
  })
}

export const update = async (req: Request, res: Response) => {
  try {
    await bookService.updateBook(req)
    req.flash("success", "Successfully update Book")
    res.redirect('/backoffice/books')
  } catch (error) {
    throw error
  }
}