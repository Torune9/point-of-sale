export interface Category {
    name: string,
    id: string,
    businessId: string,
}

export interface Product {
    name: string,
    category: Category,
    price: string,
    stock: number,
    barcode?: string
}

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
