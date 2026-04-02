import axios from 'axios'
const url = '/api/topics'

let token = null

const getToken = (newToken) =>{
    token = `Bearer ${newToken}`
}

const getItem = () => {
    const config = {
        headers: {Authorization: token}
    }
    const request = axios.get(url, config)
    return request.then(response => response.data)
    
}

const createItem = (newObj) => {
    const config = {
        headers: {Authorization: token}
    }
    const request = axios.post(url, newObj, config)
    return request.then(r => r.data)
}

const updateItem = (id, newConf) => {
    const config = {
        headers: {Authorization: token}
    }
    const request = axios.put(`${url}/${id}`, newConf, config)    
    return request.then(r => r.data)
}

const removeItem = (id) => {
    const config = {
        headers: {Authorization: token}
    }
    const request = axios.delete(`${url}/${id}`, config)
    return request.then(r => r.data)
}

export default {getItem, createItem, updateItem, removeItem, getToken}