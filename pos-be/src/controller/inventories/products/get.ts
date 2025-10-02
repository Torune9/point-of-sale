import type { Request, Response } from "express";
import prisma from "../../../utils/prisma.js";

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { categoryId } = req.query
        const { bussinesId } = req.body

        const products = await prisma.product.findMany({
            where: {
                businessId: bussinesId as string,
                categoryId: categoryId as string,
            },
            orderBy : {
                updatedAt : 'desc'
            }
        })

        return res.json({
            message: 'products has been retrieved',
            data: products
        })

    } catch (error) {
        return res.status(500).json({
            message: 'error on server when retrieved products',
            code: res.statusCode,
            errors: error
        })
    }
}
