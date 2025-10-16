import type { Request, Response } from "express";
import prisma from "../../../utils/prisma.js";
import { generateInvoice } from "../../../helper/invoiceGenerator.js";
import { generateReceiptPDF } from "../../../helper/receiptReportPdf.js";
import type { SaleItem } from "../../../schemas/stockMovementSchema.js";

export const stockOutSelling = async (req: Request, res: Response) => {
    try {
        const { businessId, items, totalAmount, paidAmount, workerId } = req.body;
        const products = items as Array<SaleItem>;

        const result = await prisma.$transaction(async (tx) => {
            if (paidAmount < totalAmount) {
                throw new Error("money is not enough");
            }

            // Buat data penjualan
            const selling = await tx.sale.create({
                data: {
                    businessId,
                    totalAmount: parseFloat(totalAmount),
                    invoice: await generateInvoice(businessId),
                    paidAmount,
                    changeAmount: Math.abs(paidAmount - totalAmount),
                },
            });

            // Loop setiap produk yang dijual
            for (const item of products) {
                const product = await prisma.product.findFirst({
                    where: { id: item.productId },
                });

                if (!product) throw new Error(`Product ${item.productId} not found`);
                if (product.stock === 0 || item.quantity > product.stock)
                    throw new Error(`Product ${product.name} out of stock`);

                // Buat item penjualan
                await tx.item.create({
                    data: {
                        quantity: item.quantity,
                        productId: item.productId,
                        price: item.price,
                        subtotal: item.price * item.quantity,
                        saleId: selling.id,
                        businessId: businessId,
                    },
                });

                // Update stok produk
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });

                // Catat pergerakan stok
                await tx.stockMovement.create({
                    data: {
                        quantity: item.quantity,
                        type: "OUT",
                        note: "SALE",
                        productId: item.productId,
                        saleId: selling.id,
                        businessId: businessId,
                    },
                });
            }

            // Catat cashflow
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

        // Ambil data lengkap untuk struk
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

        // Jika client meminta print PDF
        if (req.query.print === "true") {
            return generateReceiptPDF(sale, res);
        }

        // Default: response JSON
        return res.json({
            message: "Products have been sold",
            data: sale,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: error.message || "Error processing sale",
            error,
        });
    }
};
