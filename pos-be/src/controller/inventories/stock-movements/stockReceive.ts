import type { Request, Response } from "express";
import prisma from "../../../utils/prisma.js";

export const stockMovement = async (req: Request, res: Response) => {
    try {
        const { quantity, type, productId, note,businessId } = req.body

        const product = await prisma.product.findFirst({
            where: {
                id: productId
            }
        })
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                code: res.statusCode,
            });
        }

        if (product.stock == 0 || quantity > product.stock) {
            return res.status(400).json({
                message: 'out of stock',
                code: res.statusCode
            })
        }

        if (type === 'OUT') {
            const [stockMovement, product] = await prisma.$transaction([
                prisma.stockMovement.create({
                    data: {
                        quantity,
                        type,
                        productId,
                        note,
                        businessId
                    },
                    omit: {
                        updatedAt: true,
                    },
                }),
                prisma.product.update({
                    where: {
                        id: productId as string
                    },
                    data: {
                        stock: {
                            decrement: quantity
                        }
                    },
                })
            ])

            return res.json({
                message: 'product has been out stock',
                dataReceive: stockMovement,
                dataUpdate: product
            })
        } else if (type === 'IN') {
            const [stockMovement, product] = await prisma.$transaction([
                prisma.stockMovement.create({
                    data: {
                        quantity,
                        type,
                        productId,
                        note,
                        businessId
                    },
                    omit: {
                        updatedAt: true,
                    },
                }),
                prisma.product.update({
                    where: {
                        id: productId as string
                    },
                    data: {
                        stock: {
                            increment: quantity
                        }
                    },
                })
            ])

            return res.status(201).json({
                message: 'product has been recap',
                code: res.statusCode,
                dataReceive: stockMovement,
                dataUpdate: product,
            })
        }

    } catch (error) {
        return res.status(500).json({
            message: 'error when create recap product on server',
            code: res.statusCode,
            errors: error
        })
    }
}
