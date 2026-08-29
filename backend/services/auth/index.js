import express from "express"
import dotenv from "dotenv"
import dns from "dns"
import { connectDB } from "./config/db.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])
dotenv.config()

const app = express()

const PORT = process.env.PORT || 6001

app.use(express.json())
app.use(cookieParser())

app.use("/", authRouter)

app.get("/", (req, res)=>{
    res.send("Hello from auth service")
})

app.listen(PORT, ()=>{
    console.log(`Auth service started on ${PORT}`)
    connectDB()
})