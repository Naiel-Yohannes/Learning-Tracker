import api from "./axiosInterceptor"

const baseUrl = import.meta.env.VITE_API_BASE_URL
const url = `${baseUrl}/api/users`

const registerUser = async(registererInfo) => {
    const response = await api.post(url, registererInfo)
    return response.data
}

export default {registerUser}