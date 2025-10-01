import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { logger } from "./logger.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);

  // Prisma error handling
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Error dengan kode khusus
    switch (err.code) {
      case "P2002": // Unique constraint failed
        return res.status(409).json({
          error: "Duplicate entry",
          meta: err.meta
        });
      case "P2025": // Record not found
        return res.status(404).json({
          error: "Record not found",
          meta: err.meta
        });
      default:
        return res.status(400).json({
          error: "Prisma request error",
          code: err.code,
          meta: err.meta
        });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      error: "Validation error in Prisma query",
      message: err.message
    });
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return res.status(500).json({
      error: "Database initialization error",
      message: err.message
    });
  }

  if (err instanceof Prisma.PrismaClientRustPanicError) {
    return res.status(500).json({
      error: "Database engine panic",
      message: err.message
    });
  }

  // Default (non-prisma errors)
  return res.status(500).json({
    error: "Internal server error",
    message: err.message || "Something went wrong",
  });
};
