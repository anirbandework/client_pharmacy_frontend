import axiosInstance from './axios'

const API_BASE = '/api/daily-records'

export const dailyRecordsAPI = {
  // CRUD Operations
  create: (data) => axiosInstance.post(`${API_BASE}/`, data),
  getAll: (params) => axiosInstance.get(`${API_BASE}/`, { params }),
  getById: (id) => axiosInstance.get(`${API_BASE}/${id}`),
  update: (id, data, modifiedBy) => {
    const params = modifiedBy ? { modified_by: modifiedBy } : {}
    return axiosInstance.put(`${API_BASE}/${id}`, data, { params })
  },
  delete: (id) => axiosInstance.delete(`${API_BASE}/${id}`),
  getByDate: (date, shopId) => axiosInstance.get(`${API_BASE}/date/${date}`, { params: { shop_id: shopId } }),
  bulkCreate: (data) => axiosInstance.post(`${API_BASE}/bulk`, data),
  
  // Analytics
  getMonthlyAnalytics: (year, month, shopId) => axiosInstance.get(`${API_BASE}/analytics/monthly/${year}/${month}`, { params: { shop_id: shopId } }),
  getVarianceReport: (params) => axiosInstance.get(`${API_BASE}/analytics/variances`, { params }),
  getDashboardSummary: (params) => axiosInstance.get(`${API_BASE}/analytics/dashboard`, { params }),
  
  // Import/Export
  uploadExcel: (file, shopId) => {
    const formData = new FormData()
    formData.append('file', file)
    return axiosInstance.post(`${API_BASE}/import/excel`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { shop_id: shopId }
    })
  },
  exportExcel: (year, month, shopId) => axiosInstance.get(`${API_BASE}/export/excel/${year}/${month}`, {
    responseType: 'blob',
    params: { shop_id: shopId }
  }),
  
  // Audit
  getModifications: (id) => axiosInstance.get(`${API_BASE}//${id}/modifications`),
  getAuditLogs: (params) => axiosInstance.get(`${API_BASE}/audit/logs`, { params }),
  getAuditUsers: () => axiosInstance.get(`${API_BASE}/audit/users`),
  getRecordActivity: (id) => axiosInstance.get(`${API_BASE}/audit/activity/${id}`),
  
  // AI Analytics
  getAIComprehensive: (days = 90, shopId) => axiosInstance.get(`${API_BASE}/ai-analytics/comprehensive`, { params: { days, shop_id: shopId } }),
  getAITrends: (days = 90, shopId) => axiosInstance.get(`${API_BASE}/ai-analytics/trends`, { params: { days, shop_id: shopId } }),
  getAIPredictions: (days = 90, forecastDays = 30, shopId) => axiosInstance.get(`${API_BASE}/ai-analytics/predictions`, { params: { days, forecast_days: forecastDays, shop_id: shopId } }),
  getAIChartData: (days = 90, shopId) => axiosInstance.get(`${API_BASE}/ai-analytics/chart-data`, { params: { days, shop_id: shopId } }),
  getAIInsights: (days = 90, shopId) => axiosInstance.get(`${API_BASE}/ai-analytics/insights`, { params: { days, shop_id: shopId } }),
  getAIDashboard: (shopId) => axiosInstance.get(`${API_BASE}/ai-analytics/dashboard`, { params: { shop_id: shopId } })
}