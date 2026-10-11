import bcrypt from "bcrypt"

import profileRepository from "../../../../src/repositories/profileRepository"
import User from "../../../../src/models/backoffice/users/user"
import sequelize from "../../../../src/utils/connection"

jest.mock("../../../../src/models/backoffice/users/user", () => ({
    __esModule: true,
    default: { update: jest.fn() }
}))

jest.mock("../../../../src/utils/connection", () => ({
    __esModule: true,
    default: { transaction: jest.fn() }
}))

jest.mock("bcrypt", () => ({ hash: jest.fn() }))

describe("ProfileRepository - update", () => {
    const transaction = { commit: jest.fn(), rollback: jest.fn() }

    beforeEach(() => {
        jest.clearAllMocks()
        ;(sequelize.transaction as jest.Mock).mockResolvedValue(transaction)
    })

    it("updates profile fields and commits the transaction", async () => {
        const userData = {
            username: "reader",
            email: "reader@example.com",
            roles: "user",
            image: "profile.png"
        }
        ;(User.update as jest.Mock).mockResolvedValue([1])

        const result = await profileRepository.update("7", userData)

        expect(result).toEqual([1])
        expect(User.update).toHaveBeenCalledWith(userData, { where: { id: "7" }, transaction })
        expect(sequelize.transaction).toHaveBeenCalledTimes(1)
        expect(transaction.commit).toHaveBeenCalledTimes(1)
        expect(transaction.rollback).not.toHaveBeenCalled()
        expect(bcrypt.hash).not.toHaveBeenCalled()
    })

    it("hashes the new password before updating", async () => {
        ;(bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password")
        ;(User.update as jest.Mock).mockResolvedValue([1])

        await profileRepository.update("7", {
            username: "reader",
            email: "reader@example.com",
            roles: "user",
            password: "plain-password"
        })

        expect(bcrypt.hash).toHaveBeenCalledWith("plain-password", 10)
        expect(User.update).toHaveBeenCalledWith({
            username: "reader",
            email: "reader@example.com",
            roles: "user",
            password: "hashed-password"
        }, { where: { id: "7" }, transaction })
        expect(transaction.commit).toHaveBeenCalledTimes(1)
    })

    it("rolls back and returns the error when update fails", async () => {
        const error = new Error("profile update failed")
        ;(User.update as jest.Mock).mockRejectedValue(error)

        const result = await profileRepository.update("7", {
            username: "reader",
            email: "reader@example.com",
            roles: "user"
        })

        expect(result).toBe(error)
        expect(transaction.rollback).toHaveBeenCalledTimes(1)
        expect(transaction.commit).not.toHaveBeenCalled()
    })
})
