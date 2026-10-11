import { validationResult } from "express-validator"

import profileService from "../../src/services/profileService"
import profileRepository from "../../src/repositories/profileRepository"

jest.mock("../../src/repositories/profileRepository")
jest.mock("express-validator", () => ({
    validationResult: jest.fn()
}))

const mockValidation = (errors: any[] = []) => {
    ;(validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => errors.length === 0,
        array: () => errors
    })
}

describe("ProfileService - updateUser", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockValidation()
    })

    it("returns validation errors without updating the profile", async () => {
        const errors = [{ msg: "Email is invalid" }]
        mockValidation(errors)
        const req: any = { body: { id: "7", email: "invalid" } }

        await expect(profileService.updateUser(req)).resolves.toEqual({
            isError: true,
            errors,
            data: []
        })
        expect(profileRepository.update).not.toHaveBeenCalled()
        expect(req.body).toEqual({ id: "7", email: "invalid" })
    })

    it("removes the user ID and updates profile data with the uploaded image", async () => {
        const req: any = {
            body: { id: "7", username: "reader", email: "reader@example.com" },
            file: { filename: "profile.png" }
        }
        ;(profileRepository.update as jest.Mock).mockResolvedValue([1])

        await expect(profileService.updateUser(req)).resolves.toEqual([1])

        expect(req.body).toEqual({
            username: "reader",
            email: "reader@example.com",
            image: "profile.png"
        })
        expect(profileRepository.update).toHaveBeenCalledWith("7", {
            username: "reader",
            email: "reader@example.com",
            image: "profile.png"
        })
    })

    it("updates profile data without changing the image when no file is uploaded", async () => {
        const req: any = {
            body: { id: "9", username: "editor", email: "editor@example.com" }
        }
        ;(profileRepository.update as jest.Mock).mockResolvedValue([1])

        await expect(profileService.updateUser(req)).resolves.toEqual([1])

        expect(req.body).toEqual({ username: "editor", email: "editor@example.com" })
        expect(profileRepository.update).toHaveBeenCalledWith("9", {
            username: "editor",
            email: "editor@example.com"
        })
    })
})
