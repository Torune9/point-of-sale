import e from "express";
import { validateData } from "../../middleware/validationMiddleware.js";
import { Business } from "../../schemas/businessSchema.js";
import { createBusiness } from "../../controller/users/businesses/create.js";
import { getBusiness } from "../../controller/users/businesses/get.js";
import { updateBusiness } from "../../controller/users/businesses/update.js";
import { deleteBusiness } from "../../controller/users/businesses/delete.js";
import { ownerAuth } from "../../middleware/ownerAuth.js";

export const businessRouter = e.Router()

businessRouter.use(ownerAuth)

businessRouter.post('/',validateData(Business),createBusiness)

businessRouter.get('/:businessId',getBusiness)

businessRouter.patch('/:businessId',updateBusiness)

businessRouter.delete('/:businessId',deleteBusiness)
