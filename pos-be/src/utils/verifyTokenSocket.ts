import jwt from "jsonwebtoken"

export const verifyToken = (token: string) => { 
    return jwt.verify(token, process.env.PRIVATE_KEY!) as {
        id: string
        roleId: string,
        businessId : string
    }
}
