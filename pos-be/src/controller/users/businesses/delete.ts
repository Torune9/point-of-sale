import type { NextFunction, Request, Response } from "express";
import prisma from "../../../utils/prisma.js";
import { isPrismaError } from "../../../utils/isPrismaError.js";

export const deleteBusiness = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { businessId } = req.params;

        const business = await prisma.businesses.delete({
            where: {
                id: businessId as string
            },
        });

        return res.json({
            message: "business has been deleted",
            code: res.statusCode,
            data: business
        });
    } catch (error) {
        if (isPrismaError(error)) {
            next(error);
        }

        return res.status(500).json({
            message: "error on server when deleting business",
            code: res.statusCode,
            errors: error
        });
    }
};
