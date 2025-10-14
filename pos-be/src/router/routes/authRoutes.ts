import { Router } from "express";
import { validateData } from "../../middleware/validationMiddleware.js";
import { User, UserLogin } from "../../schemas/userSchema.js";
import { ownerLogin, workerLogin } from "../../controller/users/login.js";
import { register } from "../../controller/users/register.js";

export const authRouter = Router()

authRouter.post('/login', validateData(UserLogin), ownerLogin)

authRouter.post('/login/worker', validateData(UserLogin), workerLogin)

authRouter.post('/register', validateData(User), register)
