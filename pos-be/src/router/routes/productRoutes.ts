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

productRouter.get('/:businessId', getProducts)

productRouter.post('/', validateData(Product), adminAuth, createProduct)

productRouter.get('/:businessId/:id', getProductById)

productRouter.patch('/:businessId/:id', validateData(ProductUpdate), updateProduct)

productRouter.delete('/:businessId/:id', adminAuth, deleteProduct)

productRouter.post('/qrcode/:businessId/:id', adminAuth, barcodeGenerate)
