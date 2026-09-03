import llm from "../config/llm.js"
import summaryPrompt from "../prompts/summaryPrompt.js";


export const summaryAgent = async (data) => {
    try {
        const prompt = summaryPrompt(data)

        const res = await llm.invoke(prompt)

        const cleaned = res.content
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleaned)
    } catch (error) {
        throw new Error("Failed to generate summary.")
    }
}