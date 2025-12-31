import type { NextFunction, Request, Response } from "express";
import prisma from "../../utils/prisma.js";
import { isPrismaError } from "../../utils/isPrismaError.js";

export const getSales = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { businessId } = req.params;
        const { startDate, endDate } = req.query;

        const sales = await prisma.sale.findMany({
            where: {
                businessId: businessId as string,
                ...(startDate && endDate && {
                    createdAt: {
                        gte: new Date(startDate as string),
                        lte: new Date(endDate as string),
                    }
                })
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.json({
            message: "sales has been retrieved",
            code: res.statusCode,
            data: sales
        });
    } catch (error) {
        if (isPrismaError(error)) return next(error);

        res.status(500).json({
            message: "Server error when get sales data",
            errors: error,
        });
    }
};

export const getAnnualSales = async (req: Request, res: Response) => {
    const { businessId } = req.params

    try {
        const result = await prisma.$queryRaw<
            { month: Date; total: number }[]
        >`
        WITH months AS (
        SELECT generate_series(
            date_trunc('year', now()),
            date_trunc('year', now()) + interval '11 month',
            interval '1 month'
        ) AS month
        )
        SELECT
        m.month,
        COALESCE(SUM(s."totalAmount"), 0) AS total
        FROM months m
        LEFT JOIN sales s
        ON date_trunc('month', s."createdAt") = m.month
        AND s."businessId" = ${businessId}
        GROUP BY m.month
        ORDER BY m.month;
    `

        return res.json({
            message: 'data has been retrieved',
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            message: 'error on server when getting data sales',
            error
        })
    }
}
