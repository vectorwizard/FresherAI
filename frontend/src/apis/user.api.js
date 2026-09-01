import api from "../utils/axios"

export const getCurrentUser = async () => {
    try {
        const res = await api.get("/api/me")
        return res.data
    } catch (error) {
        return null
    }
}

export const useCoins = async (data) => {
    try {
        const res = await api.post("/api/auth/use-coins", data)
        return res.data
    } catch (error) {
        return null
    }
}