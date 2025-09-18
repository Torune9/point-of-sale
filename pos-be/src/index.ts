import express from 'express'
import router from './router/router.js'
import "dotenv/config"
const port = 3000
const app = express()

app.use(express.json())

app.use(express.urlencoded({
    extended: true,
}))

app.use('/api', router)

app.listen(port, () => {
    console.warn(`server running on port ${port}`);
})
