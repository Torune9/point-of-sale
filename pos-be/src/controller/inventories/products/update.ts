import type { NextFunction, Request, Response } from "express";
import prisma from "../../../utils/prisma.js";
import { isPrismaError } from "../../../utils/isPrismaError.js";

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, price, stock, businessId } = req.body;

        const existingProduct = await prisma.product.findFirst({
            where: {
                id: id as string,
                businessId: businessId as string,
            },
        });

        if (!existingProduct) {
            return res.status(404).json({
                message: "Product not found",
                code: res.statusCode,
            });
        }

        const updatedProduct = await prisma.product.update({
            where: { id: id as string },
            data: {
                name: name ?? existingProduct.name,
                stock:
                    stock !== undefined
                        ? parseInt(stock)
                        : existingProduct.stock,
                price:
                    price !== undefined
                        ? parseFloat(price)
                        : existingProduct.price,
            },
        });

        return res.json({
            message: "Product has been updated",
            data: updatedProduct,
        });
    } catch (error) {
        if (isPrismaError(error)) {
            next(error);
            return;
        }
        return res.status(500).json({
            message: "Error on server when updating product",
            code: res.statusCode,
            errors: error,
        });
    }
};
