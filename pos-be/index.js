import express from 'express'
import router from './src/router/router.js'
const port = 3000
const app = express()

app.use('/api',router)

app.listen(port,()=>{
    console.warn(`server running on port ${port}`);
})
