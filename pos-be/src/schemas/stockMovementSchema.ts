import z, { string } from "zod";

export const ProductMovement = z.object({
  quantity: z.number(),
  type: z.enum(['IN', 'OUT']),
  productId: z.string(),
  note: z.enum(['PURCHASE', 'SALE', 'EXPIRED', 'DAMAGED', 'ADJUSTMENT'])
})

export const SaleItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1),
  price: z.number().positive(),
  subtotal: z.number().positive(),
});

export const CreateSaleSchema = z.object({
  businessId: z.string(),
  items: z.array(SaleItemSchema).min(1),
  totalAmount: z.number().positive(),
  paidAmount : z.number().positive(),
});


export type SaleItem = {
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
};
