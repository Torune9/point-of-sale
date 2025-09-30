import e from "express";
import { validateData } from "../../middleware/validationMiddleware.js";
import { createCategory } from "../../controller/inventories/categories/create.js";
import { getCategory, getCategoryById } from "../../controller/inventories/categories/get.js";
import { updateCategory } from "../../controller/inventories/categories/update.js";
import { deleteCategory } from "../../controller/inventories/categories/delete.js";

export const categoryRouter = e.Router()

categoryRouter.get('/', getCategory)
categoryRouter.post('/', createCategory)
categoryRouter.get('/:id', getCategoryById)
categoryRouter.patch('/:id', updateCategory)
categoryRouter.delete('/:id', deleteCategory)
