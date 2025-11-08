import "dotenv/config"

import express from 'express'
import router from './router/router.js'
import cors from 'cors'

import { errorHandlerPrisma } from './middleware/prismaError.js'
import { logger } from "./utils/logger.js"

const port = 3000
const app = express()

app.use(express.json())

app.use(cors())
app.use(express.urlencoded({
    extended: true,
}))

app.use('/api', router)

app.use(errorHandlerPrisma)

app.listen(port, () => {
    logger.info(`server running on ${port}`)
})
