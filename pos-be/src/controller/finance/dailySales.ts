import type { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma.js";
import { isPrismaError } from "../../utils/isPrismaError.js";

export const dailySalesReport = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { businessId } = req.params;
        const { date } = req.body;
        const today = new Date();

        // Cek bisnis ada atau tidak,kembalikan eror jika tidak ada
        await prisma.sale.findFirstOrThrow({
            where: {
                businessId: businessId as string
            }
        })

        // range waktu
        let start: Date;
        let end: Date;

        if (!date) {
            // Jika tanggal tidak dikirim → pakai hari ini
            start = new Date(today);
            start.setHours(0, 0, 0, 0);

            end = new Date(today);
            end.setHours(23, 59, 59, 999);
        } else {
            // Jika tanggal dikirim (format { startDate, endDate })
            start = new Date(date.startDate);
            end = new Date(date.endDate);

            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
        }

        // Dapatkan total penjualan
        const totalSales = await prisma.sale.aggregate({
            _sum: {
                totalAmount: true,
            },
            where: {
                businessId: businessId as string,
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
        });

        // Dapatkan daftar transaksi
        const salesList = await prisma.sale.findMany({
            where: {
                businessId: businessId as string,
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
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
                        product: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        return res.json({
            message: "Finance report generated successfully",
            totalSales: totalSales._sum.totalAmount ?? 0,
            count: salesList.length,
            data: salesList,
        });
    } catch (error) {
        if (isPrismaError(error)) {
            next(error)
            return
        }
        return res.status(500).json({
            message: "Error on server when creating finance report",
            errors: error,
        });
    }
};
