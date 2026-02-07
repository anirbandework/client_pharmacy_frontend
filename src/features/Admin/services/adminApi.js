const API_BASE_URL = 'http://localhost:8000';

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

export const adminApi = {
  register: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/admin/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  getProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/api/auth/admin/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getShops: async () => {
    const res = await fetch(`${API_BASE_URL}/api/auth/admin/shops`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  createShop: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/admin/shops`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  getShop: async (shopId) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/admin/shops/${shopId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  updateShop: async (shopId, data) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/admin/shops/${shopId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  deleteShop: async (shopId) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/admin/shops/${shopId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  createStaff: async (shopId, data) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/admin/shops/${shopId}/staff`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  getShopStaff: async (shopId) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/shops/${shopId}/staff`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  updateStaff: async (staffId, data) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/staff/${staffId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  deleteStaff: async (staffId) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/staff/${staffId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};
