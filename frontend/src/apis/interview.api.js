import api from "../utils/axios"


export const startInterview = async (data) => {
    try {
        const res = await api.post("/api/interview/start", data)
        console.log(res.data)
        return res.data
    } catch (error) {
        console.log(error)
        return null
    }
}