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
const onlyWarn = winston.format((info) => (info.level === "warn" ? info : false))();

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

const warnTransport = new winston.transports.File({
    filename: path.join(__dirname, "../logs/warn.log"),
    level: "warn",
    format: winston.format.combine(
        onlyWarn,
        winston.format.timestamp({
            format: () => moment().format("YYYY-MM-DD HH:mm:ss")
        }),
        winston.format.printf(
            ({ timestamp, level, message }) =>
                `[${timestamp}] ${level.toUpperCase()}: ${message}`
        )
    ),
});

export const logger = winston.createLogger({
    transports: [infoTransport, errorTransport, warnTransport],
});


export const logFormatter = (
    message: string,
    data: object = {},
    moduleUrl: string = ""
): string => {
    return JSON.stringify({
        logId: crypto.randomUUID(),
        moduleUrl,
        message,
        data
    });
};

