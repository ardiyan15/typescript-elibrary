import { Request, Response } from "express";

import {
    create,
    deleteBook,
    getBook,
    getBookssDataTable,
    index,
    store,
    update,
} from "../../../../src/controllers/backoffice/books";
import bookService from "../../../../src/services/bookService";

jest.mock("../../../../src/services/bookService");

describe("Books controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            query: {},
            params: {},
            body: {},
            flash: jest.fn(),
        };
        res = {
            json: jest.fn(),
            redirect: jest.fn(),
            render: jest.fn(),
            send: jest.fn(),
        };
    });

    describe("getBookssDataTable", () => {
        it("gets books with DataTables parameters and returns the formatted response", async () => {
            req.query = {
                start: "10",
                length: "5",
                search: { value: "history", regex: "false" },
                draw: "3",
            };
            const results = {
                recordsTotal: 12,
                recordsFiltered: 2,
                data: [{ id: "encrypted-id", title: "History" }],
            };
            (bookService.getBooks as jest.Mock).mockResolvedValue(results);

            await getBookssDataTable(req as Request, res as Response);

            expect(bookService.getBooks).toHaveBeenCalledWith(
                10,
                5,
                { value: "history", regex: "false" },
            );
            expect(res.json).toHaveBeenCalledWith({
                draw: "3",
                recordsTotal: 12,
                recordsFiltered: 2,
                data: results.data,
            });
        });

        it("uses zero for missing or invalid pagination values", async () => {
            req.query = { start: "invalid", length: undefined, search: undefined };
            (bookService.getBooks as jest.Mock).mockResolvedValue({
                recordsTotal: 0,
                recordsFiltered: 0,
                data: [],
            });

            await getBookssDataTable(req as Request, res as Response);

            expect(bookService.getBooks).toHaveBeenCalledWith(0, 0, undefined);
        });
    });

    it("renders the books index with flash message and base path", () => {
        (req.flash as jest.Mock).mockReturnValue(["Successfully created"]);

        index(req as Request, res as Response);

        expect(req.flash).toHaveBeenCalledWith("success");
        expect(res.render).toHaveBeenCalledWith("backoffice/books/index", {
            flashMessage: ["Successfully created"],
            basePath: "/backoffice/books",
        });
    });

    it("renders the create form", () => {
        create(req as Request, res as Response);

        expect(res.render).toHaveBeenCalledWith("backoffice/books/form", {
            formTitle: "Create Book",
            book: [],
            basePath: "/backoffice/books",
            action: "/backoffice/books/store",
        });
    });

    it("creates a book, flashes success, and redirects to the books page", async () => {
        (bookService.createBook as jest.Mock).mockResolvedValue({ isError: false });

        await store(req as Request, res as Response);

        expect(bookService.createBook).toHaveBeenCalledWith(req);
        expect(req.flash).toHaveBeenCalledWith("success", "Successfully create Book");
        expect(res.redirect).toHaveBeenCalledWith("/backoffice/books");
    });

    it("deletes a book and redirects to the books page", async () => {
        req.params = { id: "encrypted-id" };
        (bookService.deleteBook as jest.Mock).mockResolvedValue(1);

        await deleteBook(req as Request, res as Response);

        expect(bookService.deleteBook).toHaveBeenCalledWith("encrypted-id");
        expect(req.flash).toHaveBeenCalledWith("success", "Successfully delete Book");
        expect(res.redirect).toHaveBeenCalledWith("/backoffice/books");
    });

    it("sends the delete error when deleting a book fails", async () => {
        const error = new Error("delete failed");
        req.params = { id: "encrypted-id" };
        (bookService.deleteBook as jest.Mock).mockRejectedValue(error);

        await deleteBook(req as Request, res as Response);

        expect(res.send).toHaveBeenCalledWith(error);
    });

    it("loads a book and renders the update form", async () => {
        req.params = { id: "encrypted-id" };
        const book = { id: 1, title: "History" };
        (bookService.getBook as jest.Mock).mockResolvedValue(book);

        await getBook(req as Request, res as Response);

        expect(bookService.getBook).toHaveBeenCalledWith("encrypted-id");
        expect(res.render).toHaveBeenCalledWith("backoffice/books/form", {
            book,
            bookId: "encrypted-id",
            formTitle: "Update Book",
            action: "/backoffice/books/update",
        });
    });

    it("updates a book, flashes success, and redirects to the books page", async () => {
        (bookService.updateBook as jest.Mock).mockResolvedValue([1]);

        await update(req as Request, res as Response);

        expect(bookService.updateBook).toHaveBeenCalledWith(req);
        expect(req.flash).toHaveBeenCalledWith("success", "Successfully update Book");
        expect(res.redirect).toHaveBeenCalledWith("/backoffice/books");
    });
});
