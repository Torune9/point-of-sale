import type { Request, Response } from "express";
import prisma from "../../../utils/prisma.js";
import { cloudinaryImageDestroy } from "../../../utils/cloudinary.js";

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { businessId } = req.body
        const product = await prisma.product.delete({
            where: {
                id: id as string,
                businessId: businessId as string
            }
        })

        await cloudinaryImageDestroy(product.id)

        return res.json({
            message: 'product has been updated',
            data: product
        })
    } catch (error) {
       
        return res.status(500).json({
            message: 'error on server when delete product',
            code: res.statusCode,
            errors: error
        })
    }
}
