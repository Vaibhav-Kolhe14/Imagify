import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './db/connectDB.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

const PORT = process.env.PORT || 4000;

const app = express()

app.use(cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN
}))

app.use(express.json())

app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)

app.get('/', (req, res) => {
    res.send("API WORKing")
})


connectDB()
.then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running at port ${PORT}`)
    })
})
.catch((error) => {
    console.error("MongoDB Connection Failed:", error);
})
