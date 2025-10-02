import { Router } from "express"
import { authRouter } from "./routes/authRoutes.js"
import { roleRouter } from "./routes/roleRoutes.js"
import { workerRouter } from "./routes/workerRoutes.js"
import { categoryRouter } from "./routes/categoryRoutes.js"
import { productRouter } from "./routes/productRoutes.js"

const router = Router()

router.use('/auth', authRouter)
router.use('/roles', roleRouter)
router.use('/workers', workerRouter)
router.use('/category', categoryRouter)
router.use('/product', productRouter)

export default router
