import z from "zod";

export const Product = z.object({
    name : z.string().min(4),
    price : z.coerce.number().positive(),
    stock : z.coerce.number().positive(),
    categoryId : z.string(),
    businessId : z.string()
})


export const ProductUpdate = Product.partial()
