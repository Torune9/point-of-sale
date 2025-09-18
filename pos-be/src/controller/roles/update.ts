import prisma from "../../utils/prisma.js"
import type { Request, Response } from "express"

export const updateRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { name } = req.body
        const role = await prisma.roles.update({
            where: {
                id: id as string
            },
            data: {
                name: name
            }
        })
        return res.json({
            message: 'role has been updated',
            data: role
        })
    } catch (error) {
        return res.status(500).json({
            message: 'error when update role',
            errors: error
        })
    }
}
