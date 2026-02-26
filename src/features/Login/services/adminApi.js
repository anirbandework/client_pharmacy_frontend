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

export const superAdminApi = {
  sendOTP: async (phone, password) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/super-admin/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });
    return handleResponse(res);
  },

  verifyOTP: async (phone, otpCode) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/super-admin/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp_code: otpCode })
    });
    return handleResponse(res);
  },

  getAllAdmins: async () => {
    const res = await fetch(`${API_BASE_URL}/api/auth/super-admin/admins`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getAllAdminsByOrg: async (orgId) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/super-admin/admins/organization/${orgId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getDashboard: async () => {
    const res = await fetch(`${API_BASE_URL}/api/auth/super-admin/dashboard`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  createAdmin: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/super-admin/admins`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  updateAdmin: async (adminId, data) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/super-admin/admins/${adminId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  deleteAdmin: async (adminId) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/super-admin/admins/${adminId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  updateShop: async (shopId, data) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/super-admin/shops/${shopId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  deleteShop: async (shopId) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/super-admin/shops/${shopId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  updateStaff: async (staffId, data) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/super-admin/staff/${staffId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  deleteStaff: async (staffId) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/super-admin/staff/${staffId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
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

  createStaff: async (shopCode, data) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/admin/shops/code/${shopCode}/staff`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  getShopStaff: async (shopCode) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/shops/code/${shopCode}/staff`, {
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
