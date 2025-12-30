export interface Product {
    id : string
    name: string,
    category: Category,
    price: string,
    quantity : number,
    stock: number,
    barcode?: string
}
