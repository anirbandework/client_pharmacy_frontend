const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
});

export const distributorApi = {
  // Shop search
  searchShops: async (query) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/distributors/shops/search?q=${encodeURIComponent(query)}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to search shops');
    return response.json();
  },

  // Invoice management
  createInvoice: async (invoiceData) => {
    const response = await fetch(`${API_BASE_URL}/api/distributor-invoices/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(invoiceData)
    });
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error('Failed to create invoice');
      error.response = { data: errorData };
      throw error;
    }
    return response.json();
  },

  getMyInvoices: async () => {
    const response = await fetch(`${API_BASE_URL}/api/distributor-invoices/my-invoices`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch invoices');
    return response.json();
  },

  // Profile management
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/distributors/profile/me`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/distributors/profile/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  }
};