import type { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma.js";
import { isPrismaError } from "../../utils/isPrismaError.js";
import { isEmailTaken } from "../../helper/isEmailTaken.js";
import bcrypt from "bcrypt"
import { generateToken } from "../../utils/jwt.js";

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
            },
            include: {
                business: {
                    select : {
                        id : true,
                        name : true,
                    }
                }
            }
        })

        const tokenPayload = {
            id: user.id,
            roleId: user.roleId
        }

        const publicDataUser = {
            id: user.id,
            username: user.username,
            email: user.email,
        }

        const token = generateToken(tokenPayload)

        return res.status(201).json({
            message: 'account registered successfully',
            token,
            business : user.business,
            data: publicDataUser,
            code: res.statusCode
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
