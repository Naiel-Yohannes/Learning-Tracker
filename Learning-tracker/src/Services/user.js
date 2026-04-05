import api from "./axiosInterceptor"
const url = '/api/users'

const registerUser = async(registererInfo) => {
    const response = await api.post(url, registererInfo)
    return response.data
}

export default {registerUser}