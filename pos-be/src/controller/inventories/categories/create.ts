import type { Request, Response } from "express";
import prisma from "../../../utils/prisma.js";
import { logger } from "../../../utils/logger.js";

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body

        let category = await prisma.category.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive",
                },
            },
        })

        if (category) {
            return res.status(409).json({
                message : 'category already exist',
                code : res.statusCode
            })
        }
        category = await prisma.category.create({
            data: { name },
        })
        return res.json({
            message : 'category has been created',
            code : res.statusCode,
            data : category
        })
    } catch (error) {
        logger.error(error)

        return res.status(500).json({
            message : 'error on server when create category',
            code : res.statusCode,
            errors : error,
        })
    }
}
