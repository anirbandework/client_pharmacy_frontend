import axiosInstance from './axios'

const API_BASE = '/api/customers'

export const customerTrackingAPI = {
  // Contact Management
  uploadContacts: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return axiosInstance.post(`${API_BASE}/upload-contacts`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  getContacts: (params) => axiosInstance.get(`${API_BASE}/contacts`, { params }),
  addInteraction: (contactId, data) => axiosInstance.post(`${API_BASE}/contacts/${contactId}/interact`, data),
  addReminder: (contactId, data) => axiosInstance.post(`${API_BASE}/contacts/${contactId}/reminder`, data),
  updateContactStatus: (contactId, data) => axiosInstance.put(`${API_BASE}/contacts/${contactId}/status`, data),
  sendWhatsAppBulk: (data) => axiosInstance.post(`${API_BASE}/send-whatsapp-bulk`, data),

  // Staff Management
  getStaff: () => axiosInstance.get(`${API_BASE}/staff`),
  createStaff: (data) => axiosInstance.post(`${API_BASE}/staff`, data),
  assignContacts: (data) => axiosInstance.post(`${API_BASE}/assign-contacts`, data),
  getStaffTasks: (staffCode) => axiosInstance.get(`${API_BASE}/staff/${staffCode}/tasks`),

  // Customer Management
  createCustomer: (data) => axiosInstance.post(`${API_BASE}/customers`, data),
  getCustomer: (customerId) => axiosInstance.get(`${API_BASE}/customers/${customerId}`),
  getCustomerByPhone: (phone) => axiosInstance.get(`${API_BASE}/customers/phone/${phone}`),
  addVisit: (customerId, data) => axiosInstance.post(`${API_BASE}/customers/${customerId}/visit`, data),
  addPurchase: (customerId, data) => axiosInstance.post(`${API_BASE}/customers/${customerId}/purchase`, data),

  // Analytics
  getConversionReport: (params) => axiosInstance.get(`${API_BASE}/analytics/conversion-report`, { params }),
  getCustomerAnalytics: (params) => axiosInstance.get(`${API_BASE}/analytics/customer-analytics`, { params }),
  getDailySummary: (params) => axiosInstance.get(`${API_BASE}/analytics/daily-summary`, { params })
}
