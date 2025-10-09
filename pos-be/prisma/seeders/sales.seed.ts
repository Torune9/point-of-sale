import { Businesses, Product, MovementType } from "@prisma/client";
import prisma from "../../src/utils/prisma.js";
import { faker } from "@faker-js/faker";

export async function saleSeeder(business: Businesses, products: Product[]) {
    const salesPerBusiness = 5; 
    const salesData = [];
    const itemsData = [];
    const stockMovementsData = [];
    const stockUpdates: { id: string; newStock: number }[] = [];

    const businessProducts = products.filter(
        (p) => p.businessId === business.id
    );

    for (let i = 0; i < salesPerBusiness; i++) {
        const invoice = `INV-${faker.string.alphanumeric(6).toUpperCase()}`;
        const numItems = faker.number.int({ min: 2, max: 5 });
        const selectedProducts = faker.helpers.arrayElements(
            businessProducts,
            numItems
        );

        let totalAmount = 0;
        const saleId = faker.string.uuid();

        for (const product of selectedProducts) {
            const quantity = faker.number.int({ min: 1, max: 5 });
            const price = product.price;
            const subtotal = price * quantity;

            totalAmount += subtotal;

            itemsData.push({
                id: faker.string.uuid(),
                quantity,
                price,
                subtotal,
                saleId,
                productId: product.id,
                businessId: business.id,
            });

            stockMovementsData.push({
                id: faker.string.uuid(),
                productId: product.id,
                type: MovementType.OUT,
                quantity,
                note: 'SALE',
                saleId,
                businessId: business.id,
            });

            // Update stok produk (kurangi)
            const newStock = Math.max(product.stock - quantity, 0);
            product.stock = newStock;
            stockUpdates.push({ id: product.id, newStock });
        }

        const paidAmount = totalAmount;
        const changeAmount = 0;

        salesData.push({
            id: saleId,
            invoice,
            totalAmount,
            paidAmount,
            changeAmount,
            businessId: business.id,
        });
    }

    // Insert data utama
    await prisma.sale.createMany({ data: salesData });
    await prisma.item.createMany({ data: itemsData });
    await prisma.stockMovement.createMany({ data: stockMovementsData });

    // Update stok produk satu per satu
    for (const update of stockUpdates) {
        await prisma.product.update({
            where: { id: update.id },
            data: { stock: update.newStock },
        });
    }

    console.log(
        `Seeded ${salesData.length} sales for "${business.name}". Stock updated for ${stockUpdates.length} products.`
    );

    return prisma.sale.findMany({
        where: { businessId: business.id },
        include: { items: true, movements: true },
    });
}
