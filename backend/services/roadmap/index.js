import express from "express"
import "dotenv/config"
import dns from "dns"
import { connectDB } from "./configs/db.js"
import router from "./routes/roadmap.route.js"

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

const app = express()

const PORT = process.env.PORT || 6004

app.use(express.json())

app.use("/", router)

app.listen(PORT, ()=>{
    console.log(`Roadmap service started on ${PORT}`)
    connectDB()
})