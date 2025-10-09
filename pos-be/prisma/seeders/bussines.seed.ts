import { Businesses, User } from '@prisma/client'
import prisma from '../../src/utils/prisma.js'

export async function businessSeeder(owners: User[]): Promise<Businesses[]> {
    await Promise.all(
        owners.map(async (owner) => {
            await prisma.businesses.upsert({
                where: { ownerId: owner.id },
                update: {},
                create: {
                    name: `${owner.username}'s First Business`,
                    ownerId: owner.id,
                },
            })
        })
    )

    return prisma.businesses.findMany()
}
