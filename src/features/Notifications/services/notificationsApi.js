const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
});

const handleResponse = async (res) => {
  console.log('Response status:', res.status);
  console.log('Response headers:', res.headers);
  
  if (res.status === 401 || res.status === 403) {
    localStorage.clear();
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }
  
  const contentType = res.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  console.log('Is JSON:', isJson);
  
  if (!res.ok) {
    let errorData = null;
    if (isJson) {
      try {
        errorData = await res.json();
        console.log('Error data:', errorData);
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
    }
    
    const error = new Error(errorData?.detail || errorData?.message || errorData?.error || `Request failed: ${res.statusText}`);
    error.response = { data: errorData };
    console.log('Throwing error:', error);
    throw error;
  }
  
  return isJson ? res.json() : res.text();
};

export const notificationsApi = {
  // Admin APIs
  sendNotification: async (data) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/admin/send`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
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
