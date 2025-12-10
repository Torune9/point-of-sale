import { Category } from "../category"
import { Product } from "../product"

export interface ProductUpload {
    name: string,
    categoryId: string,
    price: number,
    stock: number,
    businessId: string
}

export type UpdateProduct = {
    name: string,
    price: number,
    stock: number,
    categoryId: string
}
export type UpdateItems = Product & Category 
