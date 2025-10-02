import type { Request, Response, NextFunction } from "express"
import prisma from "../../../utils/prisma.js"
import { generateSKU } from "../../../utils/generateSku.js"
import { isPrismaError } from "../../../utils/isPrismaError.js"

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, price, stock, categoryId,businessId } = req.body
        const product = await prisma.product.create({
            data: {
                name,
                price: parseFloat(price),
                sku: await generateSKU(categoryId, name),
                stock: parseInt(stock),
                businessId
            }
        })

        return res.status(201).json({
            message: 'product has been added',
            code: res.statusCode,
            data: product
        })
    } catch (error) {

        if (isPrismaError(error)) {
            next(error)
            return 
        }
        return res.status(500).json({
            message: 'error on server when added product',
            errors: error
        })
    }
}
