import type { Response } from "express";
import { logger } from "./logger.js";

export const handleJwtError = (error: any, res: Response) => {
    if (error.name === "TokenExpiredError") {
        return res.status(401).json({
            code: 401,
            message: "Token expired",
        });
    }

    if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
            code: 401,
            message: "Invalid token",
        });
    }

    if (error.name === "NotBeforeError") {
        return res.status(401).json({
            code: 401,
            message: "Token not active yet",
        });
    }

    logger.error(error);

    return res.status(500).json({
        code: 500,
        message: "Internal authentication error",
    });
};
