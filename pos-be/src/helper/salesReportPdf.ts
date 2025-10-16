import PDFDocument from "pdfkit";
import type { Response } from "express";

interface SalesReportOptions {
    businessName: string;
    start: Date;
    end: Date;
    salesList: {
        createdAt: Date;
        totalAmount: number;
        paidAmount: number;
        changeAmount: number;
    }[];
    totalSalesCount: number;
    totalCash: number;
    res: Response;
}

export async function generateSalesReportPDF({
    businessName,
    start,
    end,
    salesList,
    totalSalesCount,
    totalCash,
    res,
}: SalesReportOptions) {
    const headers = ["Date", "Total Amount", "Paid Amount", "Change Amount"];

    const formatRupiah = (num: number) => num.toLocaleString("id-ID");

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=sales-report.pdf");
    doc.pipe(res);

    doc.fontSize(18).text("Sales Report", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Business: ${businessName}`);
    doc.text(`Period: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`);
    doc.moveDown();

    const dataTable = salesList.map((val) => [
        new Date(val.createdAt).toLocaleDateString(),
        formatRupiah(val.totalAmount),
        formatRupiah(val.paidAmount),
        formatRupiah(val.changeAmount),
    ]);

    doc.table({
        rowStyles: (i) => ({
            backgroundColor: i % 2 == 0 ? "#eee" : "#fff",
            padding: 8,
        }),
        data: [
            [...headers],
            ...dataTable,
            [
                { colSpan: 1 },
                {
                    colSpan: 3,
                    text: `Total sales : ${totalSalesCount}\n\nTotal cash : Rp ${formatRupiah(totalCash)}`,
                },
            ],
        ],
    });

    doc.end();
}
