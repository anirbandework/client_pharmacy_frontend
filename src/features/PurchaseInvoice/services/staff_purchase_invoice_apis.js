import axiosInstance from './axios'

const API_BASE = '/api/purchase-invoices'

export const staffPurchaseInvoiceAPI = {
  uploadInvoice: (file, forceExtract = false) => {
    const formData = new FormData()
    formData.append('file', file)
    const url = forceExtract 
      ? `${API_BASE}/upload?force_extract=true`
      : `${API_BASE}/upload`
    return axiosInstance.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 180000
    })
  },
  
  downloadTemplate: () =>
    axiosInstance.get(`${API_BASE}/download-template`, {
      responseType: 'blob'
    }),
  
  downloadPDFTemplate: () =>
    axiosInstance.get(`${API_BASE}/download-pdf-template`, {
      responseType: 'blob'
    }),
  
  getInvoices: (params) => 
    axiosInstance.get(`${API_BASE}/`, { params }),
  
  getDistributorInvoices: () =>
    axiosInstance.get('/api/distributor-invoices/staff/imported-invoices'),
  
  getDistributorInvoice: (id) =>
    axiosInstance.get(`/api/distributor-invoices/${id}`),
  
  staffVerifyDistributorInvoice: (id) =>
    axiosInstance.post(`/api/distributor-invoices/staff/verify/${id}`),
  
  getInvoice: (id) => 
    axiosInstance.get(`${API_BASE}/${id}`),
  
  updateInvoice: (id, data) =>
    axiosInstance.put(`${API_BASE}/${id}`, data),
  
  createInvoice: (data) =>
    axiosInstance.post(`${API_BASE}/create`, data),
  
  deleteInvoice: (id) => 
    axiosInstance.delete(`${API_BASE}/${id}`),
  
  getSummary: (params) => 
    axiosInstance.get(`${API_BASE}/stats/summary`, { params }),
  
  searchItems: (params) => 
    axiosInstance.get(`${API_BASE}/items/search`, { params }),
  
  getFieldsGuide: () =>
    axiosInstance.get(`${API_BASE}/fields-guide`),
  
  getCompositions: (search) =>
    axiosInstance.get(`${API_BASE}/compositions`, { params: { search } }),
  
  getProductNames: (search) =>
    axiosInstance.get(`${API_BASE}/product-names`, { params: { search } }),
  
  getPricingByComposition: (composition, productName) =>
    axiosInstance.get(`${API_BASE}/pricing/by-composition`, {
      params: { composition, product_name: productName }
    }).then(res => res.data),

  getExpiryAlerts: (params) =>
    axiosInstance.get(`${API_BASE}/staff/expiry-alerts`, { params, timeout: 30000 }),

  getSupplierPerformance: (params) =>
    axiosInstance.get(`${API_BASE}/staff/supplier-performance`, { params, timeout: 30000 })
}
