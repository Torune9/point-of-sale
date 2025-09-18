import { Router } from "express";
import { validateData } from "../../middleware/validationMiddleware.js";
import { User } from "../../schemas/userSchema.js";
import { login } from "../../controller/users/authController.js";

export const authRouter = Router()

authRouter.post('/',validateData(User),login)
