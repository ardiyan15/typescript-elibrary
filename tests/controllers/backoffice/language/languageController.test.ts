import { Request, Response } from "express"
import i18next from "i18next"

import { index, store } from "../../../../src/controllers/backoffice/language"
import { redisClient } from "../../../../src/utils/redis"

jest.mock("../../../../src/utils/redis", () => ({
    redisClient: {
        get: jest.fn(),
        set: jest.fn()
    }
}))

jest.mock("i18next", () => ({
    __esModule: true,
    default: { changeLanguage: jest.fn() }
}))

describe("Backoffice Language controller", () => {
    let req: Partial<Request>
    let res: Partial<Response>

    beforeEach(() => {
        jest.clearAllMocks()
        req = {
            body: {},
            flash: jest.fn()
        }
        res = {
            render: jest.fn(),
            redirect: jest.fn()
        }
    })

    describe("index", () => {
        it("renders the page with the saved language and flash message", async () => {
            ;(req.flash as jest.Mock).mockReturnValue(["Language updated"])
            ;(redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify({ language: "id" }))

            await index(req as Request, res as Response)

            expect(req.flash).toHaveBeenCalledWith("success")
            expect(redisClient.get).toHaveBeenCalledWith("language")
            expect(res.render).toHaveBeenCalledWith("backoffice/language/index", {
                flashMessage: ["Language updated"],
                language: "id"
            })
        })

        it("renders an empty language when no setting is saved", async () => {
            ;(req.flash as jest.Mock).mockReturnValue([])
            ;(redisClient.get as jest.Mock).mockResolvedValue(null)

            await index(req as Request, res as Response)

            expect(res.render).toHaveBeenCalledWith("backoffice/language/index", {
                flashMessage: [],
                language: ""
            })
        })
    })

    describe("store", () => {
        it("saves the language, changes the active language, flashes success, and redirects", async () => {
            req.body = { language: "id" }
            ;(redisClient.set as jest.Mock).mockResolvedValue("OK")
            ;(i18next.changeLanguage as jest.Mock).mockResolvedValue("id")

            await store(req as Request, res as Response)

            expect(redisClient.set).toHaveBeenCalledWith("language", JSON.stringify({ language: "id" }))
            expect(i18next.changeLanguage).toHaveBeenCalledWith("id")
            expect(req.flash).toHaveBeenCalledWith("success", "Successfully update language")
            expect(res.redirect).toHaveBeenCalledWith("/backoffice/")
        })
    })
})
