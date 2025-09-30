import { Router } from "express"
import { authRouter } from "./routes/authRoutes.js"
import { roleRouter } from "./routes/roleRoutes.js"
import { workerRouter } from "./routes/workerRoutes.js"
import { categoryRouter } from "./routes/categoryRoutes.js"
const router = Router()

router.use('/auth',authRouter)
router.use('/roles',roleRouter)
router.use('/workers',workerRouter)
router.use('/category',categoryRouter)

export default router
