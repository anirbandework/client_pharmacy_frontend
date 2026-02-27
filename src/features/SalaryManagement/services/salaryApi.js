import axiosInstance from './axios'

const API_BASE = '/api/salary'
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Helper to get shop_code parameter for admin
const getShopCodeParam = (shopCode) => {
  const userType = localStorage.getItem('user_type')
  return userType === 'admin' && shopCode ? { shop_code: shopCode } : {}
}

export const salaryAPI = {
  // Admin APIs
  getDashboard: (shopCode) => axiosInstance.get(`${API_BASE}/dashboard`, { params: getShopCodeParam(shopCode) }),
  createSalaryRecord: (data, shopCode) => axiosInstance.post(`${API_BASE}/records`, data, { params: getShopCodeParam(shopCode) }),
  getSalaryRecords: (params, shopCode) => axiosInstance.get(`${API_BASE}/records`, { params: { ...params, ...getShopCodeParam(shopCode) } }),
  paySalary: (recordId, data, shopCode) => axiosInstance.put(`${API_BASE}/records/${recordId}/pay`, data, { params: getShopCodeParam(shopCode) }),
  getStaffProfile: (staffId, shopCode) => axiosInstance.get(`${API_BASE}/staff/${staffId}/profile`, { params: getShopCodeParam(shopCode) }),
  getStaffHistory: (staffId, shopCode) => axiosInstance.get(`${API_BASE}/staff/${staffId}/history`, { params: getShopCodeParam(shopCode) }),
  getStaffPaymentInfo: (staffId, shopCode) => axiosInstance.get(`${API_BASE}/staff/${staffId}/payment-info`, { params: getShopCodeParam(shopCode) }),
  getStaffQRCode: (staffId, shopCode) => axiosInstance.get(`${API_BASE}/staff/${staffId}/qr-code`, { responseType: 'blob', params: getShopCodeParam(shopCode) }),
  getAlerts: (shopCode) => axiosInstance.get(`${API_BASE}/alerts`, { params: getShopCodeParam(shopCode) }),
  dismissAlert: (alertId, shopCode) => axiosInstance.put(`${API_BASE}/alerts/${alertId}/dismiss`, {}, { params: getShopCodeParam(shopCode) }),
  getMonthlySummary: (year, month, shopCode) => axiosInstance.get(`${API_BASE}/monthly-summary/${year}/${month}`, { params: getShopCodeParam(shopCode) }),
  generateMonthlyRecords: (year, month, shopCode) => axiosInstance.post(`${API_BASE}/generate-monthly-records/${year}/${month}`, {}, { params: getShopCodeParam(shopCode) }),

  // Staff APIs (no shop_code needed - from JWT token)
  getMyProfile: () => axiosInstance.get(`${API_BASE}/my-profile`),
  getMyHistory: () => axiosInstance.get(`${API_BASE}/my-history`),
  getMyPaymentInfo: () => axiosInstance.get(`${API_BASE}/my-payment-info`),
  updateMyPaymentInfo: (data) => axiosInstance.put(`${API_BASE}/my-payment-info`, data),
  uploadMyQRCode: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return axiosInstance.post(`${API_BASE}/my-qr-code`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}