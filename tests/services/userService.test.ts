import { promises as fsPromises } from "fs"
import { validationResult } from "express-validator"

import userService from "../../src/services/userService"
import userRepository from "../../src/repositories/userRepository"
import { decrypt, encrypt } from "../../src/utils/secure"
import { generateToken } from "../../src/utils/jwt"
import { logger, logFormatter } from "../../src/utils/log"

jest.mock("../../src/repositories/userRepository")
jest.mock("../../src/utils/secure", () => ({
    encrypt: jest.fn(),
    decrypt: jest.fn()
}))
jest.mock("../../src/utils/jwt", () => ({ generateToken: jest.fn() }))
jest.mock("../../src/utils/log", () => ({
    logger: { info: jest.fn(), error: jest.fn() },
    logFormatter: jest.fn(() => "formatted-log")
}))
jest.mock("express-validator", () => ({ validationResult: jest.fn() }))

const mockValidation = (errors: any[] = []) => {
    ;(validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => errors.length === 0,
        array: () => errors
    })
}

describe("UserService", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockValidation()
    })

    describe("getAllUsers", () => {
        it("formats users, encrypts IDs, and supplies a fallback image", async () => {
            const createdAt = new Date("2024-01-02T00:00:00.000Z")
            const updatedAt = new Date("2024-02-03T00:00:00.000Z")
            const users: any[] = [{
                id: 7, username: "reader", password: "hash", roles: "user", email: "reader@example.com",
                image: null, createdAt, updatedAt
            }]
            ;(userRepository.findAll as jest.Mock).mockResolvedValue({ data: users, recordsTotal: 1, recordsFiltered: 1 })
            ;(encrypt as jest.Mock).mockReturnValue("encrypted-7")

            const result = await userService.getAllUsers(0, 10, { value: "reader", regex: "false" })

            expect(userRepository.findAll).toHaveBeenCalledWith(0, 10, { value: "reader", regex: "false" })
            expect(encrypt).toHaveBeenCalledWith("7")
            expect(result).toEqual({
                data: [{ id: "encrypted-7", username: "reader", password: "hash", roles: "user",
                    email: "reader@example.com", image: "default-profile.jpg", createdAt: "2 January 2024", updatedAt: "3 February 2024" }],
                recordsTotal: 1,
                recordsFiltered: 1
            })
        })
    })

    describe("getUserBydId", () => {
        it("decrypts the ID by default before looking up the user", async () => {
            const user = { id: "7", username: "reader" }
            ;(decrypt as jest.Mock).mockReturnValue("7")
            ;(userRepository.findById as jest.Mock).mockResolvedValue(user)

            await expect(userService.getUserBydId("encrypted-7")).resolves.toBe(user)
            expect(decrypt).toHaveBeenCalledWith("encrypted-7")
            expect(userRepository.findById).toHaveBeenCalledWith("7")
        })

        it("uses the plain ID when encryption is disabled", async () => {
            ;(userRepository.findById as jest.Mock).mockResolvedValue(null)

            await expect(userService.getUserBydId("7", false)).resolves.toBeNull()
            expect(decrypt).not.toHaveBeenCalled()
            expect(userRepository.findById).toHaveBeenCalledWith("7")
        })
    })

    describe("verifyUser", () => {
        it("returns invalid when the user is not found", async () => {
            ;(userRepository.findByUsername as jest.Mock).mockResolvedValue(null)

            await expect(userService.verifyUser("reader", "password")).resolves.toEqual({ isUserValid: false, data: null })
            expect(userRepository.findByUsername).toHaveBeenCalledWith("reader")
        })
    })

    describe("createUser", () => {
        it("returns validation errors without calling the repository", async () => {
            const errors = [{ msg: "Username is required" }]
            mockValidation(errors)
            const req: any = { originalUrl: "/users", body: { username: "" } }

            await expect(userService.createUser(req)).resolves.toEqual({ isError: true, errors, data: req.body })
            expect(userRepository.create).not.toHaveBeenCalled()
            expect(logger.error).toHaveBeenCalledWith("formatted-log")
        })

        it("adds the uploaded image, removes the supplied ID, and creates the user", async () => {
            const req: any = {
                originalUrl: "/users",
                body: { id: "client-id", username: "reader" },
                file: { filename: "avatar.png" }
            }
            const createdUser = { id: 7, username: "reader" }
            ;(userRepository.create as jest.Mock).mockResolvedValue(createdUser)

            await expect(userService.createUser(req)).resolves.toEqual({ isError: false, errors: [], data: createdUser })
            expect(req.body).toEqual({ username: "reader", image: "avatar.png" })
            expect(userRepository.create).toHaveBeenCalledWith({ username: "reader", image: "avatar.png" })
            expect(logger.info).toHaveBeenCalledWith("formatted-log")
        })
    })

    describe("updateUser", () => {
        it("returns validation errors without updating", async () => {
            const errors = [{ msg: "Invalid email" }]
            mockValidation(errors)
            const req: any = { originalUrl: "/users/update", body: { id: "encrypted-7" } }

            await expect(userService.updateUser(req)).resolves.toEqual({ isError: true, errors, data: [] })
            expect(userRepository.update).not.toHaveBeenCalled()
            expect(logger.error).toHaveBeenCalledWith("formatted-log")
        })

        it("decrypts the user ID and updates with an uploaded image", async () => {
            ;(decrypt as jest.Mock).mockReturnValue("7")
            ;(userRepository.update as jest.Mock).mockResolvedValue([1])
            const req: any = {
                originalUrl: "/users/update",
                body: { id: "encrypted-7", username: "reader" },
                file: { filename: "new-avatar.png" }
            }

            await expect(userService.updateUser(req)).resolves.toEqual([1])
            expect(req.body).toEqual({ username: "reader", image: "new-avatar.png" })
            expect(userRepository.update).toHaveBeenCalledWith("7", { username: "reader", image: "new-avatar.png" })
            expect(logger.info).toHaveBeenCalledWith("formatted-log")
        })

        it("updates without replacing the image when no file is uploaded", async () => {
            ;(decrypt as jest.Mock).mockReturnValue("8")
            ;(userRepository.update as jest.Mock).mockResolvedValue([1])
            const req: any = { originalUrl: "/users/update", body: { id: "encrypted-8", username: "editor" } }

            await userService.updateUser(req)

            expect(userRepository.update).toHaveBeenCalledWith("8", { username: "editor" })
        })
    })

    describe("deleteUser", () => {
        it("decrypts the ID, deletes the user, and logs the result", async () => {
            ;(decrypt as jest.Mock).mockReturnValue("7")
            ;(userRepository.delete as jest.Mock).mockResolvedValue(1)

            await expect(userService.deleteUser("encrypted-7")).resolves.toBe(1)
            expect(userRepository.delete).toHaveBeenCalledWith("7")
            expect(logFormatter).toHaveBeenCalledWith("Delete User Successfully!", { data: 1 })
            expect(logger.info).toHaveBeenCalledWith("formatted-log")
        })
    })

    describe("download", () => {
        it("returns the template path when the file exists", async () => {
            const access = jest.spyOn(fsPromises, "access").mockResolvedValue(undefined)

            const result = await userService.download("user-template.csv")

            expect(access).toHaveBeenCalledWith(expect.stringContaining("user-template.csv"))
            expect(result.responseCode).toBe(200)
            expect(result.responseMessage).toBe("Success")
            expect(result.data).toContain("user-template.csv")
            access.mockRestore()
        })

        it("returns a not found response when the file cannot be accessed", async () => {
            const error = new Error("file not found")
            const access = jest.spyOn(fsPromises, "access").mockRejectedValue(error)

            const result = await userService.download("missing.csv")

            expect(result).toEqual({ responseCode: 404, responseMessage: "Not Found", data: error })
            expect(logger.error).toHaveBeenCalledWith("formatted-log")
            access.mockRestore()
        })
    })

    describe("bulkCreate", () => {
        it("passes the file path to the repository", async () => {
            const response = { responseCode: 200, responseMessage: "Success" }
            ;(userRepository.bulkCreate as jest.Mock).mockResolvedValue(response)

            await expect(userService.bulkCreate("/uploads/users.csv")).resolves.toBe(response)
            expect(userRepository.bulkCreate).toHaveBeenCalledWith("/uploads/users.csv")
        })
    })

    describe("generateJwtToken", () => {
        it("encrypts the ID and username and signs the payload", async () => {
            ;(encrypt as jest.Mock).mockReturnValueOnce("encrypted-id").mockReturnValueOnce("encrypted-name")
            ;(generateToken as jest.Mock).mockReturnValue("jwt-token")

            await expect(userService.generateJwtToken(7, "reader")).resolves.toBe("jwt-token")
            expect(encrypt).toHaveBeenNthCalledWith(1, "7")
            expect(encrypt).toHaveBeenNthCalledWith(2, "reader")
            expect(generateToken).toHaveBeenCalledWith({ id: "encrypted-id", username: "encrypted-name" })
        })
    })

    describe("storeJwtToken", () => {
        it("creates the backoffice session and stores the JWT", async () => {
            const req: any = { session: {} }

            await userService.storeJwtToken(req, "jwt-token")

            expect(req.session.backoffice).toEqual({ jwt: "jwt-token" })
        })

        it("preserves existing backoffice session data while storing the JWT", async () => {
            const req: any = { session: { backoffice: { userId: 7 } } }

            await userService.storeJwtToken(req, "jwt-token")

            expect(req.session.backoffice).toEqual({ userId: 7, jwt: "jwt-token" })
        })
    })
})
