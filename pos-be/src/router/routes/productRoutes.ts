import e from "express"
import { validateData } from "../../middleware/validationMiddleware.js"
import { Product, ProductUpdate } from "../../schemas/productSchema.js"
import { createProduct } from "../../controller/inventories/products/create.js"
import { getProductById, getProducts } from "../../controller/inventories/products/get.js"
import { updateProduct } from "../../controller/inventories/products/update.js"
import { deleteProduct } from "../../controller/inventories/products/delete.js"
import { barcodeGenerate } from "../../controller/inventories/products/barcode.js"
import { adminAuth } from "../../middleware/adminAuthorization.js"

export const productRouter = e.Router()

productRouter.get('/', getProducts)

productRouter.post('/', validateData(Product), adminAuth, createProduct)

productRouter.get('/:id', getProductById)

productRouter.patch('/:id', validateData(ProductUpdate), updateProduct)

productRouter.delete('/:id', adminAuth, deleteProduct)

productRouter.post('/qrcode/:id', adminAuth, barcodeGenerate)
