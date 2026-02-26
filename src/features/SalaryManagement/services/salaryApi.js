import axiosInstance from './axios'

const API_BASE = '/api/salary'

// Helper to get shop_code from localStorage for admin
const getShopCodeParam = () => {
  const userType = localStorage.getItem('user_type')
  const shopCode = localStorage.getItem('selected_shop_code')
  return userType === 'admin' && shopCode ? { shop_code: shopCode } : {}
}

export const salaryAPI = {
  // Admin APIs
  getDashboard: () => axiosInstance.get(`${API_BASE}/dashboard`, { params: getShopCodeParam() }),
  createSalaryRecord: (data) => axiosInstance.post(`${API_BASE}/records`, data, { params: getShopCodeParam() }),
  getSalaryRecords: (params) => axiosInstance.get(`${API_BASE}/records`, { params: { ...params, ...getShopCodeParam() } }),
  paySalary: (recordId, data) => axiosInstance.put(`${API_BASE}/records/${recordId}/pay`, data, { params: getShopCodeParam() }),
  getStaffProfile: (staffId) => axiosInstance.get(`${API_BASE}/staff/${staffId}/profile`, { params: getShopCodeParam() }),
  getStaffHistory: (staffId) => axiosInstance.get(`${API_BASE}/staff/${staffId}/history`, { params: getShopCodeParam() }),
  getStaffPaymentInfo: (staffId) => axiosInstance.get(`${API_BASE}/staff/${staffId}/payment-info`, { params: getShopCodeParam() }),
  getStaffQRCode: (staffId) => axiosInstance.get(`${API_BASE}/staff/${staffId}/qr-code`, { responseType: 'blob', params: getShopCodeParam() }),
  getAlerts: () => axiosInstance.get(`${API_BASE}/alerts`, { params: getShopCodeParam() }),
  dismissAlert: (alertId) => axiosInstance.put(`${API_BASE}/alerts/${alertId}/dismiss`, {}, { params: getShopCodeParam() }),
  getMonthlySummary: (year, month) => axiosInstance.get(`${API_BASE}/monthly-summary/${year}/${month}`, { params: getShopCodeParam() }),
  generateMonthlyRecords: (year, month) => axiosInstance.post(`${API_BASE}/generate-monthly-records/${year}/${month}`, {}, { params: getShopCodeParam() }),

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
