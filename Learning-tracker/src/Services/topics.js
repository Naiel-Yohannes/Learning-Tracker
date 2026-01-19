import axios from 'axios'
const url = 'http://localhost:3001/api/topics'

const getItem = () => {
    const request = axios.get(url)
    return request.then(response => response.data)
}

const createItem = (newObj) => {
    const request = axios.post(url, newObj)
    return request.then(r => r.data)
}

const updateItem = (id, newConf) => {
    const request = axios.put(`${url}/${id}`, newConf)    
    return request.then(r => r.data)
}

const removeItem = (id) => {
    const request = axios.delete(`${url}/${id}`)
    return request.then(r => r.data)
}

export default {getItem, createItem, updateItem, removeItem}