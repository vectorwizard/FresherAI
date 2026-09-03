import express from "express"
import "dotenv/config"
import dns from "dns"
import { connectDB } from "./config/db.js"
import interviewRouter from "./routes/interview.route.js"

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

const app = express()

const PORT = process.env.PORT || 6003

app.use(express.json())
app.use("/", interviewRouter)

app.get("/", (req, res)=>{
    res.send("Hello from Interview-service")
})

app.listen(PORT, ()=>{
    console.log(`Interview service started on ${PORT}`)
    connectDB()
})