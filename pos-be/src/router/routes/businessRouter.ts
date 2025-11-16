import e from "express";
import { validateData } from "../../middleware/validationMiddleware.js";
import { Business } from "../../schemas/businessSchema.js";
import { createBusiness } from "../../controller/users/businesses/create.js";
import { getBusiness } from "../../controller/users/businesses/get.js";
import { updateBusiness } from "../../controller/users/businesses/update.js";
import { deleteBusiness } from "../../controller/users/businesses/delete.js";

export const businessRouter = e.Router()

businessRouter.post('/',validateData(Business),createBusiness)

businessRouter.get('/:businessId',getBusiness)

businessRouter.patch('/:businessId',validateData(Business),updateBusiness)

businessRouter.delete('/:businessId',deleteBusiness)
