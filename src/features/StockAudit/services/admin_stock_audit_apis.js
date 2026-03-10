import axiosInstance from './axios'

const API_BASE = '/api/stock-audit/admin'

export const adminStockAuditAPI = {
  // Admin Racks & Sections
  getAdminRacks: () => axiosInstance.get(`${API_BASE}/racks`),
  getAdminSections: (params) => axiosInstance.get(`${API_BASE}/sections`, { params }),
  
  // Admin Excel Upload Management
  getAdminExcelUploads: (params) => axiosInstance.get(`${API_BASE}/uploads`, { params }),
  getAdminUploadItems: (uploadId) => axiosInstance.get(`${API_BASE}/uploads/${uploadId}/items`),
  updateUploadItem: (uploadId, itemId, data) => axiosInstance.put(`${API_BASE}/uploads/${uploadId}/items/${itemId}`, data),
  deleteUploadItem: (uploadId, itemId) => axiosInstance.delete(`${API_BASE}/uploads/${uploadId}/items/${itemId}`),
  adminVerifyUpload: (uploadId, notes) => axiosInstance.post(`${API_BASE}/uploads/${uploadId}/admin-verify`, { notes }),
  rejectUpload: (uploadId, reason) => axiosInstance.post(`${API_BASE}/uploads/${uploadId}/reject`, { reason }),
  deleteUpload: (uploadId) => axiosInstance.delete(`${API_BASE}/uploads/${uploadId}`),
  
  // Admin Analytics
  getAdminDashboard: (params) => axiosInstance.get(`${API_BASE}/analytics/dashboard`, { params }),
  getAIInsights: (params) => axiosInstance.get(`${API_BASE}/analytics/ai-insights`, { 
    params,
    timeout: 120000
  }),
  
  // Admin Reports & Analytics
  getAIAnalytics: (params) => axiosInstance.get(`${API_BASE}/ai-analytics/comprehensive`, { params }),
  getAICharts: (params) => axiosInstance.get(`${API_BASE}/ai-analytics/charts`, { params }),
  
  // Admin Exports
  exportStockItems: () => axiosInstance.get(`${API_BASE}/export/stock-items`, { responseType: 'blob' }),
  exportAuditRecords: (params) => axiosInstance.get(`${API_BASE}/export/audit-records`, { params, responseType: 'blob' }),
  exportAdjustments: (params) => axiosInstance.get(`${API_BASE}/export/adjustments`, { params, responseType: 'blob' })
}