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
  getByDate: (date) => axiosInstance.get(`${API_BASE}/date/${date}`),
  bulkCreate: (data) => axiosInstance.post(`${API_BASE}/bulk`, data),
  
  // Analytics
  getMonthlyAnalytics: (year, month) => axiosInstance.get(`${API_BASE}/analytics/monthly/${year}/${month}`),
  getVarianceReport: (params) => axiosInstance.get(`${API_BASE}/analytics/variances`, { params }),
  getDashboardSummary: (params) => axiosInstance.get(`${API_BASE}/analytics/dashboard`, { params }),
  
  // Import/Export
  uploadExcel: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return axiosInstance.post(`${API_BASE}/import/excel`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  exportExcel: (year, month) => axiosInstance.get(`${API_BASE}/export/excel/${year}/${month}`, {
    responseType: 'blob'
  }),
  
  // Audit
  getModifications: (id) => axiosInstance.get(`${API_BASE}/${id}/modifications`),
  getAuditLogs: (params) => axiosInstance.get(`${API_BASE}/audit/logs`, { params }),
  getAuditUsers: () => axiosInstance.get(`${API_BASE}/audit/users`),
  getRecordActivity: (id) => axiosInstance.get(`${API_BASE}/audit/activity/${id}`)
}