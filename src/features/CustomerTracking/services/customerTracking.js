import axiosInstance from './axios'

const API_BASE = '/api/customers'

export const customerTrackingAPI = {
  // Contact Management
  uploadContacts: (file, uploadedBy) => {
    const formData = new FormData()
    formData.append('file', file)
    return axiosInstance.post(`${API_BASE}/upload-contacts`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { uploaded_by: uploadedBy }
    })
  },
  getContacts: (params) => axiosInstance.get(`${API_BASE}/contacts`, { params }),
  addInteraction: (contactId, data) => axiosInstance.post(`${API_BASE}/contacts/${contactId}/interact`, data),
  addReminder: (contactId, data) => axiosInstance.post(`${API_BASE}/contacts/${contactId}/reminder`, data),
  updateContactStatus: (contactId, status, notes = '') => axiosInstance.put(`${API_BASE}/contacts/${contactId}/status`, null, { params: { status, notes } }),
  sendWhatsAppBulk: (data) => axiosInstance.post(`${API_BASE}/send-whatsapp-bulk`, null, { params: data }),

  // Staff Management
  getStaff: () => axiosInstance.get(`${API_BASE}/staff`),
  createStaff: (data) => axiosInstance.post(`${API_BASE}/staff`, data),
  assignContacts: (data) => axiosInstance.post(`${API_BASE}/assign-contacts`, data),
  getStaffTasks: (staffCode) => axiosInstance.get(`${API_BASE}/staff/${staffCode}/tasks`),

  // Customer Management
  quickPurchase: (data) => axiosInstance.post(`${API_BASE}/quick-purchase`, data),
  createCustomer: (data) => axiosInstance.post(`${API_BASE}/customers`, data),
  getCustomer: (customerId) => axiosInstance.get(`${API_BASE}/customers/${customerId}`),
  getCustomerByPhone: (phone) => axiosInstance.get(`${API_BASE}/customers/phone/${phone}`),
  addVisit: (customerId, data) => axiosInstance.post(`${API_BASE}/customers/${customerId}/visit`, data),
  addPurchase: (customerId, data) => axiosInstance.post(`${API_BASE}/customers/${customerId}/purchase`, data),

  // Refill Reminders
  getPendingReminders: (params) => axiosInstance.get(`${API_BASE}/reminders/pending`, { params }),
  sendReminderNotification: (reminderId) => axiosInstance.post(`${API_BASE}/reminders/${reminderId}/notify`),

  // Analytics
  getDailySummary: (params) => axiosInstance.get(`${API_BASE}/analytics/daily-summary`, { params }),
  getAIAnalytics: (days = 30) => axiosInstance.get(`${API_BASE}/ai-analytics/comprehensive`, { params: { days } })
}
