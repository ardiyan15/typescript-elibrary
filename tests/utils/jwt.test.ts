import jwt from "jsonwebtoken"

import { generateToken, verifyToken } from "../../src/utils/jwt"

jest.mock("jsonwebtoken", () => ({
    __esModule: true,
    default: {
        sign: jest.fn(),
        verify: jest.fn()
    }
}))

describe("JWT utilities", () => {
    beforeEach(() => jest.clearAllMocks())

    describe("generateToken", () => {
        it("signs the payload with the configured secret and expiration", () => {
            const payload = { id: "encrypted-id", username: "encrypted-user" }
            ;(jwt.sign as jest.Mock).mockReturnValue("signed-token")

            const result = generateToken(payload)

            expect(result).toBe("signed-token")
            expect(jwt.sign).toHaveBeenCalledWith(payload, "scrtKey123", { expiresIn: "1h" })
        })
    })

    describe("verifyToken", () => {
        it("returns the decoded payload for a valid token", () => {
            const payload = { id: "encrypted-id", username: "encrypted-user" }
            ;(jwt.verify as jest.Mock).mockReturnValue(payload)

            const result = verifyToken("valid-token")

            expect(result).toBe(payload)
            expect(jwt.verify).toHaveBeenCalledWith("valid-token", "scrtKey123")
        })

        it("returns null when token verification throws", () => {
            ;(jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error("invalid token")
            })

            const result = verifyToken("invalid-token")

            expect(result).toBeNull()
            expect(jwt.verify).toHaveBeenCalledWith("invalid-token", "scrtKey123")
        })
    })
})
