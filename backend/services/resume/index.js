import express from "express"
import "dotenv/config"
import dns from "dns"
import { connectDB } from "./config/db.js"
import resumeRouter from "./routes/resume.route.js"

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

const app = express()

const PORT = process.env.PORT || 6002

app.use(express.json())

app.use("/", resumeRouter)

app.get("/", (req, res)=>{
    res.send("Hello from Resume-service")
})

app.listen(PORT, ()=>{
    console.log(`Auth service started on ${PORT}`)
    connectDB()
})