import type { Request, Response } from "express"
import prisma from "../../utils/prisma.js"

export const getRoles = async (req: Request, res: Response) => {
    try {
        const roles = await prisma.role.findMany()
        return res.json({
            message : 'roles successfully obtained',
            data : roles
        })
    } catch (error) {
        return res.status(500).json({
            message : 'error when retrive data roles from server',
            errors : error
        })
    }
}
