import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 60000,
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

export const stockAnalyticsAPI = {
  getAdminDashboard: (params) =>
    axiosInstance.get('/api/stock-audit/admin/analytics/dashboard', { params }),
  
  getAIInsights: (params) =>
    axiosInstance.get('/api/stock-audit/admin/analytics/ai-insights', { 
      params,
      timeout: 120000
    })
}

export default axiosInstance
