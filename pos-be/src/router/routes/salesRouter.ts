import e from "express";
import { salesReport } from "../../controller/finance/salesReport.js";

export const salesRouter = e.Router()

salesRouter.get('/report/:businessId', salesReport)
