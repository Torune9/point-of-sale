import prisma from "../utils/prisma.js";

export const generateSKU = async (categoryId: string, productName: string) => {
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
    });

    if (!category) throw new Error("Category not found");

    const prefix = category.name.trim().substring(0, 3).toUpperCase();

    const productCode = productName.trim().substring(0, 3).toUpperCase();

    const count = await prisma.product.count({
        where: { categoryId },
    });

    const sku = `${prefix}-${productCode}-${String(count + 1).padStart(4, "0")}`;

    return sku;
};
