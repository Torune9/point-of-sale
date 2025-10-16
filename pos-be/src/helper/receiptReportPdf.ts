import PDFDocument from "pdfkit";
import type { Response } from "express";
import { rupiahFormatter } from "../utils/rupiahFormatter.js";

export interface SaleWithRelations {
    id: string;
    invoice: string;
    totalAmount: number;
    paidAmount: number;
    changeAmount: number;
    createdAt: Date;
    business: {
        name: string;
        address?: string | null;
    };
    items: Array<{
        quantity: number;
        price: number;
        subtotal: number;
        product: {
            name: string;
        };
    }>;
}


export async function generateReceiptPDF(sale: SaleWithRelations, res: Response) {
    const doc = new PDFDocument({ margin: 20, size: [300, 600] });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=${sale.invoice}.pdf`);
    doc.pipe(res);

    doc.fontSize(14).text(sale.business.name, { align: "center" });
    doc.fontSize(9).text(sale.business.address || "-", { align: "center" });
    doc.moveDown(1);

    doc.table({
        defaultStyle: {
            border: false
        },
        data: [
            [
                {
                    text: `Invoice : ${sale.invoice}`
                }
            ], [
                {
                    text: `Tanggal : ${new Date(sale.createdAt).toLocaleString("id-ID")}`
                }
            ]
        ]
    })
    doc.text("--------------------------------");

    const items = sale.items.map((val: any) => [
        val.product.name,
        val.quantity.toString(),
        val.subtotal.toString()
    ])

    doc.table({
        defaultStyle: {
            border: false
        },
        data: [
            ...items
        ]
    })

    doc.text("--------------------------------");
    doc.table({
        defaultStyle: {
            border: false
        },
        data: [
            [
                {
                    text: `Total : ${rupiahFormatter(sale.totalAmount)}`
                }
            ],
            [
                {
                    text: `Total Bayar : ${rupiahFormatter(sale.paidAmount)}`
                }
            ],
            [
                {
                    text: `Total Kembalian : ${rupiahFormatter(sale.changeAmount)}`
                }
            ],
        ]
    })
    doc.moveDown(1);
    doc.text("Terima kasih atas kunjungan Anda!", { align: "center" });
    doc.end();
}
