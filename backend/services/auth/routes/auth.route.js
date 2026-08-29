import express from "express";
import { GoogleAuth, logOut } from "../controllers/auth.controller.js";

const authRouter = express.Router()

//http://localhost:8000/api/auth/login
authRouter.post('/login', GoogleAuth)

authRouter.post('/logout', logOut)

export default authRouter