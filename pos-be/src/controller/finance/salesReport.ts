import type { Request, Response, NextFunction } from "express";
import prisma from "../../utils/prisma.js";
import { isPrismaError } from "../../utils/isPrismaError.js";
import { generateSalesReportPDF } from "../../helper/salesReportPdf.js";

export const salesReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { businessId } = req.params;
        const { date } = req.body;

        const sale = await prisma.sale.findFirstOrThrow({
            where: { businessId: businessId as string },
            include: {
                business: { select: { name: true } },
            },
        });

        const now = new Date();
        const start = new Date(date?.startDate || now);
        const end = new Date(date?.endDate || now);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        const [amountSales, salesList, totalSales] = await Promise.all([
            prisma.sale.aggregate({
                _sum: { totalAmount: true },
                where: { businessId: businessId as string, createdAt: { gte: start, lte: end } },
            }),
            prisma.sale.findMany({
                where: { businessId: businessId as string, createdAt: { gte: start, lte: end } },
                orderBy: { createdAt: "asc" },
                select: {
                    invoice: true,
                    paidAmount: true,
                    totalAmount: true,
                    changeAmount: true,
                    createdAt: true,
                },
            }),
            prisma.sale.aggregate({
                where: { businessId: businessId as string, createdAt: { gte: start, lte: end } },
                _count: { businessId: true },
            }),
        ]);

        await generateSalesReportPDF({
            businessName: sale.business.name,
            start,
            end,
            salesList,
            totalSalesCount: totalSales._count.businessId,
            totalCash: amountSales._sum.totalAmount ?? 0,
            res,
        });
    } catch (error) {
        if (isPrismaError(error)) return next(error);

        res.status(500).json({
            message: "Server error generating sales PDF",
            errors: error,
        });
    }
};
