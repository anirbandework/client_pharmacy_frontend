import axiosInstance from './axios'

const API_BASE = '/api/purchase-invoices'

export const adminPurchaseInvoiceAPI = {
  getDistributorInvoiceAdmin: (id) =>
    axiosInstance.get(`/api/distributor-invoices/admin/${id}`),
  
  adminVerifyDistributorInvoice: (id) =>
    axiosInstance.post(`/api/distributor-invoices/admin/verify/${id}`),
  
  adminRejectDistributorInvoice: (id) =>
    axiosInstance.post(`/api/distributor-invoices/admin/reject/${id}`),
  
  getPendingDistributorInvoices: () =>
    axiosInstance.get('/api/distributor-invoices/admin/pending'),
  
  getApprovedDistributorInvoices: (params) =>
    axiosInstance.get('/api/distributor-invoices/admin/approved', { params }),
  
  adminUpdateDistributorInvoice: (id, data) =>
    axiosInstance.put(`/api/distributor-invoices/admin/${id}`, data),
  
  getInvoice: (id) => 
    axiosInstance.get(`${API_BASE}/${id}`),
  
  adminVerifyInvoice: (id) =>
    axiosInstance.post(`${API_BASE}/${id}/admin-verify`),
  
  adminRejectInvoice: (id) =>
    axiosInstance.post(`${API_BASE}/${id}/admin-reject`),
  
  adminUpdateInvoice: (id, data) =>
    axiosInstance.put(`${API_BASE}/${id}/admin-update`, data),
  
  adminDeleteInvoice: (id) =>
    axiosInstance.delete(`${API_BASE}/${id}/admin-delete`),
  
  getPendingAdminVerification: (params) =>
    axiosInstance.get(`${API_BASE}/pending-admin-verification`, { params }),
  
  getPendingStaffVerification: (params) =>
    axiosInstance.get(`${API_BASE}/pending-staff-verification`, { params }),
  
  getAdminInvoices: (params) =>
    axiosInstance.get(`${API_BASE}/admin-invoices`, { params }),
  
  getAdminAIAnalytics: (params) =>
    axiosInstance.get(`${API_BASE}/admin/ai-analytics`, { 
      params,
      timeout: 120000
    }),
  
  getExpiryAlerts: (params) =>
    axiosInstance.get(`${API_BASE}/admin/expiry-alerts`, { 
      params,
      timeout: 30000
    }),
  
  getSupplierPerformance: (params) =>
    axiosInstance.get(`${API_BASE}/admin/supplier-performance`, { 
      params,
      timeout: 30000
    }),
  
  getProcurementTrends: (params) =>
    axiosInstance.get(`${API_BASE}/admin/procurement-trends`, { params }),
  
  getDashboardAnalytics: (params) =>
    axiosInstance.get(`${API_BASE}/admin/dashboard-analytics`, { 
      params,
      timeout: 30000
    }),
  
  getPendingVerification: (params) =>
    axiosInstance.get(`${API_BASE}/admin/pending-verification`, { params }),
  
  getMarginPlayground: (filters) =>
    axiosInstance.get(`${API_BASE}/analytics/margin-playground`, { params: filters }),
  
  simulateMarginChange: (data, params = {}) =>
    axiosInstance.post(`${API_BASE}/analytics/simulate-margin-change`, data, { 
      params,
      timeout: 30000 
    }),
  
  getPricingOptimization: (params) =>
    axiosInstance.get(`${API_BASE}/analytics/pricing-optimization`, { params }),
  
  getMarginTrends: (params) =>
    axiosInstance.get(`${API_BASE}/analytics/margin-trends`, { params })
}
