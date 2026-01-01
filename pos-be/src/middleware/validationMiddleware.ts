import type { Request, Response, NextFunction } from "express"
import { z, ZodError } from "zod"

export const validateData =
    (schema: z.ZodSchema) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                const parsedData = schema.parse(req.body)
                req.body = parsedData
                next()
            } catch (error) {
                if (error instanceof ZodError) {
                    return res.status(400).json({
                        message: "Validation error",
                        errors: error.issues.map(issue => ({
                            field: issue.path.join("."),
                            message: issue.message
                        }))
                    })
                }

                return res.status(500).json({ message: "Internal Server Error" })
            }
        }
