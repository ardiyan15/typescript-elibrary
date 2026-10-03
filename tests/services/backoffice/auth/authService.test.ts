import bcrypt from "bcrypt"

import userService from "../../../../src/services/userService"
import userRepository from "../../../../src/repositories/userRepository"

jest.mock("../../../../src/repositories/userRepository")
jest.mock("bcrypt")

describe("UserService - verifyUser", () => {

    it("should return invalid when user is not found", async () => {
        (userRepository.findByUsername as jest.Mock)
            .mockResolvedValue(null)

        const result = await userService.verifyUser(
            "testuser",
            "password1234"
        )

        expect(userRepository.findByUsername)
            .toHaveBeenCalledWith("testuser")

        expect(result).toEqual({
            isUserValid: false,
            data: null
        })
    })

    it("should return invalid when password is incorrect", async () => {
        const mockUser = {
            id: 1,
            username: "testuser",
            password: "hashed-password"
        };

        (userRepository.findByUsername as jest.Mock)
            .mockResolvedValue(mockUser);

        (bcrypt.compare as jest.Mock)
            .mockResolvedValue(false);

        const result = await userService.verifyUser(
            "testuser",
            "wrong-password"
        )

        expect(userRepository.findByUsername)
            .toHaveBeenCalledWith("testuser");

        expect(bcrypt.compare)
            .toHaveBeenCalledWith(
                "wrong-password",
                "hashed-password"
            );

        expect(result).toEqual({
            isUserValid: false,
            data: null
        })

    })

     it("should return valid when username and password are correct", async () => {
        const mockUser = {
            id: 1,
            username: "testuser",
            password: "hashed-password"
        };

        (userRepository.findByUsername as jest.Mock)
            .mockResolvedValue(mockUser);

        (bcrypt.compare as jest.Mock)
            .mockResolvedValue(true);

        const result = await userService.verifyUser(
            "testuser",
            "wrong-password"
        )

        expect(userRepository.findByUsername)
            .toHaveBeenCalledWith("testuser");

        expect(bcrypt.compare)
            .toHaveBeenCalledWith(
                "wrong-password",
                "hashed-password"
            );

        expect(result.isUserValid).toBe(true)
        expect(result.data).toEqual({
            id: 1,
            username: "testuser"
        })

    })
})