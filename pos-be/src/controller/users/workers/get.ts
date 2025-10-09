import type { Request, Response } from "express";
import prisma from "../../../utils/prisma.js";

export const getWorkers = async (req: Request, res: Response) => {
    try {
        const { businessId } = req.params
        const workers = await prisma.worker.findMany({
            where: {
                businessId: businessId as string
            },
            include: {
                role: {
                    omit: {
                        id: true,
                    }
                },
            },
            orderBy: {
                updatedAt: 'desc'
            }
        })

        return res.json({
            message: 'data success retrieved',
            data: workers
        })

    } catch (error) {
        return res.status(500).json({
            message: 'error when get workers on server',
            code : res.statusCode,
            errors: error
        })
    }
}
