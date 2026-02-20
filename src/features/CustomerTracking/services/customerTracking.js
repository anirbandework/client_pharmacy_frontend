import axiosInstance from '../../../features/Billing/services/axios'

const API_BASE = '/api/customer-tracking'

export const customerTrackingAPI = {
  // Contact Records
  uploadContacts: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return axiosInstance.post(`${API_BASE}/contacts/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  getContacts: (params) => axiosInstance.get(`${API_BASE}/contacts`, { params }),
  
  updateContact: (contactId, data) => axiosInstance.put(`${API_BASE}/contacts/${contactId}`, data),
  
  assignContacts: (staffIds, contactStatus = 'pending') => 
    axiosInstance.post(`${API_BASE}/contacts/assign`, { staff_ids: staffIds, contact_status: contactStatus }),
  
  addInteraction: (contactId, data) => 
    axiosInstance.post(`${API_BASE}/contacts/${contactId}/interactions`, data),
  
  addReminder: (contactId, data) => 
    axiosInstance.post(`${API_BASE}/contacts/${contactId}/reminders`, data),
  
  markContactYellow: (contactId) => 
    axiosInstance.post(`${API_BASE}/contacts/${contactId}/mark-yellow`),
  
  // Customers
  createCustomer: (data) => axiosInstance.post(`${API_BASE}/customers`, data),
  
  getCustomers: (params) => axiosInstance.get(`${API_BASE}/customers`, { params }),
  
  getCustomerByPhone: (phone) => axiosInstance.get(`${API_BASE}/customers/phone/${phone}`),
  
  updateCustomer: (customerId, data) => axiosInstance.put(`${API_BASE}/customers/${customerId}`, data),
  
  // Refill Reminders
  getRefillReminders: (daysAhead = 0) => 
    axiosInstance.get(`${API_BASE}/refill-reminders`, { params: { days_ahead: daysAhead } }),
  
  markReminderSent: (reminderId, method) => 
    axiosInstance.post(`${API_BASE}/refill-reminders/${reminderId}/mark-sent`, null, { params: { method } }),
  
  // Reports
  getConversionReport: (params) => axiosInstance.get(`${API_BASE}/reports/conversion`, { params })
}
