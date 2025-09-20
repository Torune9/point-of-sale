import type { Request, Response } from "express";

import prisma from "../../../utils/prisma.js";

import bcrypt from 'bcrypt'
import { Prisma } from "@prisma/client";

export const createWorkers = async (req: Request, res: Response) => {
    try {
        const { username, email, password, roleId, businessId } = req.body;

        const existing = await prisma.workers.findUnique({
            where: { email },
        });

        if (existing) {
            return res.status(409).json({
                message: "email already taken, please change it",
            });
        }

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
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return res.status(500).json({
                code: res.statusCode,
                errors: error,
            });
        }

        return res.status(500).json({
            message: "error on server when create workers",
            code: res.statusCode,
            errors: error,
        });
    }
};
