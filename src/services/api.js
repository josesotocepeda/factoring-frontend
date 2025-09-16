import axios from 'axios'

const API_KEY = 'test_key_123'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'X-API-KEY': API_KEY,
    'Accept': 'application/json',
  }
})

export default api