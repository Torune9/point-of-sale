import e from "express"
import { stockMovement } from "../../controller/inventories/stock-movements/stockReceive.js"
import { validateData } from "../../middleware/validationMiddleware.js"
import { CreateSaleSchema, ProductMovement } from "../../schemas/stockMovementSchema.js"
import { stockOutSelling } from "../../controller/inventories/stock-movements/stockOut.js"
import { getStockMovements } from "../../controller/inventories/stock-movements/getStockMovements.js"
import { adminAuth } from "../../middleware/adminAuthorization.js"
import { cashierAuth } from "../../middleware/cashierAuth.js"

export const stockMomeventRouter = e.Router()

stockMomeventRouter.get('/:businessId', getStockMovements)

stockMomeventRouter.post('/', validateData(ProductMovement),adminAuth, stockMovement)

stockMomeventRouter.post('/selling', validateData(CreateSaleSchema),cashierAuth, stockOutSelling)
