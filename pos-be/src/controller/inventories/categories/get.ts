import type { Request, Response } from "express"
import prisma from "../../../utils/prisma.js"

export const getCategory = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany()

        return res.json({
            message: 'category successfully retrieved',
            data: categories
        })
    } catch (error) {
        return res.status(500).json({
            message: 'error on serve when retrieved categories',
            code: res.statusCode,
            errors: error
        })
    }
}

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const categories = await prisma.category.findFirst({
            where: {
                id: id as string
            },
            include: {
                products: true
            }
        })

        return res.json({
            message: 'category successfully retrieved',
            data: categories
        })
    } catch (error) {
        return res.status(500).json({
            message: 'error on serve when retrieved categories',
            code: res.statusCode,
            errors: error
        })
    }
}

