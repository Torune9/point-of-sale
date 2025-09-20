import winston from "winston";

export const logger = winston.createLogger({
    level: process.env.LEVEL_LOGGER || 'debug',
    handleExceptions : true,
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
            filename : 'logs/exception.log',
        })
    ]
})

