import { Request, Response } from "express"

import { edit, index, update } from "../../../../src/controllers/backoffice/profiles"
import userService from "../../../../src/services/userService"
import profileService from "../../../../src/services/profileService"

jest.mock("../../../../src/services/userService")
jest.mock("../../../../src/services/profileService")

describe("Backoffice Profile controller", () => {
    let req: Partial<Request>
    let res: Partial<Response>
    const auth = { getUser: jest.fn(() => ({ id: 7 })) }

    beforeEach(() => {
        jest.clearAllMocks()
        req = { flash: jest.fn() }
        res = {
            locals: { auth } as any,
            render: jest.fn(),
            redirect: jest.fn(),
            send: jest.fn()
        }
    })

    describe("index", () => {
        it("loads the authenticated user's profile and renders the page", async () => {
            const profile = { id: 7, username: "reader" }
            ;(req.flash as jest.Mock).mockReturnValue(["Profile updated"])
            ;(userService.getUserBydId as jest.Mock).mockResolvedValue(profile)

            await index(req as Request, res as Response)

            expect(req.flash).toHaveBeenCalledWith("success")
            expect(auth.getUser).toHaveBeenCalledTimes(1)
            expect(userService.getUserBydId).toHaveBeenCalledWith(7, false)
            expect(res.render).toHaveBeenCalledWith("backoffice/profiles/index", {
                flashMessage: ["Profile updated"],
                result: profile,
                basePath: "/backoffice/profile"
            })
        })
    })

    describe("edit", () => {
        it("loads the authenticated user's profile and renders the edit form", async () => {
            const user = { id: 7, username: "reader" }
            ;(userService.getUserBydId as jest.Mock).mockResolvedValue(user)

            await edit(req as Request, res as Response)

            expect(auth.getUser).toHaveBeenCalledTimes(1)
            expect(userService.getUserBydId).toHaveBeenCalledWith(7, false)
            expect(res.render).toHaveBeenCalledWith("backoffice/profiles/form", {
                user,
                errors: [],
                basePath: "/backoffice/profile"
            })
        })
    })

    describe("update", () => {
        it("updates the profile, flashes success, and redirects", async () => {
            ;(profileService.updateUser as jest.Mock).mockResolvedValue([1])

            await update(req as Request, res as Response)

            expect(profileService.updateUser).toHaveBeenCalledWith(req)
            expect(req.flash).toHaveBeenCalledWith("success", "Successfully update User")
            expect(res.redirect).toHaveBeenCalledWith("/backoffice/profile")
            expect(res.send).not.toHaveBeenCalled()
        })

        it("sends the error when updating the profile fails", async () => {
            const error = new Error("update failed")
            ;(profileService.updateUser as jest.Mock).mockRejectedValue(error)

            await update(req as Request, res as Response)

            expect(profileService.updateUser).toHaveBeenCalledWith(req)
            expect(res.send).toHaveBeenCalledWith(error)
            expect(req.flash).not.toHaveBeenCalled()
            expect(res.redirect).not.toHaveBeenCalled()
        })
    })
})
