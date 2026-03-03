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
    const retryAfter = error.response?.headers?.['retry-after']
    const url = error.config?.url || ''

    // For 429 errors, check if it's a critical user action or background polling
    if (status === 429) {
      // Critical endpoints that need user notification
      const criticalEndpoints = ['/otp/', '/login', '/register', '/upload']
      const isCritical = criticalEndpoints.some(endpoint => url.includes(endpoint))
      
      if (isCritical) {
        const waitTime = retryAfter ? `${Math.ceil(retryAfter / 60)} minutes` : 'a few minutes'
        toast.error(`Too many attempts. Please wait ${waitTime} and try again.`, { duration: 6000 })
      } else {
        // Background polling - silent
        console.log('Rate limit reached - will retry on next poll')
      }
      return Promise.reject(error)
    }

    // Silently ignore timeout errors - they're often temporary
    if (error.code === 'ECONNABORTED' || message.includes('timeout')) {
      console.log('Request timeout - will retry later')
      return Promise.reject(error)
    }

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
    } else if (!error.response && !error.code) {
      // Only show network error for actual network failures, not timeouts
      toast.error('Network error. Please check your connection.', { duration: 4000 })
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
