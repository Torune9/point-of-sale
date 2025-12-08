import type { Request, Response } from "express";
import prisma from "../../../utils/prisma.js";

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { categoryId } = req.query
        const { businessId } = req.params

        const products = await prisma.product.findMany({
            where: {
                businessId: businessId as string,
                categoryId: categoryId as string || {},
            },
            include: {
                category: true
            },
            orderBy: {
                updatedAt: 'desc'
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

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { businessId,productId } = req.params
        const product = await prisma.product.findFirst({
            where: {
                id: productId as string,
                businessId : businessId as string
            }
        })

        if (!product) {
            return res.status(404).json({
                message: 'product not found',
                code: res.statusCode
            })
        }

        return res.json({
            message: 'product successfully get',
            data: product
        })
    } catch (error) {
        return res.status(500).json({
            message: 'error on server when get product detail',
            code: res.statusCode,
            errors: error
        })
    }
}
