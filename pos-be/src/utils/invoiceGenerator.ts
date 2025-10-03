import prisma from "./prisma.js";

export const generateInvoice = async (businessId : string) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const countToday = await prisma.sale.count({
            where: {
                businessId : businessId,
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });

        // Generate nomor invoice
        const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const sequence = String(countToday + 1).padStart(4, "0");
        const invoice = `INV-${datePart}-${sequence}`;
        return invoice
    } catch (error) {
        throw error
    }
}
