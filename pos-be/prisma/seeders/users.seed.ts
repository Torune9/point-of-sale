import { Role, User } from '@prisma/client'
import prisma from '../../src/utils/prisma.js'
import bcrypt from 'bcrypt'
import { logger } from '../../src/utils/logger.js'
export async function userSeeder(roleList: Role[]) : Promise<User[]> {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash('12345678', saltRounds)

    const adminRole = roleList.find((r) => r.name === "admin");
    const ownerRole = roleList.find((r) => r.name === "owner");

    if (!adminRole || !ownerRole) throw new Error("Roles not found!");

    await prisma.user.createMany({
        data: [
            {
                email: 'admin@mail.com',
                username: 'admin',
                password: hashedPassword,
                roleId: adminRole.id,
            },
            {
                email: 'josh@mail.com',
                username: 'josh',
                password: hashedPassword,
                roleId: ownerRole.id,
            },
            {
                email: 'jhon@mail.com',
                username: 'jhon',
                password: hashedPassword,
                roleId: ownerRole.id,
            },
            {
                email: 'julie@mail.com',
                username: 'julie',
                password: hashedPassword,
                roleId: ownerRole.id,
            },
            {
                email: 'sean@mail.com',
                username: 'sean',
                password: hashedPassword,
                roleId: ownerRole.id,
            },
        ]
    })
    logger.info('users seed successfully running')

    return prisma.user.findMany({
        where: {
            roleId: ownerRole.id
        }
    })
}
