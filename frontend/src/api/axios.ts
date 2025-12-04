import axios from 'axios'

// Base URL (from .env or fallback)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hb_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Global response interceptor (optional but helpful)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle expired token, unauthorized, etc.
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized — possible invalid or expired token.')
      localStorage.removeItem('hb_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
