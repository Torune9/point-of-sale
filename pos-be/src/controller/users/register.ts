import type { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma.js";
import { isPrismaError } from "../../utils/isPrismaError.js";
import { isEmailTaken } from "../../helper/isEmailTaken.js";
import bcrypt from "bcrypt"

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, username } = req.body
        const hashPassword = await bcrypt.hash(password, 10)

        const role = await prisma.role.findFirst({
            where: {
                name: {
                    equals: 'owner',
                    mode: 'insensitive'
                }

            }
        })

        if (!role) {
            return res.status(404).json({
                message: 'role not found',
                code: res.statusCode
            })
        }

        const isTaken = await isEmailTaken(email)

        if (isTaken) {
            return res.status(409).json({
                message: 'user already exist',
                code: res.statusCode
            })
        }

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashPassword,
                roleId: role.id
            }
        })

        return res.json({
            message: 'account registered successfully',
            data: user,
        })
    } catch (error) {
        if (isPrismaError(error)) {
            next(error)
        }
        return res.status(500).json({
            message: 'error on server when register account',
            errors: error,
            code: res.statusCode
        })
    }
}
