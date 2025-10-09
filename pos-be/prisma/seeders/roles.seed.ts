import { Role } from '@prisma/client'
import prisma from '../../src/utils/prisma.js'

export async function roleSeeder(): Promise<Role[]> {
    await prisma.role.createMany({
        data: [
            { name: 'admin' },
            { name: 'cashier' },
            { name: 'manager' },
            { name: 'warehouse' },
            { name: 'owner' },
        ],
        skipDuplicates: true,
    })

    return prisma.role.findMany();
}
