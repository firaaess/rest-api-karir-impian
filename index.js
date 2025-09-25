import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import connDB from './utils/db.js'
import userRouter from './routes/user.routes.js'
import companyRouter from './routes/company.routes.js'
import jobRouter from './routes/job.routes.js'
import applicationRouter from './routes/application.routes.js'

dotenv.config()
const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin:['https://karir-impian.vercel.app','http://localhost:5173', 'firaaess.xyz', 'www.firaaess.xyz'],
    credentials:true

}))

const PORT = process.env.PORT

// API Routes
app.use('/api/user', userRouter)
app.use('/api/company', companyRouter)
app.use('/api/job', jobRouter)
app.use('/api/application', applicationRouter)

connDB()
app.listen(PORT, () => {
  console.log('Server running on port:', PORT)
})
