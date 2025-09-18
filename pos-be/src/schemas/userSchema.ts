import * as z from "zod"

export const User = z.object({
    username : z.string(),
    email : z.email(),
    password : z.string().min(8)
})
