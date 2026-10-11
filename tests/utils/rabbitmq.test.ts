import amqplib from "amqplib"

import { closeRabbitMQ, connectRabbitMQ, getRabbitChannel } from "../../src/utils/rabbitmq"

jest.mock("amqplib", () => ({
    __esModule: true,
    default: { connect: jest.fn() }
}))

describe("RabbitMQ utilities", () => {
    const originalEnv = {
        RABBITMQ_HOST: process.env.RABBITMQ_HOST,
        RABBITMQ_PORT: process.env.RABBITMQ_PORT,
        RABBITMQ_USER: process.env.RABBITMQ_USER,
        RABBITMQ_PASSWORD: process.env.RABBITMQ_PASSWORD
    }

    const channel = { close: jest.fn() }
    const connection = { createChannel: jest.fn(), close: jest.fn() }

    beforeEach(() => {
        jest.clearAllMocks()
        delete process.env.RABBITMQ_HOST
        delete process.env.RABBITMQ_PORT
        delete process.env.RABBITMQ_USER
        delete process.env.RABBITMQ_PASSWORD
    })

    afterAll(() => {
        Object.entries(originalEnv).forEach(([key, value]) => {
            if (value === undefined) {
                delete process.env[key]
            } else {
                process.env[key] = value
            }
        })
    })

    it("throws when getting the channel before RabbitMQ is initialized", () => {
        expect(() => getRabbitChannel()).toThrow("RabbitMQ channel not initialized")
    })

    it("logs the connection error and exits when RabbitMQ cannot connect", async () => {
        const error = new Error("connection refused")
        const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined)
        const processExit = jest.spyOn(process, "exit").mockImplementation(((): never => undefined as never))
        ;(amqplib.connect as jest.Mock).mockRejectedValue(error)

        await connectRabbitMQ()

        expect(amqplib.connect).toHaveBeenCalledWith("amqp://guest:guest@localhost:5672")
        expect(consoleError).toHaveBeenCalledWith("Failed to connect to RabbitMQ", error)
        expect(processExit).toHaveBeenCalledWith(1)
        consoleError.mockRestore()
        processExit.mockRestore()
    })

    it("connects using configured environment values and creates a channel", async () => {
        process.env.RABBITMQ_HOST = "rabbit.internal"
        process.env.RABBITMQ_PORT = "5673"
        process.env.RABBITMQ_USER = "app-user"
        process.env.RABBITMQ_PASSWORD = "app-password"
        connection.createChannel.mockResolvedValue(channel)
        ;(amqplib.connect as jest.Mock).mockResolvedValue(connection)

        await connectRabbitMQ()

        expect(amqplib.connect).toHaveBeenCalledWith("amqp://app-user:app-password@rabbit.internal:5673")
        expect(connection.createChannel).toHaveBeenCalledTimes(1)
        expect(getRabbitChannel()).toBe(channel)
    })

    it("closes the channel and connection", async () => {
        channel.close.mockResolvedValue(undefined)
        connection.close.mockResolvedValue(undefined)

        await closeRabbitMQ()

        expect(channel.close).toHaveBeenCalledTimes(1)
        expect(connection.close).toHaveBeenCalledTimes(1)
    })

    it("logs errors while closing RabbitMQ", async () => {
        const error = new Error("connection close failed")
        const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined)
        channel.close.mockResolvedValue(undefined)
        connection.close.mockRejectedValue(error)

        await closeRabbitMQ()

        expect(consoleError).toHaveBeenCalledWith("Error closing RabbitMQ connection", error)
        expect(connection.close).toHaveBeenCalledTimes(1)
        consoleError.mockRestore()
    })
})
