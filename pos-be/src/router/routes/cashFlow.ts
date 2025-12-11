import e from "express";
import { totalCash } from "../../controller/finance/totalCash.js";
import { cashFlow, getCashFlow } from "../../controller/finance/cashFlow.js";
import { validateData } from "../../middleware/validationMiddleware.js";
import { cashData } from "../../schemas/cashFlowSchema.js";

export const cashRouter = e.Router()

cashRouter.post('/',validateData(cashData),cashFlow)
cashRouter.get('/:businessId',getCashFlow)
cashRouter.get('/:businessId/:id',totalCash)
