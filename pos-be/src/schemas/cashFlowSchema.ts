import z from "zod"

export const cashData = z.object({
    type : z.enum(['IN','OUT']),
    amount : z.number().positive(),
    businessId : z.string(),
    workerId : z.string().optional(),
    note : z.string().optional()
})
