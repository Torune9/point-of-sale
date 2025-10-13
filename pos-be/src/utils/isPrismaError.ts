import { Prisma } from "@prisma/client";
import { logger } from "./logger.js";

export function isPrismaError(error: unknown): boolean {
  logger.error(error)
  return (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError
  );
}
