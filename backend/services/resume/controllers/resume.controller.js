import { resumeAgent } from "../agents/resume.agents.js"
import extractText from "../config/pdf.js"
import Resume from "../models/resume.model.js"
import redis from "../../../shared/redis/redis.js"
import fs from "fs/promises"

export const uploadResume = async (req, res) => {
    const file = req.file

    try {
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Resume PDF is required"
            })
        }

        const userId = req.headers["x-user-id"]

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "UserId is required"
            })
        }

        const resumeText = await extractText(file.path)

        const aiResponse = await resumeAgent(resumeText)

        const resumeData = JSON.parse(aiResponse)

        let resume = await Resume.findOne({ userId })

        if (resume) {
            Object.assign(resume, {
                ...resumeData,
                extractedText: resumeText
            })

            await resume.save()
        } else {
            resume = await Resume.create({
                userId,
                extractedText: resumeText,
                ...resumeData
            })
        }

        await redis.set(`resume:${userId}`, JSON.stringify(resume))

        return res.status(200).json({
            success: true,
            message: "Resume analysed successfully",
            data: resume
        })
    } catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            message: error.message
        })
    } finally {
        if (file) {
            try {
                await fs.unlink(file.path)
            } catch (error) {
                console.log("Failed to delete uploaded file:", error.message)
            }
        }
    }
}

export const getResume = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"]

        const cache = await redis.get(`resume:${userId}`)

        if (cache) {
            return res.status(200).json({
                success: true,
                source: "redis",
                data: JSON.parse(cache)
            })
        }

        let resume = await Resume.findOne({ userId })

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            })
        }

        await redis.set(`resume:${userId}`, JSON.stringify(resume))

        return res.status(200).json({
            success: true,
            source: "mongoDB",
            data: resume
        })
    } catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

