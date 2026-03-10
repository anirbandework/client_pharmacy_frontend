import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const purchaseInvoiceAPI = {
  uploadInvoice: (file, forceExtract = false) => {
    const formData = new FormData()
    formData.append('file', file)
    const url = forceExtract 
      ? '/api/purchase-invoices/upload?force_extract=true'
      : '/api/purchase-invoices/upload'
    return axiosInstance.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 180000  // 3 minutes for file upload and AI processing
    })
  },
  
  downloadTemplate: () =>
    axiosInstance.get('/api/purchase-invoices/download-template', {
      responseType: 'blob'
    }),
  
  getInvoices: (params) => 
    axiosInstance.get('/api/purchase-invoices/', { params }),
  
  getDistributorInvoices: () =>
    axiosInstance.get('/api/distributor-invoices/staff/imported-invoices'),
  
  getDistributorInvoice: (id) =>
    axiosInstance.get(`/api/distributor-invoices/${id}`),
  
  getDistributorInvoiceAdmin: (id) =>
    axiosInstance.get(`/api/distributor-invoices/admin/${id}`),
  
  staffVerifyDistributorInvoice: (id) =>
    axiosInstance.post(`/api/distributor-invoices/staff/verify/${id}`),
  
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
    axiosInstance.get(`/api/purchase-invoices/${id}`),
  
  updateInvoice: (id, data) =>
    axiosInstance.put(`/api/purchase-invoices/${id}`, data),
  
  createInvoice: (data) =>
    axiosInstance.post('/api/purchase-invoices/create', data),
  
  deleteInvoice: (id) => 
    axiosInstance.delete(`/api/purchase-invoices/${id}`),
  
  getSummary: (params) => 
    axiosInstance.get('/api/purchase-invoices/stats/summary', { params }),
  
  searchItems: (params) => 
    axiosInstance.get('/api/purchase-invoices/items/search', { params }),
  
  // Admin Verification
  adminVerifyInvoice: (id) =>
    axiosInstance.post(`/api/purchase-invoices/${id}/admin-verify`),
  
  adminRejectInvoice: (id) =>
    axiosInstance.post(`/api/purchase-invoices/${id}/admin-reject`),
  
  adminUpdateInvoice: (id, data) =>
    axiosInstance.put(`/api/purchase-invoices/${id}/admin-update`, data),
  
  adminDeleteInvoice: (id) =>
    axiosInstance.delete(`/api/purchase-invoices/${id}/admin-delete`),
  
  getPendingAdminVerification: (params) =>
    axiosInstance.get('/api/purchase-invoices/pending-admin-verification', { params }),
  
  getPendingStaffVerification: (params) =>
    axiosInstance.get('/api/purchase-invoices/pending-staff-verification', { params }),
  
  getAdminInvoices: (params) =>
    axiosInstance.get('/api/purchase-invoices/admin-invoices', { params }),
  
  // Admin Analytics Endpoints
  getAdminAIAnalytics: (params) =>
    axiosInstance.get('/api/purchase-invoices/admin/ai-analytics', { 
      params,
      timeout: 120000  // 2 minutes for AI processing
    }),
  
  getExpiryAlerts: (params) =>
    axiosInstance.get('/api/purchase-invoices/admin/expiry-alerts', { 
      params,
      timeout: 30000  // 30 seconds
    }),
  
  getSupplierPerformance: (params) =>
    axiosInstance.get('/api/purchase-invoices/admin/supplier-performance', { 
      params,
      timeout: 30000  // 30 seconds
    }),
  
  getProcurementTrends: (params) =>
    axiosInstance.get('/api/purchase-invoices/admin/procurement-trends', { params }),
  
  getDashboardAnalytics: (params) =>
    axiosInstance.get('/api/purchase-invoices/admin/dashboard-analytics', { 
      params,
      timeout: 30000
    }),
  
  getPendingVerification: (params) =>
    axiosInstance.get('/api/purchase-invoices/admin/pending-verification', { params }),
  
  getFieldsGuide: () =>
    axiosInstance.get('/api/purchase-invoices/fields-guide'),
  
  getCompositions: (search) =>
    axiosInstance.get('/api/purchase-invoices/compositions', { params: { search } }),
  
  getProductNames: (search) =>
    axiosInstance.get('/api/purchase-invoices/product-names', { params: { search } }),
  
  getPricingByComposition: (composition, productName) =>
    axiosInstance.get('/api/purchase-invoices/pricing/by-composition', { 
      params: { composition, product_name: productName } 
    }).then(res => res.data),
  
  // Margin Playground Endpoints
  getMarginPlayground: (filters) =>
    axiosInstance.get('/api/purchase-invoices/analytics/margin-playground', { params: filters }),
  
  simulateMarginChange: (data, params) =>
    axiosInstance.post('/api/purchase-invoices/analytics/simulate-margin-change', data, { params }),
  
  getPricingOptimization: (params) =>
    axiosInstance.get('/api/purchase-invoices/analytics/pricing-optimization', { params }),
  
  getMarginTrends: (params) =>
    axiosInstance.get('/api/purchase-invoices/analytics/margin-trends', { params })
}

export default axiosInstance
