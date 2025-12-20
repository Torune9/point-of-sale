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

