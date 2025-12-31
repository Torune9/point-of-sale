import e from "express";
import { salesReport } from "../../controller/finance/salesReport.js";
import { getAnnualSales, getSales } from "../../controller/finance/sales.js";

export const salesRouter = e.Router()

salesRouter.get('/:businessId', getSales)
salesRouter.get('/annual/:businessId',getAnnualSales)
salesRouter.get('/report/:businessId', salesReport)
