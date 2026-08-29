import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import { getCurrentUser } from "./controllers/user.controller.js"
import { isAuth } from "./middleware/isAuth.js"
dotenv.config()

const app = express()
app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(morgan("dev"))

app.use(cookieParser())

app.use("/api/auth", proxy(process.env.AUTH_SERVICE_URL))

const PORT = process.env.PORT || 6000

app.get("/", (req, res)=>{
    res.send("Hello from gateway")
})

app.get("/api/me", isAuth, getCurrentUser)

app.listen(PORT, ()=>{
    console.log(`Gateway started on ${PORT}`)
})