import prisma from '../../utils/prisma.js'
import type { Request, Response } from 'express'
import { generateToken } from '../../utils/jwt.js'

import bcrypt from 'bcrypt'

const ownerLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const users = await prisma.user.findFirst({
            where: {
                email
            }
        })
        if (!users) {
            return res.status(400).json({
                message: 'user not found',
                code: res.statusCode
            })
        }
        const matchPassword = await bcrypt.compare(password, users.password)

        if (!matchPassword) {
            return res.status(400).json({
                message: 'wrong password'
            })
        }

        const tokenPayload = {
            id: users.id,
            email: users.email,
            roleId: users.roleId
        }

        const token = generateToken(tokenPayload)
        return res.json({
            message: 'login success',
            token,
            code: res.statusCode
        })

    } catch (error) {

        return res.status(500).json({
            message: 'error in server,when try to login',
            detail: error instanceof Error ? error.message : String(error),
            code: res.statusCode
        })
    }
}

const workerLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const worker = await prisma.worker.findUnique({
            where: { email }
        })

        if (!worker) {
            return res.status(404).json({
                message: "Worker not found"
            })
        }

        const isValid = await bcrypt.compare(password, worker.password)

        if (!isValid) {
            return res.status(401).json({
                message: "wrong password"
            })
        }
        const tokenPayload = {
            id: worker.id,
            email: worker.email,
            roleId: worker.roleId
        }


        const token = generateToken(tokenPayload)

        return res.json({
            message: "Login success",
            token,
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error })
    }
}


export { ownerLogin, workerLogin }
