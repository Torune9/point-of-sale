import type { Request, Response } from "express";
import prisma from "../../../utils/prisma.js";

export const updateWorkers = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { username, email, roleId } = req.body

        if (!username || !email) {
            return res.status(400).json({
                message: 'username or email must be filled',
                code: res.statusCode
            })
        }

        const workers = await prisma.workers.update({
            where: {
                id: id as string
            },
            data: {
                username,
                email,
                roleId
            }
        })

        return res.status(200).json({
            message: 'worker has been updated',
            code: res.statusCode,
            data: workers,
        })

    } catch (error) {

        return res.status(500).json({
            message: 'error when update worker on server',
            code: res.statusCode,
            errors: error,
        })
    }
}
