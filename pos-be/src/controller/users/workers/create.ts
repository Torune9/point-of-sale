import type { NextFunction, Request, Response } from "express";

import prisma from "../../../utils/prisma.js";

import bcrypt from 'bcrypt'
import { isPrismaError } from "../../../utils/isPrismaError.js";

export const createWorkers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password, roleId, businessId } = req.body;

        const hashPassword = await bcrypt.hash(password, 10);

        const worker = await prisma.workers.create({
            data: {
                username,
                email,
                password: hashPassword,
                roleId,
                businessId,
            },
        });

        return res.status(201).json({
            message: "worker has been created",
            code: res.statusCode,
            data: worker,
        });
    } catch (error) {
        if (isPrismaError(error)) {
            next(error)
            return
        }

        return res.status(500).json({
            message: "error on server when create workers",
            code: res.statusCode,
            errors: error,
        });
    }
};
