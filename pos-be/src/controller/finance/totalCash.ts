import type { Request, Response } from "express";
import prisma from "../../utils/prisma.js";

export const totalCash = async (req: Request, res: Response) => {
    try {
        const { businessId } = req.params

        const [totalCash, totalOutCash] = await Promise.all([
            prisma.cashflow.aggregate({
                where: {
                    businessId: businessId as string,
                    type: "IN"
                },
                _sum: {
                    amount: true
                }
            }),
            prisma.cashflow.aggregate({
                where: {
                    businessId: businessId as string,
                    type: "OUT",
                },
                _sum: {
                    amount: true,
                },
            })

        ])

        const totalInValue = totalCash._sum.amount || 0;
        const totalOutValue = totalOutCash._sum.amount || 0;

        return res.json({
            totalIn: totalInValue,
            totalOut: totalOutValue,
            balance: totalInValue - totalOutValue,
        });
    } catch (error) {
        return res.status(500).json(
            {
                message: "Internal server error",
                error
            }
        );
    }
}
