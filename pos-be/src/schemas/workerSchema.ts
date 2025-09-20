import z from "zod";

export const Worker = z.object({
    username: z.string().min(4),
    email: z.email(),
    password : z.string().min(8),
    roleId : z.string().optional(),
    businessId : z.string()
})
