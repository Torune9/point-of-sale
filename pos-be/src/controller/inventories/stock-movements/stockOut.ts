import type { Request, Response } from "express";
import prisma from "../../../utils/prisma.js";
import { generateInvoice } from "../../../utils/invoiceGenerator.js";
import type { SaleItem } from "../../../schemas/stockMovementSchema.js";
export const stockOutSelling = async (req: Request, res: Response) => {
    try {
        const { businessId, items, totalAmount} = req.body;
        const products = items as Array<SaleItem>;

        const result = await prisma.$transaction(async (tx) => {
            // 1. Buat Sale
            const selling = await tx.sale.create({
                data: {
                    businessId,
                    totalAmount: parseFloat(totalAmount),
                    invoice: await generateInvoice(businessId),
                },
            });

            // 2. Buat Items + Update Stock + Catat StockMovement
            for (const item of products) {
                const product = await prisma.product.findFirst({
                    where: {
                        id: item.productId
                    }
                })

                if (!product) {
                    return res.status(404).json({
                        message: "Product not found",
                        code: res.statusCode,
                    });
                }

                if (product.stock == 0 || item.quantity > product.stock) {
                    return res.status(400).json({
                        message: 'out of stock',
                        code: res.statusCode
                    })
                }

                // Buat Item
                await tx.item.create({
                    data: {
                        quantity: item.quantity,
                        productId: item.productId,
                        price: item.price,
                        subtotal: item.price * item.quantity,
                        saleId: selling.id,
                    },
                });

                // Update stock produk (kurangi karena OUT/SALE)
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });

                // Catat StockMovement
                await tx.stockMovement.create({
                    data: {
                        quantity: item.quantity,
                        type: "OUT",
                        note: "SALE",
                        productId: item.productId,
                        saleId: selling.id,
                    },
                });
            }

            return selling;
        });

        return res.json({
            message: "Products have been sold",
            data: result,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error });
    }
};
