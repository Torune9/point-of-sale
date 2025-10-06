import type { NextFunction, Request, Response } from "express";
import prisma from "../../../utils/prisma.js";
import * as QrCode from 'qrcode'
import { cloudinaryImageDestroy, cloudinaryImageUpload } from "../../../utils/cloudinary.js";
import { isPrismaError } from "../../../utils/isPrismaError.js";

export const barcodeGenerate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const { code } = req.body
        const product = await prisma.product.findFirst({
            where: {
                id: id as string
            }
        })
        if (!product) {
            return res.status(404).json({
                message: 'prduct not found',
                code: res.statusCode
            })
        }
        const qrData = JSON.stringify({
            id: product.id,
            name: product.name,
            sku: product.sku,
            price: product.price,
            code
        });

        if (product.barcode) {
            await cloudinaryImageDestroy(product.id)
        }
        const qrUrl = await QrCode.toDataURL(qrData);

        const result = await cloudinaryImageUpload(qrUrl, product.id)

        await prisma.product.update({
            where: {
                id: id as string
            },
            data: {
                barcode: result
            }
        })

        return res.status(201).json({
            message: 'qrcode has been uploaded',
            code: res.statusCode,
            data: result
        })

    } catch (error) {
        if (isPrismaError(error)) {
            next(error)
            return
        }

        return res.status(500).json({
            message: 'error on server when generate qrcode',
            code: res.statusCode,
            errors: error
        })
    }
}
