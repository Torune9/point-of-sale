import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { logger } from "../utils/logger.js";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {

        const [scheme, token] = (req.get('Authorization') ?? '').split(' ');

        if (!token) {
            return res.status(400).json({
                message: 'must be loged in',
                code: res.statusCode
            })
        }
        const secretKey = process.env.PRIVATE_KEY;
        if (!secretKey) {
            throw new Error("PRIVATE_KEY not set in environment");
        }

        const tokenVerified = jwt.verify(token,secretKey)

        if (tokenVerified && scheme == "Bearer") {
            next()
        }
    } catch (error: any) {
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

        logger.error(error)

    }
}
