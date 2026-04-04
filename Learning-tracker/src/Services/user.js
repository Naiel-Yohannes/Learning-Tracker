import axios from "axios"
const url = '/api/users'

const registerUser = async(registererInfo) => {
    const response = await axios.post(url, registererInfo)
    return response.data
}

export default {registerUser}