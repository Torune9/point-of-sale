import e from "express"
import { stockMovement } from "../../controller/inventories/stock-movements/stockReceive.js"
import { validateData } from "../../middleware/validationMiddleware.js"
import { CreateSaleSchema, ProductMovement } from "../../schemas/stockMovementSchema.js"
import { stockOutSelling } from "../../controller/inventories/stock-movements/stockOut.js"

export const stockMomeventRouter = e.Router()

stockMomeventRouter.post('/',validateData(ProductMovement),stockMovement)
stockMomeventRouter.post('/selling',validateData(CreateSaleSchema),stockOutSelling)
