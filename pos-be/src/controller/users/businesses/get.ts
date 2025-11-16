import type { Request, Response } from "express";
import prisma from "../../../utils/prisma.js";

export const getBusiness = async (req: Request, res: Response) => {
    try {
        const { businessId } = req.params
        const business = await prisma.businesses.findFirst({
            where: {
                id: businessId as string
            }
        })

        return res.status(201).json({
            message: "profile business has been retrieved",
            code: res.statusCode,
            data: business
        })
    } catch (error) {
        return res.status(500).json({
            message: "error on server when get business data",
            code: res.statusCode,
            errors: error
        })
    }
}
