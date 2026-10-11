import winston from "winston"

import { logger, logFormatter, logStream } from "../../src/utils/log"

jest.mock("fs", () => ({
    ...jest.requireActual("fs"),
    createWriteStream: jest.fn(() => "mock-log-stream")
}))

jest.mock("winston", () => ({
    __esModule: true,
    default: {
        format: Object.assign(
            jest.fn((transform) => () => ({ transform })),
            {
                combine: jest.fn((...formats) => formats),
                timestamp: jest.fn((options) => ({ type: "timestamp", options })),
                printf: jest.fn((formatter) => ({ type: "printf", formatter }))
            }
        ),
        transports: {
            File: jest.fn().mockImplementation((options) => ({ options }))
        },
        createLogger: jest.fn((options) => ({
            options,
            info: jest.fn(),
            error: jest.fn()
        }))
    }
}))

describe("Log utilities", () => {
    describe("logFormatter", () => {
        it("serializes message data and module URL with a generated log ID", () => {
            const result = JSON.parse(logFormatter("User created", { data: { id: 7 } }, "/users"))

            expect(result).toEqual({
                moduleUrl: "/users",
                logId: expect.any(String),
                message: "User created",
                data: JSON.stringify({ data: { id: 7 } })
            })
            expect(result.logId.length).toBeGreaterThan(0)
        })

        it("uses an empty module URL by default", () => {
            const result = JSON.parse(logFormatter("Request received", {}))

            expect(result.moduleUrl).toBe("")
            expect(result.message).toBe("Request received")
            expect(result.data).toBe("{}")
        })
    })

    describe("logger setup", () => {
        it("creates separate info and error file transports", () => {
            expect(winston.createLogger).toHaveBeenCalledTimes(1)
            expect(winston.transports.File).toHaveBeenCalledTimes(2)
            expect(winston.transports.File).toHaveBeenNthCalledWith(1, expect.objectContaining({
                filename: expect.stringContaining("info.log"),
                level: "info"
            }))
            expect(winston.transports.File).toHaveBeenNthCalledWith(2, expect.objectContaining({
                filename: expect.stringContaining("error.log"),
                level: "error"
            }))
            expect(logStream).toBe("mock-log-stream")
            expect(logger).toHaveProperty("info")
            expect(logger).toHaveProperty("error")
        })

        it("filters info and error records for their corresponding transports", () => {
            const formatMock = winston.format as unknown as jest.Mock
            const infoFilter = formatMock.mock.calls[0][0]
            const errorFilter = formatMock.mock.calls[1][0]
            const infoRecord = { level: "info", message: "info message" }
            const errorRecord = { level: "error", message: "error message" }

            expect(infoFilter(infoRecord)).toBe(infoRecord)
            expect(infoFilter(errorRecord)).toBe(false)
            expect(errorFilter(errorRecord)).toBe(errorRecord)
            expect(errorFilter(infoRecord)).toBe(false)
        })
    })
})
