import winston from "winston";

const MAX_SIZE = 5 * 1024 * 1024

export const logger = winston.createLogger({
    level: process.env.LEVEL_LOGGER || 'debug',
    handleExceptions: true,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.ms(),
        winston.format.printf(({ level, message, timestamp, ms, stack }) => {
            return stack
                ? `[${timestamp}] ${level}: ${message} ${ms}\n${stack}`
                : `[${timestamp}] ${level}: ${message} ${ms}`;
        })
    ),
    transports: [
        new winston.transports.Console({}),
        new winston.transports.File({
            level: 'warn',
            filename: 'logs/exception.log',
            maxsize: MAX_SIZE
        }),
        new winston.transports.File({
            level: 'error',
            filename: 'logs/errors.log',
            maxsize: MAX_SIZE
        })
    ]
})

