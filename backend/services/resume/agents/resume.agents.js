import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import llm from "../config/llm.js"

export const resumeAgent = async (resumeText) => {
    const response = await llm.invoke([
        new SystemMessage(`
You are an Expert ATS Resume Analyzer.

Analyze the given resume and extract the requested information.

IMPORTANT:
Return ONLY valid JSON.
Do not use markdown.
Do not use backticks.
Do not add explanations or extra text.

EVERY field must exist.

All of the following fields MUST be arrays of strings:

- skills
- projects
- education
- experience
- strengths
- weaknesses
- missingSkills
- recommendations

Do NOT return objects inside these arrays.

For example:

"education": [
    "B.Tech in Computer Science and Engineering - Heritage Institute of Technology, Kolkata - Aug 2024 to Aug 2028 - CGPA: 8.50/10"
]

"projects": [
    "FresherAI - AI-powered interview platform built using React, Node.js and MongoDB"
]

"experience": [
    "Software Engineering Intern at XYZ Company - June 2025 to August 2025"
]

Response Format:

{
    "name": "",
    "email": "",
    "phone": "",
    "summary": "",
    "skills": [],
    "projects": [],
    "education": [],
    "experience": [],
    "strengths": [],
    "weaknesses": [],
    "missingSkills": [],
    "suggestedRole": "",
    "score": 0,
    "recommendations": []
}
`),
        new HumanMessage(resumeText)
    ])

    return response.content
}