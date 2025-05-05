import express from 'express'
import { createServer } from 'http'
import dotenv from "dotenv"
import connectDB from './infrastructure/config/db'
import cookieParser from 'cookie-parser'
import cors from 'cors';
import morgan from 'morgan'
import userRouter from './infrastructure/routes/userRouter';


const app = express()
dotenv.config()

app.use(cookieParser())

app.use(morgan("dev"))


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())

app.use("/api",userRouter)


const PORT = process.env.PORT || 4000
const httpServer = createServer(app)

connectDB()

httpServer.listen(PORT,()=>{
    console.log(`server running on http://localhost:${PORT}`);
})