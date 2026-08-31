import api from "../utils/axios"

export const getResume = async () => {
    try {
        const res = await api.get("/api/resume/get-resume")
        return res.data
    } catch (error) {
        return null
    }
}