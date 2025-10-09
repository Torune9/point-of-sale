import { Businesses, Worker, MovementType, Sale } from "@prisma/client";
import prisma from "../../src/utils/prisma.js";
import { faker } from "@faker-js/faker";

export async function cashflowSeeder(
    businesses: Businesses[],
    workers: Worker[],
    sales: Sale[]
) {
    const cashflowsData = [];

    for (const business of businesses) {
        const businessWorkers = workers.filter((w) => w.businessId === business.id);
        const anyWorker =
            businessWorkers.length > 0
                ? faker.helpers.arrayElement(businessWorkers)
                : null;

        // Cashflow dari hasil penjualan
        const businessSales = sales.filter((s) => s.businessId === business.id);
        for (const sale of businessSales) {
            cashflowsData.push({
                id: faker.string.uuid(),
                type: MovementType.IN,
                amount: sale.paidAmount,
                note: `Sale payment: ${sale.invoice}`,
                saleId: sale.id,
                businessId: business.id,
                workerId: anyWorker?.id ?? null,
            });
        }

        // Pengeluaran operasional (OUT)
        const expenseTypes = [
            "Buy goods from supplier",
            "Pay store rent",
            "Pay electricity bill",
            "Employee salary",
            "Buy packaging material",
        ];

        for (let i = 0; i < 5; i++) {
            cashflowsData.push({
                id: faker.string.uuid(),
                type: MovementType.OUT,
                amount: faker.number.float({ min: 50000, max: 500000 }),
                note: expenseTypes[i],
                businessId: business.id,
                workerId: anyWorker?.id ?? null,
            });
        }

        // Pemasukan lain (IN)
        const incomeTypes = ["Owner deposit", "Supplier refund", "Extra sales income"];

        for (let i = 0; i < 3; i++) {
            cashflowsData.push({
                id: faker.string.uuid(),
                type: MovementType.IN,
                amount: faker.number.float({ min: 100000, max: 1000000 }),
                note: incomeTypes[i],
                businessId: business.id,
                workerId: anyWorker?.id ?? null,
            });
        }
    }

    await prisma.cashflow.createMany({ data: cashflowsData });

    console.log(`Seeded ${cashflowsData.length} cashflows.`);

    return prisma.cashflow.findMany();
}
