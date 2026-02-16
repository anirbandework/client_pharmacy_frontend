const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
});

const handleResponse = async (res) => {
  if (res.status === 401 || res.status === 403) {
    localStorage.clear();
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }
  if (!res.ok) throw new Error(`Request failed: ${res.statusText}`);
  return res.json();
};

export const notificationsApi = {
  // Admin APIs
  sendNotification: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/notifications/admin/send`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  getSentNotifications: async (limit = 50) => {
    const res = await fetch(`${API_BASE_URL}/api/notifications/admin/sent?limit=${limit}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getNotificationStats: async (notificationId) => {
    const res = await fetch(`${API_BASE_URL}/api/notifications/admin/stats/${notificationId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Staff APIs
  getStaffNotifications: async (includeRead = false, limit = 50) => {
    const res = await fetch(`${API_BASE_URL}/api/notifications/staff/list?include_read=${includeRead}&limit=${limit}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  markAsRead: async (notificationId) => {
    const res = await fetch(`${API_BASE_URL}/api/notifications/staff/read/${notificationId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getUnreadCount: async () => {
    const res = await fetch(`${API_BASE_URL}/api/notifications/staff/unread-count`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};
