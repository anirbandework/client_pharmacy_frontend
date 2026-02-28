import axiosInstance from './axios'

const API_BASE = '/api/billing/admin/analytics'

export const billingAdminAPI = {
  getDashboard: (params) => axiosInstance.get(`${API_BASE}/dashboard`, { params }),
  getAIInsights: (params) => axiosInstance.get(`${API_BASE}/ai-insights`, { 
    params,
    timeout: 120000 // 2 minutes for AI requests
  })
}
