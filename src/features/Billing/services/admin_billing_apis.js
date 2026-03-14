import axiosInstance from './axios'

const API_BASE = '/api/billing/admin/analytics'
const ADMIN_BASE = '/api/billing/admin'

export const billingAdminAPI = {
  getDashboard: (params) => axiosInstance.get(`${API_BASE}/dashboard`, { params }),
  getAIInsights: (params) => axiosInstance.get(`${API_BASE}/ai-insights`, {
    params,
    timeout: 120000 // 2 minutes for AI requests
  }),
  getBills: (params) => axiosInstance.get(`${ADMIN_BASE}/bills`, { params }),
  getBill: (billId) => axiosInstance.get(`${ADMIN_BASE}/bills/${billId}`),
  getShopBillConfig: (shopId) => axiosInstance.get(`${ADMIN_BASE}/shop/${shopId}/bill-config`),
  getTopSelling: (params) => axiosInstance.get(`${ADMIN_BASE}/top-selling`, { params }),
  getDailySales: (params) => axiosInstance.get(`${ADMIN_BASE}/daily-sales`, { params }),
  exportBills: (params) => axiosInstance.get(`${ADMIN_BASE}/export/bills`, { params, responseType: 'blob' }),
  updateShopBillConfig: (shopId, config) => axiosInstance.put(`${ADMIN_BASE}/shop/${shopId}/bill-config`, config),

  getProfitAnalysis: (params) => axiosInstance.get(`${ADMIN_BASE}/profit-analysis`, { params })
}
