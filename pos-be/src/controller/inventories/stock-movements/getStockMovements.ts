import type { Request, Response } from "express";
import prisma from "../../../utils/prisma.js";

export const getStockMovements = async (req: Request, res: Response) => {
    try {
        const { businessId } = req.params
        const stockMovements = await prisma.stockMovement.findMany({
            where: {
                businessId: businessId as string
            },
            include : {
                product : {
                    select : {
                        name : true,
                        id : true
                    }
                }
            },
            orderBy : {
                createdAt : 'desc'
            }
        })
        return res.json({
            message: "stock movement has been retrieved",
            data: stockMovements,
            code: res.statusCode
        })
    } catch (error) {
        return res.status(500).json({
            message: 'error on server when get stock movements',
            error,
            code: res.statusCode
        })
    }
}
