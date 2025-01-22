import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import winston from 'winston'
import moment from 'moment'

export const logStream = fs.createWriteStream(path.join(__dirname, '../logs/access.log'), {
    flags: 'a'
})

const onlyInfo = winston.format((info) => (info.level === "info" ? info : false))();
const onlyError = winston.format((info) => (info.level === "error" ? info : false))();

const infoTransport = new winston.transports.File({
    filename: path.join(__dirname, "../logs/info.log"),
    level: "info",
    format: winston.format.combine(
        onlyInfo,
        winston.format.timestamp({
            format: () => moment().format("YYYY-MM-DD HH:mm:ss")
        }),
        winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
    ),
});

const errorTransport = new winston.transports.File({
    filename: path.join(__dirname, "../logs/error.log"),
    level: "error",
    format: winston.format.combine(
        onlyError,
        winston.format.timestamp({
            format: () => moment().format("YYYY-MM-DD HH:mm:ss")
        }),
        winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
    ),
});

export const logger = winston.createLogger({
    transports: [infoTransport, errorTransport],
});

export const logFormatter = (message: string, data: Object, moduleUrl: string = "") => {
    const logId = crypto.randomUUID()
    const result = {
        moduleUrl,
        logId,
        message,
        data: JSON.stringify(data)
    }

    return JSON.stringify(result)
}