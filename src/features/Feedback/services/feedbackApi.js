import axiosInstance from '../../StockAudit/services/axios'

const API_BASE = '/api/feedback'

export const feedbackAPI = {
  submitFeedback: (data) => axiosInstance.post(`${API_BASE}/user/feedback`, data),
  getMyFeedback: () => axiosInstance.get(`${API_BASE}/my-feedback`),
  getUnreadCount: () => axiosInstance.get(`${API_BASE}/my-feedback/unread-count`),
  markAsRead: (feedbackId) => axiosInstance.put(`${API_BASE}/my-feedback/${feedbackId}/mark-read`),
  getAllFeedback: (params) => axiosInstance.get(`${API_BASE}/super-admin/all-feedback`, { params }),
  respondToFeedback: (feedbackId, data) => axiosInstance.put(`${API_BASE}/super-admin/feedback/${feedbackId}`, data),
  getFeedbackStats: () => axiosInstance.get(`${API_BASE}/super-admin/feedback-stats`)
}
