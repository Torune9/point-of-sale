import express  from "express";

import { validateData } from "../../middleware/validationMiddleware.js";
import { createWorkers } from "../../controller/users/workers/create.js";

import { Worker } from "../../schemas/workerSchema.js";
import { updateWorkers } from "../../controller/users/workers/update.js";
import { getWorkers } from "../../controller/users/workers/get.js";
import { deleteWorkers } from "../../controller/users/workers/delete.js";

export const workerRouter = express.Router()

workerRouter.post('/',validateData(Worker),createWorkers)

workerRouter.get('/:businessId',getWorkers)

workerRouter.patch('/:id',updateWorkers)

workerRouter.delete('/:id',deleteWorkers)
