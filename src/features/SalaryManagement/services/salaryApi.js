import axiosInstance from './axios'

const API_BASE = '/api/salary'

export const salaryAPI = {
  // Admin APIs
  getDashboard: () => axiosInstance.get(`${API_BASE}/dashboard`),
  createSalaryRecord: (data) => axiosInstance.post(`${API_BASE}/records`, data),
  getSalaryRecords: (params) => axiosInstance.get(`${API_BASE}/records`, { params }),
  paySalary: (recordId, data) => axiosInstance.put(`${API_BASE}/records/${recordId}/pay`, data),
  getStaffProfile: (staffId) => axiosInstance.get(`${API_BASE}/staff/${staffId}/profile`),
  getStaffHistory: (staffId) => axiosInstance.get(`${API_BASE}/staff/${staffId}/history`),
  getStaffPaymentInfo: (staffId) => axiosInstance.get(`${API_BASE}/staff/${staffId}/payment-info`),
  getStaffQRCode: (staffId) => axiosInstance.get(`${API_BASE}/staff/${staffId}/qr-code`, { responseType: 'blob' }),
  getAlerts: () => axiosInstance.get(`${API_BASE}/alerts`),
  dismissAlert: (alertId) => axiosInstance.put(`${API_BASE}/alerts/${alertId}/dismiss`),
  getMonthlySummary: (year, month) => axiosInstance.get(`${API_BASE}/monthly-summary/${year}/${month}`),
  generateMonthlyRecords: (year, month) => axiosInstance.post(`${API_BASE}/generate-monthly-records/${year}/${month}`),

  // Staff APIs
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
