import axios from "axios";

const api = axios.create()

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response && error.response.status === 401){
            window.dispatchEvent(new Event('unauthorized'))
        }

        return Promise.reject(error)
    }
)

export default api