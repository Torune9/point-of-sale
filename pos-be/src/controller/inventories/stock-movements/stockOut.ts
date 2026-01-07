import type { Request, Response } from "express";
import prisma from "../../../utils/prisma.js";
import { generateInvoice } from "../../../helper/invoiceGenerator.js";
import { generateReceiptPDF } from "../../../helper/receiptReportPdf.js";
import type { SaleItem } from "../../../schemas/stockMovementSchema.js";
import { getIO } from "../../../socket.js";

export const stockOutSelling = async (req: Request, res: Response) => {
    try {
        const { businessId, items, totalAmount, paidAmount, workerId } = req.body;
        const products = items as Array<SaleItem>;

        const outOfStockEvents: {
            productId: string;
            productName: string;
            stock: number
        }[] = [];

        const result = await prisma.$transaction(async (tx) => {
            if (paidAmount < totalAmount) {
                throw new Error("money is not enough");
            }

            const selling = await tx.sale.create({
                data: {
                    businessId,
                    totalAmount: parseFloat(totalAmount),
                    invoice: await generateInvoice(businessId),
                    paidAmount,
                    changeAmount: Math.abs(paidAmount - totalAmount),
                },
            });

            for (const item of products) {
                const product = await tx.product.findFirst({
                    where: { id: item.productId },
                });

                if (!product) {
                    throw new Error(`Product ${item.productId} not found`);
                }

                if (item.quantity > product.stock) {
                    throw new Error(`Product ${product.name} out of stock`);
                }

                const oldStock = product.stock;
                const newStock = oldStock - item.quantity;

                await tx.item.create({
                    data: {
                        quantity: item.quantity,
                        productId: item.productId,
                        price: item.price,
                        subtotal: item.price * item.quantity,
                        saleId: selling.id,
                        businessId,
                    },
                });

                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: newStock },
                });

                await tx.stockMovement.create({
                    data: {
                        quantity: item.quantity,
                        type: "OUT",
                        note: "SALE",
                        productId: item.productId,
                        saleId: selling.id,
                        businessId,
                    },
                });

                // 🔔 DETEKSI MOMEN STOK HABIS
                outOfStockEvents.push({
                    productId: product.id,
                    productName: product.name,
                    stock: newStock
                });
            }

            await tx.cashflow.create({
                data: {
                    type: "IN",
                    amount: parseFloat(totalAmount),
                    note: `Selling ${selling.invoice}`,
                    saleId: selling.id,
                    businessId: selling.businessId,
                    workerId: workerId || null,
                },
            });

            return selling;
        });

        //  EMIT NOTIF SETELAH TRANSAKSI SUKSES
        if (outOfStockEvents.length > 0) {
            const io = getIO();

            for (const event of outOfStockEvents) {
                if (event.stock == 0) {
                    io.to(`store:${businessId}`).emit("product:empty-stock", {
                        message: `Stok ${event.productName} habis`,
                        product: {
                            id: event.productId,
                            name: event.productName,
                            stock: event.stock
                        }
                    });
                }else{
                    io.to(`store:${businessId}`).emit("product:stock-out-sales", {
                        message: `Stok out sales ${event.productName}`,
                        product: {
                            id: event.productId,
                            name: event.productName,
                            stock: event.stock
                        }
                    });

                }
            }
        }

        const sale = await prisma.sale.findUnique({
            where: { id: result.id },
            include: {
                business: true,
                items: { include: { product: true } },
            },
        });

        if (!sale) {
            return res.status(404).json({ message: "Sale not found" });
        }

        if (req.query.print === "true") {
            return generateReceiptPDF(sale, res);
        }

        return res.json({
            message: "Products have been sold",
            data: sale,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message || "Error processing sale",
        });
    }
};
