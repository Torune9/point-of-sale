import express from "express"
import { validateData } from "../../middleware/validationMiddleware.js"
import { Role } from "../../schemas/roleSchema.js"
import { createRole } from "../../controller/roles/create.js"
import { getRoles } from "../../controller/roles/get.js"
import { updateRole } from "../../controller/roles/update.js"
import { adminAuth } from "../../middleware/adminAuthorization.js"

export const roleRouter = express.Router()

roleRouter.get('/', getRoles)

roleRouter.post('/', validateData(Role), adminAuth, createRole)

roleRouter.patch('/:id', validateData(Role),adminAuth, updateRole)
