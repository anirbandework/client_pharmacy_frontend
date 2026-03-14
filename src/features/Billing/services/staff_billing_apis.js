import axiosInstance from './axios'

const API_BASE = '/api/billing'

export const billingAPI = {
  getShopConfig: () => axiosInstance.get(`${API_BASE}/shop/bill-config`),
  
  getAdminShopConfig: () => axiosInstance.get(`${API_BASE}/admin/bill-config`),
  
  updateAdminShopConfig: (config) => axiosInstance.put(`${API_BASE}/admin/bill-config`, config),
  
  searchMedicines: (searchTerm, limit = 20) => 
    axiosInstance.get(`${API_BASE}/search-medicines`, { params: { q: searchTerm, limit } }),
  
  createBill: (data) => axiosInstance.post(`${API_BASE}/bills`, data),
  
  getBills: (params) => axiosInstance.get(`${API_BASE}/bills`, { params }),
  
  getBill: (billId) => axiosInstance.get(`${API_BASE}/bills/${billId}`),
  
  getBillByNumber: (billNumber) => axiosInstance.get(`${API_BASE}/bills/number/${billNumber}`),
  
  deleteBill: (billId) => axiosInstance.delete(`${API_BASE}/bills/${billId}`),
  
  getSummary: (params) => axiosInstance.get(`${API_BASE}/summary`, { params }),
  
  getTopSelling: (params) => axiosInstance.get(`${API_BASE}/top-selling`, { params }),
  
  getCustomerHistory: (customerPhone, limit = 50) => 
    axiosInstance.get(`${API_BASE}/customer-history/${customerPhone}`, { params: { limit } }),
  
  getDailySales: (days = 7) => axiosInstance.get(`${API_BASE}/daily-sales`, { params: { days } }),
  
  getUserGuide: () => axiosInstance.get(`${API_BASE}/user-guide`),
  
  exportBills: (params) => axiosInstance.get(`${API_BASE}/export/bills`, { params, responseType: 'blob' }),

  getProfitAnalysis: (params) => axiosInstance.get(`${API_BASE}/profit-analysis`, { params })
}
