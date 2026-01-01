import e from "express";
import { createCategory } from "../../controller/inventories/categories/create.js";
import { getCategory, getCategoryById } from "../../controller/inventories/categories/get.js";
import { updateCategory } from "../../controller/inventories/categories/update.js";
import { deleteCategory } from "../../controller/inventories/categories/delete.js";
import { adminAuth } from "../../middleware/adminAuthorization.js";

export const categoryRouter = e.Router()

categoryRouter.get('/:businessId', getCategory)

categoryRouter.post('/', adminAuth, createCategory)

categoryRouter.get('/:businessId/:id', getCategoryById)

categoryRouter.patch('/:businessId/:id', adminAuth, updateCategory)

categoryRouter.delete('/:businessId/:id', adminAuth, deleteCategory)
