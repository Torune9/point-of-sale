import type { NextFunction, Request, Response } from "express";
import prisma from "../../../utils/prisma.js";
import { isPrismaError } from "../../../utils/isPrismaError.js";

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const { name, price, stock, businessId } = req.body
        const product = await prisma.product.update({
            where: {
                id: id as string,
                businessId: businessId as string
            },
            data: {
                name,
                stock : parseInt(stock),
                price : parseFloat(price)
            }
        })

        return res.json({
            message: 'product has been updated',
            data: product
        })
    } catch (error) {
        if (isPrismaError(error)) {
            next(error)
            return 
        }
        return res.status(500).json({
            message: 'error on server when update product',
            code: res.statusCode,
            errors: error
        })
    }
}
