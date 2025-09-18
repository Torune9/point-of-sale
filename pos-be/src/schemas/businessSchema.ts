import * as z from "zod"

export const Business = z.object({
    name : z.string().min(4),
    ownerId : z.uuid()
})
