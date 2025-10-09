import { Businesses, Product, MovementType } from "@prisma/client";
import prisma from "../../src/utils/prisma.js";
import { faker } from "@faker-js/faker";

export async function stockMovementSeeder(businesses: Businesses[], products: Product[]) {
    const movementsData = [];
    const notes = ["PURCHASE", "SALE", "EXPIRED", "DAMAGED", "ADJUSTMENT"];

    for (const business of businesses) {
        const businessProducts = products.filter((p) => p.businessId === business.id);

        for (const product of businessProducts) {
            const movementCount = faker.number.int({ min: 3, max: 7 });

            for (let i = 0; i < movementCount; i++) {
                // Pilih note secara acak
                const note = faker.helpers.arrayElement(notes);

                // Tentukan type berdasarkan note
                const type =
                    note === "PURCHASE" || note === "ADJUSTMENT"
                        ? MovementType.IN
                        : MovementType.OUT;

                // Quantity positif sesuai type
                const quantity = faker.number.int({ min: 1, max: 20 });

                movementsData.push({
                    productId: product.id,
                    type,
                    quantity,
                    note,
                    businessId: business.id,
                });

                // Update stok produk sesuai movement
                const newStock =
                    type === MovementType.IN
                        ? product.stock + quantity
                        : Math.max(0, product.stock - quantity);

                await prisma.product.update({
                    where: { id: product.id },
                    data: { stock: newStock },
                });

                // Update juga di variabel produk biar stok berlanjut
                product.stock = newStock;
            }
        }
    }

    await prisma.stockMovement.createMany({ data: movementsData });
    console.log(`Seeded ${movementsData.length} stock movements.`);

    return prisma.stockMovement.findMany();
}
