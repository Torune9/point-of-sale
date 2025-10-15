import type { Request, Response, NextFunction } from "express";
import prisma from "../../utils/prisma.js";
import { isPrismaError } from "../../utils/isPrismaError.js";

export const dailySalesReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { businessId } = req.params;
        const { date } = req.body;

        // Pastikan bisnis ada
       await prisma.sale.findFirstOrThrow({ where: { businessId: businessId as string } });

        // Tentukan rentang waktu
        const now = new Date();
        const start = new Date(date?.startDate || now);
        const end = new Date(date?.endDate || now);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        // Ambil total dan daftar penjualan
        const [totalSales, salesList] = await Promise.all([
            prisma.sale.aggregate({
                _sum: { totalAmount: true },
                where: { businessId: businessId as string, createdAt: { gte: start, lte: end } },
            }),
            prisma.sale.findMany({
                where: { businessId: businessId as string, createdAt: { gte: start, lte: end } },
                orderBy: { createdAt: "desc" },
                select: {
                    invoice: true,
                    paidAmount: true,
                    totalAmount: true,
                    changeAmount: true,
                    createdAt: true,
                    items: {
                        select: {
                            price: true,
                            quantity: true,
                            subtotal: true,
                            product: { select: { name: true } },
                        },
                    },
                },
            }),
        ]);

        res.json({
            message: "Finance report generated successfully",
            totalSales: totalSales._sum.totalAmount ?? 0,
            count: salesList.length,
            data: salesList,
        });
    } catch (error) {
        if (isPrismaError(error)) return next(error);
        res.status(500).json({
            message: "Server error while generating finance report",
            errors: error,
        });
    }
};
