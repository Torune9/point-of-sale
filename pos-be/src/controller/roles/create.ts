import prisma from "../../utils/prisma.js"
import type { Request, Response } from "express"

export const createRole = async (req: Request, res: Response) => {
    try {
        const { name } = req.body
        const role = await prisma.role.create({
            data: {
                name: name
            }
        })
        return res.json({
            message : 'role has been created',
            data : role
        })
    } catch (error) {
        return res.status(500).json({
            message : 'error when create role',
            errors : error
        })
    }
}
