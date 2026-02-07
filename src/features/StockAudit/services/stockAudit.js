import axiosInstance from './axios'

const API_BASE = '/api/stock'

export const stockAuditAPI = {
  getRacks: () => axiosInstance.get(`${API_BASE}/racks`),
  createRack: (data) => axiosInstance.post(`${API_BASE}/racks`, data),
  updateRack: (rackId, data) => axiosInstance.put(`${API_BASE}/racks/${rackId}`, data),
  deleteRack: (rackId) => axiosInstance.delete(`${API_BASE}/racks/${rackId}`),
  getSections: (params) => axiosInstance.get(`${API_BASE}/sections`, { params }),
  createSection: (data) => axiosInstance.post(`${API_BASE}/sections`, data),
  updateSection: (sectionId, data) => axiosInstance.put(`${API_BASE}/sections/${sectionId}`, data),
  deleteSection: (sectionId) => axiosInstance.delete(`${API_BASE}/sections/${sectionId}`),
  addItem: (data) => axiosInstance.post(`${API_BASE}/items`, data),
  getItems: (params) => axiosInstance.get(`${API_BASE}/items`, { params }),
  getItem: (itemId) => axiosInstance.get(`${API_BASE}/items/${itemId}`),
  updateItem: (itemId, data) => axiosInstance.put(`${API_BASE}/items/${itemId}`, data),
  deleteItem: (itemId) => axiosInstance.delete(`${API_BASE}/items/${itemId}`),
  getItemStockCalc: (itemId) => axiosInstance.get(`${API_BASE}/items/${itemId}/stock-calculation`),
  addPurchase: (data) => axiosInstance.post(`${API_BASE}/purchases`, data),
  getPurchases: (params) => axiosInstance.get(`${API_BASE}/purchases`, { params }),
  updatePurchase: (purchaseId, data) => axiosInstance.put(`${API_BASE}/purchases/${purchaseId}`, data),
  deletePurchase: (purchaseId) => axiosInstance.delete(`${API_BASE}/purchases/${purchaseId}`),
  addSale: (data) => axiosInstance.post(`${API_BASE}/sales`, data),
  getSales: (params) => axiosInstance.get(`${API_BASE}/sales`, { params }),
  updateSale: (saleId, data) => axiosInstance.put(`${API_BASE}/sales/${saleId}`, data),
  deleteSale: (saleId) => axiosInstance.delete(`${API_BASE}/sales/${saleId}`),
  getRandomSection: () => axiosInstance.get(`${API_BASE}/audit/random-section`),
  startAuditSession: (data) => axiosInstance.post(`${API_BASE}/audit/sessions`, data),
  auditItem: (itemId, physicalQuantity, auditedBy, notes) => axiosInstance.put(`${API_BASE}/items/${itemId}/audit`, null, { 
    params: { physical_quantity: physicalQuantity, audited_by: auditedBy, notes }
  }),
  getDiscrepancies: (params) => axiosInstance.get(`${API_BASE}/audit/discrepancies`, { params }),
  getAuditSummary: (params) => axiosInstance.get(`${API_BASE}/audit/summary`, { params }),
  calculateStock: (data) => axiosInstance.post(`${API_BASE}/calculate-stock`, data),
  getLowStock: (params) => axiosInstance.get(`${API_BASE}/reports/low-stock`, { params }),
  getExpiring: (params) => axiosInstance.get(`${API_BASE}/reports/expiring`, { params }),
  getStockMovement: (params) => axiosInstance.get(`${API_BASE}/reports/stock-movement`, { params })
}
