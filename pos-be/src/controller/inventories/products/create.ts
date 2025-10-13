import type { Request, Response, NextFunction } from "express"
import prisma from "../../../utils/prisma.js"
import { generateSKU } from "../../../helper/generateSku.js"
import { isPrismaError } from "../../../utils/isPrismaError.js"

import * as QrCode from 'qrcode'
import { cloudinaryImageUpload } from "../../../utils/cloudinary.js"

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, price, stock, categoryId, businessId } = req.body
        const product = await prisma.product.create({
            data: {
                name,
                price: parseFloat(price),
                sku: await generateSKU(categoryId, name),
                stock: parseInt(stock),
                categoryId,
                businessId
            }
        })
        const qrData = JSON.stringify({
            id: product.id,
            name: product.name,
            price: product.price
        })

        const qrUrl = await QrCode.toDataURL(qrData)

        const resultQrCode = await cloudinaryImageUpload(qrUrl, product.id)

        const productUpdate = await prisma.product.update({
            where: {
                id: product.id
            },
            data: {
                barcode: resultQrCode
            }
        })
        return res.status(201).json({
            message: 'product has been added',
            code: res.statusCode,
            data: productUpdate,
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
