import type { Request, Response } from "express";
import prisma from "../../../utils/prisma.js";

export const deleteWorkers = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const workers = await prisma.workers.delete({
            where: {
                id: id as string
            }
        })

        return res.json({
            message: 'workers has been deleted from business',
            data: workers
        })
    } catch (error) {
        return res.status(500).json({
            message: 'error on server when delete workers',
            code: res.statusCode,
            errors: error,
        })
    }
}
