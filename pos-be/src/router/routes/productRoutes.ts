import e from "express"
import { validateData } from "../../middleware/validationMiddleware.js"
import { Product, ProductUpdate } from "../../schemas/productSchema.js"
import { createProduct } from "../../controller/inventories/products/create.js"
import { getProducts } from "../../controller/inventories/products/get.js"
import { updateProduct } from "../../controller/inventories/products/update.js"
import { deleteProduct } from "../../controller/inventories/products/delete.js"

export const productRouter  = e.Router()

productRouter.post('/',validateData(Product),createProduct)

productRouter.get('/',getProducts)

productRouter.patch('/:id',validateData(ProductUpdate),updateProduct)

productRouter.delete('/:id',deleteProduct)
