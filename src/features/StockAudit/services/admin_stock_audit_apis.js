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
  
  // Admin Stock Items (read-only view)
  getAdminItems: (params) => axiosInstance.get(`${API_BASE}/items`, { params }),
  getConsolidatedItems: (params) => axiosInstance.get(`${API_BASE}/items/consolidated`, { params }),

  // Admin Reports
  getAdminLowStock: (params) => axiosInstance.get(`${API_BASE}/reports/low-stock`, { params }),
  getAdminExpiring: (params) => axiosInstance.get(`${API_BASE}/reports/expiring`, { params }),
  getAdminDiscrepancyReport: (params) => axiosInstance.get(`${API_BASE}/audit/discrepancies`, { params }),

  // Admin Analytics
  getAdminDashboard: (params) => axiosInstance.get(`${API_BASE}/analytics/dashboard`, { params }),
  getAdminAIAnalytics: (params) => axiosInstance.get(`${API_BASE}/analytics/ai-analytics`, {
    params,
    timeout: 120000
  }),
  getAIInsights: (params) => axiosInstance.get(`${API_BASE}/analytics/ai-insights`, {
    params,
    timeout: 120000
  }),
  
  // Admin Exports
  exportStockItems: () => axiosInstance.get(`${API_BASE}/export/stock-items`, { responseType: 'blob' }),
  exportAuditRecords: (params) => axiosInstance.get(`${API_BASE}/export/audit-records`, { params, responseType: 'blob' }),
  exportAdjustments: (params) => axiosInstance.get(`${API_BASE}/export/adjustments`, { params, responseType: 'blob' })
}