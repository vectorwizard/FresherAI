import express from "express"
import "dotenv/config"
import dns from "dns"
import { connectDB } from "./configs/db.js"
import billingRouter from "./routes/billing.route.js"

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

const app = express()

const PORT = process.env.PORT || 6005

app.use(express.json())
app.use("/", billingRouter)

app.get("/", (req,res)=>{
    res.send("Hello from Billing Service")
})

app.listen(PORT, ()=>{
    console.log(`Billing service started on ${PORT}`)
    connectDB()
})