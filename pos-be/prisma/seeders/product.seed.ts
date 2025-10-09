import { Businesses, Category, Product } from "@prisma/client";
import prisma from "../../src/utils/prisma.js";

export async function productSeeder(categories: Category[], businesses: Businesses[]): Promise<Product[]> {
    const getCategoryId = (name: string) => {
        return categories.find((c) => c.name === name)?.id || null;
    };

    // Template produk default (10 item)
    const productTemplates = [
        { name: "Instant Noodles", sku: "FOOD-001", price: 2500, stock: 100, category: "Food" },
        { name: "Biscuits", sku: "FOOD-002", price: 5000, stock: 50, category: "Food" },
        { name: "Mineral Water 600ml", sku: "DRINK-001", price: 3000, stock: 200, category: "Drink" },
        { name: "Cola Can 250ml", sku: "DRINK-002", price: 7000, stock: 80, category: "Drink" },
        { name: "Ballpoint Pen", sku: "OFFICE-001", price: 4000, stock: 120, category: "Office stationery" },
        { name: "Notebook A5", sku: "OFFICE-002", price: 10000, stock: 60, category: "Office stationery" },
        { name: "USB Cable", sku: "ELEC-001", price: 15000, stock: 40, category: "Electronic" },
        { name: "LED Bulb 10W", sku: "ELEC-002", price: 20000, stock: 70, category: "Electronic" },
        { name: "Vitamin C 500mg", sku: "HEALTH-001", price: 25000, stock: 90, category: "Health" },
        { name: "Pain Relief Ointment", sku: "HEALTH-002", price: 18000, stock: 40, category: "Health" },
    ];

    // Buat produk untuk setiap bisnis
    for (const business of businesses) {
        const productsData = productTemplates.map((p) => ({
            name: p.name,
            sku: `${p.sku}-${business.id.slice(0, 4)}`,
            price: p.price,
            stock: p.stock,
            categoryId: getCategoryId(p.category),
            businessId: business.id,
        }));

        await prisma.product.createMany({
            data: productsData,
        });
    }

    return prisma.product.findMany()
}
