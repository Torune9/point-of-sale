import type { Request, Response } from "express";
import prisma from "../../../utils/prisma.js";
import { logger } from "../../../utils/logger.js";

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { name } = req.body
        const existing = await prisma.category.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive',
                },
            },
        });

        if (existing) {
            return res.status(400).json({
                message: "Category name already exists",
            });
        }
        const category = await prisma.category.update({
            where: {
                id: id as string
            },
            data: {
                name
            }
        })

        return res.json({
            message: 'category has been updated',
            data: category
        })
    } catch (error) {
        logger.error(error)
        return res.status(500).json({
            message: 'error when update category on server',
            code: res.statusCode,
            errors: error
        })
    }
}
