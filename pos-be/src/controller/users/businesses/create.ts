import type { NextFunction, Request, Response } from "express";
import prisma from "../../../utils/prisma.js";
import { isPrismaError } from "../../../utils/isPrismaError.js";

export const createBusiness = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, userId } = req.body
        const isBusinessExist = await prisma.businesses.findFirst({
            where : {
                AND : {
                    ownerId : userId,
                }
            }
        })

        if (isBusinessExist) {
            return res.status(409).json({
                message : "you have created a business",
                code : res.statusCode
            })
        }
        
        const business = await prisma.businesses.create({
            data: {
                name,
                ownerId : userId
            }
        })

        return res.status(201).json({
            message : "business has been created",
            code : res.statusCode,
            data : business
        })
    } catch (error) {
        if (isPrismaError(error)) {
            next(error)
        }

        return res.status(500).json({
            message : "error on server when create business",
            code : res.statusCode,
            errors : error
        })
    }
}
