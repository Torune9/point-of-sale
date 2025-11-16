// helper/roleCheck.ts
import { verifyToken } from "../utils/jwt.js"
import prisma from "../utils/prisma.js"
import type { JwtPayload } from "jsonwebtoken"

export const roleCheck = async (token: string, roleName: string) => {
    const dataVerified = verifyToken(token) as JwtPayload

    const role = await prisma.role.findFirst({
        where: { id: dataVerified.roleId }
    })

    if (!role) {
        return { ok: false, code: 404, message: "role not found" }
    }

    const isVerifiedRole = role.name.toLowerCase() === roleName.toLowerCase()

    if (!isVerifiedRole) {
        return { ok: false, code: 403, message: "not authorized" }
    }

    return { ok: true }
}
