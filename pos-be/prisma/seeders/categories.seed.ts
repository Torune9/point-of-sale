import { Category, Businesses } from '@prisma/client'
import prisma from '../../src/utils/prisma.js'

export async function categorySeeder(businesses: Businesses[]): Promise<Category[]> {
    const categoriesData = [
        'Food',
        'Drink',
        'Office stationery',
        'Electronic',
        'Health',
    ]

    const createdCategories = []

    for (const business of businesses) {
        const businessCategories = categoriesData.map((name) => ({
            name,
            businessId: business.id,
        }))

        await prisma.category.createMany({
            data: businessCategories,
            skipDuplicates: true,
        })

        const categories = await prisma.category.findMany({
            where: { businessId: business.id }
        })

        createdCategories.push(...categories)
    }

    return createdCategories
}
