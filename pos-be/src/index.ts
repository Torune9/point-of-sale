import "dotenv/config"

import express from 'express'
import router from './router/router.js'
import cors from 'cors'
import { Server } from 'socket.io'

import { errorHandlerPrisma } from './middleware/prismaError.js'
import { logger } from "./utils/logger.js"
import { createServer } from "node:http"
import { initSocket } from "./socket.js"

const port = 3000
const app = express()
const server = createServer(app)

app.use(express.json())

app.use(cors())
app.use(express.urlencoded({
    extended: true,
}))

app.use('/api', router)

app.use(errorHandlerPrisma)

initSocket(server)

server.listen(port, () => {
    logger.info(`server running on ${port}`)
})
