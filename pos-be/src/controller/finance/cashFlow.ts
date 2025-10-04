import type { Request,Response } from "express";
import prisma from "../../utils/prisma.js";

export const cashFlow = async (req: Request, res: Response) => {
    try {
        const { type, amount, businessId, workerId,note } = req.body
        const cash = await prisma.cashflow.create({
            data : {
                type,
                amount,
                businessId,
                workerId : workerId || null,
                note
            }
        })

        return res.status(201).json({
            message : 'cash flow has been created',
            code: res.statusCode,
            data : cash
        })
    } catch (error) {
        return res.status(500).json({
            message : 'error  on server when recap cashflow',
            code : res.statusCode,
            errors: error
        })
    }
}
