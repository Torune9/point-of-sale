import e from "express";
import { dailySalesReport } from "../../controller/finance/dailySales.js";

export const salesRouter = e.Router()

salesRouter.get('/report/:businessId', dailySalesReport)
