import type { Request, Response } from "express";
import prisma from "../../../utils/prisma.js";

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const deletedCategory = await prisma.category.delete({
            where: {
                id: id as string
            }
        })
        return res.json({
            message: 'category has been deleted',
            data: deletedCategory
        })

    } catch (error) {
        return res.status(500).json({
            message: 'error when delete category on server',
            code: res.statusCode,
            errors: error
        })
    }
}
