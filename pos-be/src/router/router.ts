import { Router } from "express"
import { authRouter } from "./routes/authRoutes.js"
import { roleRouter } from "./routes/roleRoutes.js"
import { workerRouter } from "./routes/workerRoutes.js"
import { categoryRouter } from "./routes/categoryRoutes.js"
import { productRouter } from "./routes/productRoutes.js"
import { stockMomeventRouter } from "./routes/stockMovementRoutes.js"
import { cashRouter } from "./routes/cashFlow.js"

const router = Router()

router.use('/auth', authRouter)
router.use('/roles', roleRouter)
router.use('/workers', workerRouter)
router.use('/categories', categoryRouter)
router.use('/products', productRouter)
router.use('/stock-movements',stockMomeventRouter)
router.use('/cash',cashRouter)

export default router
