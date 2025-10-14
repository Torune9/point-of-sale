import type { NextFunction, Request, Response } from "express";
import prisma from "../utils/prisma.js";
import type { JwtPayload } from "jsonwebtoken";
import { handleJwtError } from "../utils/jwtError.js";
import { verifyToken } from "../utils/jwt.js";

export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [scheme, token] = (req.get('Authorization') ?? '').split(' ');

        const dataVerified = verifyToken(token as string) as JwtPayload

        const role = await prisma.role.findFirst({
            where: {
                id: dataVerified.roleId
            }
        })

        if (!role) {
            return res.status(404).json({
                message: 'role not found'
            })
        }

        const isAdmin = role.name.toLowerCase() == 'admin'

        if (!isAdmin) {
            return res.status(400).json({
                message: 'not authorize',
                code: res.statusCode
            })
        }

        next()
    } catch (error) {
        return handleJwtError(error, res)
    }
}
