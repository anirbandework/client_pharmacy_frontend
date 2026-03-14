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

  const contentType = res.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  if (!res.ok) {
    let errorData = null;
    if (isJson) {
      try { errorData = await res.json(); } catch (_) {}
    }
    const error = new Error(errorData?.detail || errorData?.message || `Request failed: ${res.statusText}`);
    error.response = { data: errorData, status: res.status };
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

  getSentNotifications: async (shopCode = null, limit = 50) => {
    const params = new URLSearchParams({ limit });
    if (shopCode) params.set('shop_code', shopCode);
    const res = await fetch(`${API_BASE_URL}/api/notifications/admin/sent?${params}`, {
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
  },

  // Staff Request APIs
  sendStaffRequest: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/notifications/staff/request`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  getMyRequests: async (limit = 50) => {
    const res = await fetch(`${API_BASE_URL}/api/notifications/staff/my-requests?limit=${limit}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getAdminStaffRequests: async (shopCode = null, status = null, limit = 100) => {
    const params = new URLSearchParams({ limit });
    if (shopCode) params.set('shop_code', shopCode);
    if (status) params.set('status', status);
    const res = await fetch(`${API_BASE_URL}/api/notifications/admin/requests?${params}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  acknowledgeRequest: async (requestId) => {
    const res = await fetch(`${API_BASE_URL}/api/notifications/admin/requests/${requestId}/acknowledge`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  dismissRequest: async (requestId) => {
    const res = await fetch(`${API_BASE_URL}/api/notifications/admin/requests/${requestId}/dismiss`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};
