import { Router } from "express"
import { authRouter } from "./routes/authRoutes.js"
import { roleRouter } from "./routes/roleRoutes.js"
const router = Router()

router.use('/auth',authRouter)
router.use('/role',roleRouter)

export default router
