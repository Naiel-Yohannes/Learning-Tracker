import api from "./axiosInterceptor"

const baseUrl = import.meta.env.VITE_API_BASE_URL
const url = `${baseUrl}/api/login`

const userLoggin = async (credentials) => {
    const response = await api.post(url, credentials)
    return response.data
}

export default {userLoggin}