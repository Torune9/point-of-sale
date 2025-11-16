import { Router } from "express"
import { authRouter } from "./routes/authRoutes.js"
import { roleRouter } from "./routes/roleRoutes.js"
import { workerRouter } from "./routes/workerRoutes.js"
import { categoryRouter } from "./routes/categoryRoutes.js"
import { productRouter } from "./routes/productRoutes.js"
import { stockMomeventRouter } from "./routes/stockMovementRoutes.js"
import { cashRouter } from "./routes/cashFlow.js"
import { salesRouter } from "./routes/salesRouter.js"
import { authenticate } from "../middleware/authentication.js"
import { businessRouter } from "./routes/businessRouter.js"

const router = Router()

router.use('/auth', authRouter)

router.use(authenticate)

router.use('/roles', roleRouter)
router.use('/categories', categoryRouter)
router.use('/business',businessRouter)
router.use('/products', productRouter)
router.use('/stock-movements',stockMomeventRouter)
router.use('/cash',cashRouter)
router.use('/sales',salesRouter)
router.use('/workers', workerRouter)

export default router
