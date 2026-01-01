import type { NextFunction, Request, Response } from "express";
import prisma from "../../../utils/prisma.js";
import { logger } from "../../../utils/logger.js";
import { isPrismaError } from "../../../utils/isPrismaError.js";

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, businessId } = req.body
        if (!name) {
            return res.status(404).json({
                message : 'invalid name',
                code : res.statusCode
            })
        }

        let category = await prisma.category.findFirst({
            where: {
                AND : {
                    name: {
                        equals: name,
                        mode: "insensitive",
                    },
                    businessId
                }
            },
        })

        if (category) {
            return res.status(409).json({
                message: 'category already exist',
                code: res.statusCode
            })
        }
        category = await prisma.category.create({
            data: { name : name.toLowerCase(), businessId },
        })
        return res.json({
            message: 'category has been created',
            code: res.statusCode,
            data: category
        })
    } catch (error) {
        if (isPrismaError(error)) {
            next(error)
            return
        }

        return res.status(500).json({
            message: 'error on server when create category',
            code: res.statusCode,
            errors: error,
        })
    }
}
