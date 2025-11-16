import type { NextFunction, Request, Response } from "express";
import prisma from "../../../utils/prisma.js";
import { isPrismaError } from "../../../utils/isPrismaError.js";

export const updateBusiness = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const { businessId } = req.params;

        const business = await prisma.businesses.update({
            where: {
                id: businessId as string
            },
            data: {
                name: name?.trim() === "" || name === undefined ? undefined : name
            }
        });

        return res.json({
            message: "business has been updated",
            code: res.statusCode,
            data: business
        });
    } catch (error) {
        if (isPrismaError(error)) {
            next(error);
        }

        return res.status(500).json({
            message: "error on server when updating business",
            code: res.statusCode,
            errors: error
        });
    }
};
