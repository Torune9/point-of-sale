import "dotenv/config"

import express from 'express'
import router from './router/router.js'

import { errorHandlerPrisma } from './utils/prismaError.js'

const port = 3000
const app = express()

app.use(express.json())

app.use(express.urlencoded({
    extended: true,
}))

app.use('/api', router)

app.use(errorHandlerPrisma)

app.listen(port, () => {
    console.warn(`server running on port ${port}`);
})
