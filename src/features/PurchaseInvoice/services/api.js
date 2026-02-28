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
  uploadInvoice: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return axiosInstance.post('/api/purchase-invoices/upload', formData, {
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
  
  getInvoice: (id) => 
    axiosInstance.get(`/api/purchase-invoices/${id}`),
  
  updateInvoice: (id, data) =>
    axiosInstance.put(`/api/purchase-invoices/${id}`, data),
  
  deleteInvoice: (id) => 
    axiosInstance.delete(`/api/purchase-invoices/${id}`),
  
  getSummary: (params) => 
    axiosInstance.get('/api/purchase-invoices/stats/summary', { params }),
  
  searchItems: (params) => 
    axiosInstance.get('/api/purchase-invoices/items/search', { params }),
  
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
    axiosInstance.get('/api/purchase-invoices/admin/pending-verification', { params })
}

export default axiosInstance
