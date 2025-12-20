import e from "express";
import { salesReport } from "../../controller/finance/salesReport.js";
import { getSales } from "../../controller/finance/sales.js";

export const salesRouter = e.Router()

salesRouter.get('/:businessId', getSales)
salesRouter.get('/report/:businessId', salesReport)
