import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import connDB from './utils/db.js'
import userRouter from './routes/user.routes.js'
dotenv.config({})
const app = express()

// middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
const corsOption = {
    origin:'http//localhost:5173',
    credential:true
}
app.use(cors(corsOption))
const PORT = process.env.PORT
//api
app.use('/api/user', userRouter)
app.listen(PORT, () => {
    connDB()
    console.log('server running in port :', PORT)
})