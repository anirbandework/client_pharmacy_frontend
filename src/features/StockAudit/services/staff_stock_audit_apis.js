import axiosInstance from './axios'

const API_BASE = '/api/stock-audit/staff'

export const staffStockAuditAPI = {
  // Racks & Sections Management
  getRacks: () => axiosInstance.get(`${API_BASE}/racks`),
  createRack: (data) => axiosInstance.post(`${API_BASE}/racks`, data),
  updateRack: (rackId, data) => axiosInstance.put(`${API_BASE}/racks/${rackId}`, data),
  deleteRack: (rackId) => axiosInstance.delete(`${API_BASE}/racks/${rackId}`),
  getSections: (params) => axiosInstance.get(`${API_BASE}/sections`, { params }),
  createSection: (data) => axiosInstance.post(`${API_BASE}/sections`, data),
  updateSection: (sectionId, data) => axiosInstance.put(`${API_BASE}/sections/${sectionId}`, data),
  deleteSection: (sectionId) => axiosInstance.delete(`${API_BASE}/sections/${sectionId}`),
  
  // Stock Items Management
  addItem: (data) => axiosInstance.post(`${API_BASE}/items`, data),
  getItems: (params) => axiosInstance.get(`${API_BASE}/items`, { params }),
  getConsolidatedItems: (params) => axiosInstance.get(`${API_BASE}/items/consolidated`, { params }),
  getUnassignedItems: (params) => axiosInstance.get(`${API_BASE}/items/unassigned/list`, { params }),
  assignSection: (itemId, sectionId) => axiosInstance.patch(`${API_BASE}/items/${itemId}/assign-section`, null, { params: { section_id: sectionId } }),
  getItem: (itemId) => axiosInstance.get(`${API_BASE}/items/${itemId}`),
  updateItem: (itemId, data) => axiosInstance.put(`${API_BASE}/items/${itemId}`, data),
  deleteItem: (itemId) => axiosInstance.delete(`${API_BASE}/items/${itemId}`),
  bulkDeleteItems: (itemIds) => axiosInstance.post(`${API_BASE}/items/bulk-delete`, itemIds),
  getItemStockCalc: (itemId) => axiosInstance.get(`${API_BASE}/items/${itemId}/stock-calculation`),
  
  // Excel Upload
  uploadExcel: (formData) => axiosInstance.post(`${API_BASE}/items/upload-excel`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getExcelUploads: (params) => axiosInstance.get(`${API_BASE}/uploads`, { params }),
  getUploadItems: (uploadId) => axiosInstance.get(`${API_BASE}/uploads/${uploadId}/items`),
  updateUploadItem: (uploadId, itemId, data) => axiosInstance.put(`${API_BASE}/uploads/${uploadId}/items/${itemId}`, data),
  deleteUploadItem: (uploadId, itemId) => axiosInstance.delete(`${API_BASE}/uploads/${uploadId}/items/${itemId}`),
  staffVerifyUpload: (uploadId, notes) => axiosInstance.post(`${API_BASE}/uploads/${uploadId}/staff-verify`, { notes }),
  rejectUpload: (uploadId, reason) => axiosInstance.post(`${API_BASE}/uploads/${uploadId}/reject`, { reason }),
  
  // Purchases & Sales
  addPurchase: (data) => axiosInstance.post(`${API_BASE}/purchases`, data),
  getPurchases: (params) => axiosInstance.get(`${API_BASE}/purchases`, { params }),
  updatePurchase: (purchaseId, data) => axiosInstance.put(`${API_BASE}/purchases/${purchaseId}`, data),
  deletePurchase: (purchaseId) => axiosInstance.delete(`${API_BASE}/purchases/${purchaseId}`),
  addSale: (data) => axiosInstance.post(`${API_BASE}/sales`, data),
  getSales: (params) => axiosInstance.get(`${API_BASE}/sales`, { params }),
  updateSale: (saleId, data) => axiosInstance.put(`${API_BASE}/sales/${saleId}`, data),
  deleteSale: (saleId) => axiosInstance.delete(`${API_BASE}/sales/${saleId}`),
  
  // Audit Operations
  getRandomSection: () => axiosInstance.get(`${API_BASE}/audit/random-section`),
  startAuditSession: (data) => axiosInstance.post(`${API_BASE}/audit/sessions`, data),
  auditItem: (itemId, physicalQuantity, notes) => axiosInstance.put(`${API_BASE}/items/${itemId}/audit`, null, { 
    params: { physical_quantity: physicalQuantity, notes }
  }),
  getDiscrepancies: (params) => axiosInstance.get(`${API_BASE}/audit/discrepancies`, { params }),
  getAuditSummary: (params) => axiosInstance.get(`${API_BASE}/audit/summary`, { params }),
  
  // Stock Management
  calculateStock: (data) => axiosInstance.post(`${API_BASE}/calculate-stock`, data),
  addAdjustment: (data) => axiosInstance.post(`${API_BASE}/adjustments`, data),
  getAdjustments: (params) => axiosInstance.get(`${API_BASE}/adjustments`, { params }),
  
  // Reports
  getLowStock: (params) => axiosInstance.get(`${API_BASE}/reports/low-stock`, { params }),
  getExpiring: (params) => axiosInstance.get(`${API_BASE}/reports/expiring`, { params }),
  getStockMovement: (params) => axiosInstance.get(`${API_BASE}/reports/stock-movement`, { params }),
  
  // AI Analytics (Staff Level)
  getAIInsights: (params) => axiosInstance.get(`${API_BASE}/ai-analytics/insights`, { params }),
  getAIAnalytics: (params) => axiosInstance.get(`${API_BASE}/ai-analytics/comprehensive`, { params }),
  getAICharts: (params) => axiosInstance.get(`${API_BASE}/ai-analytics/charts`, { params }),
  
  // Exports
  exportStockItems: () => axiosInstance.get(`${API_BASE}/export/stock-items`, { responseType: 'blob' }),
  exportAuditRecords: (params) => axiosInstance.get(`${API_BASE}/export/audit-records`, { params, responseType: 'blob' }),
  exportAdjustments: (params) => axiosInstance.get(`${API_BASE}/export/adjustments`, { params, responseType: 'blob' })
}