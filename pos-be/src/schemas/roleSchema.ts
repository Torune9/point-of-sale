import * as z from "zod"

export const Role = z.object({
    name : z.string().min(3)
})
