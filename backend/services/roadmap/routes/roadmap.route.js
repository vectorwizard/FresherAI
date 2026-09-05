import express from "express";
import { generateRoadmap, getAllRoadmap, getRoadmapbyId } from "../controllers/roadmap.controller.js";

const router = express.Router()

router.post("/generate", generateRoadmap)
router.get("/all", getAllRoadmap)
router.get("/:id", getRoadmapbyId)

export default router