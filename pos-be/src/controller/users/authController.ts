import prisma from '../../utils/prisma.js'
import type { Request, Response } from 'express'
import { generateToken } from '../../utils/jwt.js'

import bcrypt from 'bcrypt'

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const users = await prisma.user.findFirst({
            where: {
                email
            }
        })
        if (!users) {
            return res.status(400).json({
                message: 'email not found',
                code: res.statusCode
            })
        }
        if (users?.password) {
            const matchPassword = await bcrypt.compare(password, users.password)
            if (!matchPassword) {
                return res.status(400).json({
                    message: 'wrong password'
                })
            }
        }
        const tokenPayload = { id: users.id, email: users.email }

        const token = generateToken(tokenPayload)
        return res.json({
            message: 'login success',
            token,
            code: res.statusCode
        })

    } catch (error) {

        return res.status(500).json({
            message: 'error in sever,when try to login',
            detail: error instanceof Error ? error.message : String(error),
            code: res.statusCode
        })
    }
}

export { login }
