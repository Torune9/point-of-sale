import express from 'express'
const port = 3000
const app = express()

app.listen(port,()=>{
    console.warn(`server running on port ${port}`);
})
