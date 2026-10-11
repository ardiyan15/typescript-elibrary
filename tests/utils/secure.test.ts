import { decrypt, encrypt } from "../../src/utils/secure"

describe("Secure utilities", () => {
    describe("encrypt", () => {
        it("returns an encoded ciphertext instead of the original value", () => {
            const value = "user-id/with + symbols"

            const result = encrypt(value)

            expect(result).not.toBe(value)
            expect(result).toBe(encodeURIComponent(decodeURIComponent(result)))
        })
    })

    describe("decrypt", () => {
        it("restores the original text from an encrypted value", () => {
            const value = "user-id/with + symbols"

            expect(decrypt(encrypt(value))).toBe(value)
        })

        it("restores numeric IDs represented as strings", () => {
            expect(decrypt(encrypt("12345"))).toBe("12345")
        })
    })
})
