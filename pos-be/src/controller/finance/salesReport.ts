import type { Request, Response, NextFunction } from "express";
import prisma from "../../utils/prisma.js";
import PDFDocument from "pdfkit";
import { isPrismaError } from "../../utils/isPrismaError.js";

export const salesReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { businessId } = req.params;
        const { date } = req.body;

        const sale = await prisma.sale.findFirstOrThrow({
            where: { businessId: businessId as string },
            include: {
                business: {
                    select: {
                        name: true,
                    }
                }
            }
        });

        const now = new Date();
        const start = new Date(date?.startDate || now);
        const end = new Date(date?.endDate || now);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        // Ambil data penjualan
        const [amountSales, salesList,totalSales] = await Promise.all([
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
                },
            }),
            prisma.sale.aggregate({
                where: { businessId: businessId as string, createdAt: { gte: start, lte: end } },
                _count : {
                    businessId : true
                }

            })
        ]);

        // Buat PDF
        const headers = ['Date', 'Total Amount', 'Paid Amount', 'Change Amount']

        const formatRupiah = (num: number) => {
            return num.toLocaleString('id-ID')
        }

        const doc = new PDFDocument({ margin: 40 });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=daily-sales-report.pdf");
        doc.pipe(res);

        // Header
        doc.fontSize(18).text("Sales Report", { align: "center" });
        doc.moveDown(0.5);
        doc.fontSize(12).text(`Business: ${sale.business.name}`);
        doc.text(`Period: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`);
        doc.moveDown();

        const dataTable = salesList.map(val => [
            new Date(val.createdAt).toLocaleDateString(),
            formatRupiah(val.totalAmount),
            formatRupiah(val.paidAmount),
            formatRupiah(val.changeAmount),
        ])

        doc.table({
            rowStyles: (i) => ({
                backgroundColor: i % 2 == 0 ? "#eee" : "#fff",
                padding: 8
            }),
            data: [
                [...headers],
                ...dataTable,
                [{
                    colSpan: 1,
                }, {
                    colSpan: 3,
                    text: `Total sales : ${totalSales._count.businessId}\n\nTotal cash : Rp ${amountSales._sum.totalAmount?.toLocaleString("id-ID")}`
                }]

            ]
        })

        doc.end();
    } catch (error) {
        if (isPrismaError(error)) return next(error);
        console.error(error);
        res.status(500).json({
            message: "Server error generating finance PDF",
            errors: error,
        });
    }
};
