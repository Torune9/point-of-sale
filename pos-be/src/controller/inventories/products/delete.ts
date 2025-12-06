import type { Request, Response } from "express";
import prisma from "../../../utils/prisma.js";
import { cloudinaryImageDestroy } from "../../../utils/cloudinary.js";

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { businessId, id } = req.params
        const used = await prisma.item.count({
            where: {
                productId: id ?? {}
            }
        });

        if (used) {
            return res.status(400).json({
                message: "Tidak bisa menghapus. Produk sudah memiliki riwayat penjualan.",
                code : res.statusCode
            });
        }

        const product = await prisma.product.delete({
            where: {
                id: id as string,
                businessId: businessId as string
            }
        })

        await cloudinaryImageDestroy(product.id)

        return res.json({
            message: 'product has been deleted',
            data: product
        })
    } catch (error) {
        console.log(error);


        return res.status(500).json({
            message: 'error on server when delete product',
            code: res.statusCode,
            errors: error
        })
    }
}
