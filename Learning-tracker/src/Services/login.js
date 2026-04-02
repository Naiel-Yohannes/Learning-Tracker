import axios from "axios";
const url = '/api/login'

const userLoggin = async (credentials) => {
    const response = await axios.post(url, credentials)
    return response.data
}

export default {userLoggin}