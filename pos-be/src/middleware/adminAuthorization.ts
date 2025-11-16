import type { NextFunction, Request, Response } from "express"
import { handleJwtError } from "../utils/jwtError.js"
import { roleCheck } from "../helper/roleCheck.js"

export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [scheme, token] = (req.get("Authorization") ?? "").split(" ")

        const result = await roleCheck(token as string, "admin")

        if (!result.ok) {
            return res.status(result.code as number).json({
                message : result.message,
                code : result.code
            })
        }

        next()

    } catch (error) {
        return handleJwtError(error, res)
    }
}
