import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";
import { handleJwtError } from "../utils/jwtError.js";
import type { JwtPayload } from "jsonwebtoken";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.get("Authorization");

        if (!authHeader) {
            return res.status(401).json({
                message: "Unauthorized: Missing Authorization header",
            });
        }

        const [scheme, token] = authHeader.split(" ");

        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({
                message: "Unauthorized: Invalid Authorization format",
            });
        }

        const decoded = verifyToken(token) as JwtPayload;

        if (typeof decoded === "string") {
            return res.status(401).json({
                message: "Invalid token payload",
            });
        }

        next();
    } catch (error) {

        return handleJwtError(error, res);
    }
};
