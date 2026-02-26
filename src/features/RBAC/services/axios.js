import axios from 'axios'
import toast from 'react-hot-toast'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.detail || error.response?.data?.message || error.message

    if (status === 500) {
      toast.error('Server error. Please contact support.', { duration: 5000 })
    } else if (status === 404) {
      toast.error('Resource not found.', { duration: 4000 })
    } else if (status === 403) {
      toast.error('Access denied. SuperAdmin only.', { duration: 4000 })
    } else if (status === 401) {
      toast.error('Session expired. Please login again.')
    } else if (status >= 400 && status < 500) {
      toast.error(message || 'Request failed.')
    } else if (!error.response) {
      toast.error('Network error. Please check your connection.', { duration: 4000 })
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
