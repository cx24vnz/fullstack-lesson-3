import axios from 'axios'

const localUrl = 'http://localhost:3001/api/persons'
const relativeUrl = "/api/persons"
//const baseUrl = 'https://phonebook-backend-lection3.onrender.com/api/persons'
const baseUrl = relativeUrl



const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const deletePerson = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
  }

export default { getAll, create, update , deletePerson}