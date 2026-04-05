import api from "./axiosInterceptor"
const url = '/api/login'

const userLoggin = async (credentials) => {
    const response = await api.post(url, credentials)
    return response.data
}

export default {userLoggin}