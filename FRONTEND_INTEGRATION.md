# Frontend Integration Guide

Complete guide for integrating the Pharmacy Management System authentication with React, Vue, or any frontend framework.

---

## Table of Contents
1. [Quick Start](#quick-start)
2. [Authentication Flow](#authentication-flow)
3. [API Integration](#api-integration)
4. [React Implementation](#react-implementation)
5. [Vue Implementation](#vue-implementation)
6. [Vanilla JavaScript](#vanilla-javascript)
7. [Protected Routes](#protected-routes)
8. [Error Handling](#error-handling)

---

## Quick Start

### Base URL
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

### Token Storage
```javascript
// Store token
localStorage.setItem('auth_token', token);
localStorage.setItem('user_type', 'staff'); // or 'admin'
localStorage.setItem('shop_id', shopId);
localStorage.setItem('shop_name', shopName);

// Get token
const token = localStorage.getItem('auth_token');

// Clear token (logout)
localStorage.clear();
```

---

## Authentication Flow

### Admin Flow
```
1. Admin enters email + password
2. POST /api/auth/admin/login
3. Receive token + user_type: "admin"
4. Store token in localStorage
5. Redirect to admin dashboard
6. Admin can manage multiple shops
```

### Staff Flow
```
1. Staff enters UUID (no password)
2. POST /api/auth/staff/login
3. Receive token + shop_id + shop_name
4. Store token and shop context
5. Redirect to shop portal
6. All data automatically filtered by shop_id
```

---

## API Integration

### 1. Admin Login

```javascript
async function adminLogin(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  const data = await response.json();
  
  // Store auth data
  localStorage.setItem('auth_token', data.access_token);
  localStorage.setItem('user_type', data.user_type);
  
  return data;
}
```

### 2. Staff Login

```javascript
async function staffLogin(uuid) {
  const response = await fetch(`${API_BASE_URL}/auth/staff/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uuid }),
  });

  if (!response.ok) {
    throw new Error('Invalid UUID or staff inactive');
  }

  const data = await response.json();
  
  // Store auth data with shop context
  localStorage.setItem('auth_token', data.access_token);
  localStorage.setItem('user_type', data.user_type);
  localStorage.setItem('shop_id', data.shop_id);
  localStorage.setItem('shop_name', data.shop_name);
  
  return data;
}
```

### 3. Authenticated API Calls

```javascript
async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.clear();
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return response;
}
```

### 4. Get Current User

```javascript
async function getCurrentUser() {
  const userType = localStorage.getItem('user_type');
  const endpoint = userType === 'admin' ? '/auth/admin/me' : '/auth/staff/me';
  
  const response = await fetchWithAuth(endpoint);
  return response.json();
}
```

---

## React Implementation

### Auth Context

```jsx
// contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        localStorage.clear();
      }
    }
    setLoading(false);
  };

  const adminLogin = async (email, password) => {
    const data = await adminLoginAPI(email, password);
    await checkAuth();
    return data;
  };

  const staffLogin = async (uuid) => {
    const data = await staffLoginAPI(uuid);
    await checkAuth();
    return data;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, adminLogin, staffLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### Login Component

```jsx
// components/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [loginType, setLoginType] = useState('staff'); // 'staff' or 'admin'
  const [uuid, setUuid] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { adminLogin, staffLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (loginType === 'staff') {
        await staffLogin(uuid);
        navigate('/dashboard');
      } else {
        await adminLogin(email, password);
        navigate('/admin');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Pharmacy Management System</h2>
      
      <div className="login-type-toggle">
        <button 
          onClick={() => setLoginType('staff')}
          className={loginType === 'staff' ? 'active' : ''}
        >
          Staff Login
        </button>
        <button 
          onClick={() => setLoginType('admin')}
          className={loginType === 'admin' ? 'active' : ''}
        >
          Admin Login
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {loginType === 'staff' ? (
          <div>
            <label>Staff UUID</label>
            <input
              type="text"
              value={uuid}
              onChange={(e) => setUuid(e.target.value)}
              placeholder="Enter your UUID"
              required
            />
          </div>
        ) : (
          <>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pharmacy.com"
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
          </>
        )}

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
```

### Protected Route

```jsx
// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.user_type !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
```

### API Hook

```jsx
// hooks/useAPI.js
import { useState, useEffect } from 'react';

export function useAPI(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const fetchData = async () => {
    try {
      const response = await fetchWithAuth(endpoint, options);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchData };
}
```

### Usage Example

```jsx
// pages/Dashboard.jsx
import { useAuth } from '../contexts/AuthContext';
import { useAPI } from '../hooks/useAPI';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { data: customers, loading } = useAPI('/customers');

  return (
    <div>
      <header>
        <h1>Welcome, {user.full_name}</h1>
        <p>Shop: {localStorage.getItem('shop_name')}</p>
        <button onClick={logout}>Logout</button>
      </header>

      {loading ? (
        <p>Loading customers...</p>
      ) : (
        <div>
          <h2>Customers ({customers?.length})</h2>
          {/* Customer list */}
        </div>
      )}
    </div>
  );
}
```

---

## Vue Implementation

### Auth Store (Pinia)

```javascript
// stores/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token'),
    userType: localStorage.getItem('user_type'),
    shopId: localStorage.getItem('shop_id'),
    shopName: localStorage.getItem('shop_name'),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.userType === 'admin',
    isStaff: (state) => state.userType === 'staff',
  },

  actions: {
    async adminLogin(email, password) {
      const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Invalid credentials');

      const data = await response.json();
      this.setAuth(data);
      await this.fetchUser();
    },

    async staffLogin(uuid) {
      const response = await fetch(`${API_BASE_URL}/auth/staff/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid }),
      });

      if (!response.ok) throw new Error('Invalid UUID');

      const data = await response.json();
      this.setAuth(data);
      await this.fetchUser();
    },

    setAuth(data) {
      this.token = data.access_token;
      this.userType = data.user_type;
      this.shopId = data.shop_id;
      this.shopName = data.shop_name;

      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('user_type', data.user_type);
      if (data.shop_id) localStorage.setItem('shop_id', data.shop_id);
      if (data.shop_name) localStorage.setItem('shop_name', data.shop_name);
    },

    async fetchUser() {
      const endpoint = this.isAdmin ? '/auth/admin/me' : '/auth/staff/me';
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { 'Authorization': `Bearer ${this.token}` },
      });

      if (response.ok) {
        this.user = await response.json();
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.userType = null;
      this.shopId = null;
      this.shopName = null;
      localStorage.clear();
    },
  },
});
```

### Login Component

```vue
<!-- components/Login.vue -->
<template>
  <div class="login-container">
    <h2>Pharmacy Management System</h2>

    <div class="login-type-toggle">
      <button 
        @click="loginType = 'staff'" 
        :class="{ active: loginType === 'staff' }"
      >
        Staff Login
      </button>
      <button 
        @click="loginType = 'admin'" 
        :class="{ active: loginType === 'admin' }"
      >
        Admin Login
      </button>
    </div>

    <form @submit.prevent="handleLogin">
      <div v-if="loginType === 'staff'">
        <label>Staff UUID</label>
        <input v-model="uuid" type="text" placeholder="Enter your UUID" required />
      </div>

      <template v-else>
        <div>
          <label>Email</label>
          <input v-model="email" type="email" placeholder="admin@pharmacy.com" required />
        </div>
        <div>
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Enter password" required />
        </div>
      </template>

      <div v-if="error" class="error">{{ error }}</div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const loginType = ref('staff');
const uuid = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  try {
    if (loginType.value === 'staff') {
      await authStore.staffLogin(uuid.value);
      router.push('/dashboard');
    } else {
      await authStore.adminLogin(email.value, password.value);
      router.push('/admin');
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>
```

### Route Guard

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: () => import('@/views/Login.vue') },
    {
      path: '/dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      component: () => import('@/views/Admin.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
```

---

## Vanilla JavaScript

### Complete Implementation

```html
<!DOCTYPE html>
<html>
<head>
  <title>Pharmacy Login</title>
</head>
<body>
  <div id="app">
    <h2>Pharmacy Management System</h2>
    
    <div id="login-form">
      <select id="loginType">
        <option value="staff">Staff Login</option>
        <option value="admin">Admin Login</option>
      </select>

      <div id="staffFields">
        <input type="text" id="uuid" placeholder="Enter UUID" />
      </div>

      <div id="adminFields" style="display: none;">
        <input type="email" id="email" placeholder="Email" />
        <input type="password" id="password" placeholder="Password" />
      </div>

      <button onclick="handleLogin()">Login</button>
      <div id="error"></div>
    </div>

    <div id="dashboard" style="display: none;">
      <h3>Welcome, <span id="userName"></span></h3>
      <p>Shop: <span id="shopName"></span></p>
      <button onclick="logout()">Logout</button>
    </div>
  </div>

  <script>
    const API_BASE_URL = 'http://localhost:8000/api';

    // Toggle login fields
    document.getElementById('loginType').addEventListener('change', (e) => {
      const isStaff = e.target.value === 'staff';
      document.getElementById('staffFields').style.display = isStaff ? 'block' : 'none';
      document.getElementById('adminFields').style.display = isStaff ? 'none' : 'block';
    });

    // Login handler
    async function handleLogin() {
      const loginType = document.getElementById('loginType').value;
      const errorDiv = document.getElementById('error');
      errorDiv.textContent = '';

      try {
        let response;
        
        if (loginType === 'staff') {
          const uuid = document.getElementById('uuid').value;
          response = await fetch(`${API_BASE_URL}/auth/staff/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uuid }),
          });
        } else {
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
        }

        if (!response.ok) throw new Error('Login failed');

        const data = await response.json();
        
        // Store auth data
        localStorage.setItem('auth_token', data.access_token);
        localStorage.setItem('user_type', data.user_type);
        if (data.shop_id) localStorage.setItem('shop_id', data.shop_id);
        if (data.shop_name) localStorage.setItem('shop_name', data.shop_name);

        // Show dashboard
        await loadDashboard();
      } catch (error) {
        errorDiv.textContent = error.message;
      }
    }

    // Load dashboard
    async function loadDashboard() {
      const token = localStorage.getItem('auth_token');
      const userType = localStorage.getItem('user_type');
      const endpoint = userType === 'admin' ? '/auth/admin/me' : '/auth/staff/me';

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const user = await response.json();

      document.getElementById('userName').textContent = user.full_name;
      document.getElementById('shopName').textContent = 
        localStorage.getItem('shop_name') || 'All Shops';
      
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
    }

    // Logout
    function logout() {
      localStorage.clear();
      document.getElementById('login-form').style.display = 'block';
      document.getElementById('dashboard').style.display = 'none';
    }

    // Check if already logged in
    if (localStorage.getItem('auth_token')) {
      loadDashboard();
    }
  </script>
</body>
</html>
```

---

## Protected Routes

### Fetch Customers (Staff - Auto-filtered by shop)

```javascript
async function getCustomers() {
  const response = await fetchWithAuth('/customers');
  return response.json();
  // Returns only customers from staff's shop
}
```

### Fetch Daily Records (Staff)

```javascript
async function getDailyRecords(startDate, endDate) {
  const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
  const response = await fetchWithAuth(`/daily-records?${params}`);
  return response.json();
  // Returns only records from staff's shop
}
```

### Admin - View All Shops

```javascript
async function getAdminShops() {
  const response = await fetchWithAuth('/auth/admin/shops');
  return response.json();
}
```

### Admin - Create Staff for Shop

```javascript
async function createStaff(shopId, staffData) {
  const response = await fetchWithAuth(`/auth/admin/shops/${shopId}/staff`, {
    method: 'POST',
    body: JSON.stringify(staffData),
  });
  return response.json();
}
```

---

## Error Handling

### Global Error Handler

```javascript
async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Handle different error codes
    if (response.status === 401) {
      // Unauthorized - token expired
      localStorage.clear();
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    if (response.status === 403) {
      // Forbidden - insufficient permissions
      throw new Error('You do not have permission to perform this action.');
    }

    if (response.status === 404) {
      throw new Error('Resource not found.');
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'An error occurred');
    }

    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

---

## Complete Flow Example

### 1. Staff Login → View Customers → Add Purchase

```javascript
// 1. Staff logs in
const loginData = await staffLogin('917b7037-b692-4a2b-be30-29328db4002f');
console.log('Logged into shop:', loginData.shop_name);

// 2. Get customers (auto-filtered by shop)
const customers = await fetchWithAuth('/customers').then(r => r.json());
console.log('Customers in my shop:', customers.length);

// 3. Add quick purchase
const purchaseData = {
  phone: '+1234567890',
  name: 'John Doe',
  category: 'first_time_prescription',
  items: [{
    medicine_name: 'Paracetamol',
    quantity: 10,
    unit_price: 5.0,
    total_amount: 50.0,
    is_generic: true,
    duration_days: 7
  }]
};

const result = await fetchWithAuth('/customers/quick-purchase', {
  method: 'POST',
  body: JSON.stringify(purchaseData),
}).then(r => r.json());

console.log('Purchase recorded:', result);
```

### 2. Admin Login → Create Shop → Add Staff

```javascript
// 1. Admin logs in
await adminLogin('admin@pharmacy.com', 'admin123');

// 2. Create new shop
const shopData = {
  shop_name: 'Downtown Pharmacy',
  shop_code: 'DTP001',
  address: '456 Downtown St',
  phone: '+1234567890'
};

const shop = await fetchWithAuth('/auth/admin/shops', {
  method: 'POST',
  body: JSON.stringify(shopData),
}).then(r => r.json());

console.log('Shop created:', shop);

// 3. Add staff to shop
const staffData = {
  full_name: 'Jane Smith',
  role: 'staff',
  can_view_analytics: true,
  can_manage_inventory: true
};

const staff = await fetchWithAuth(`/auth/admin/shops/${shop.id}/staff`, {
  method: 'POST',
  body: JSON.stringify(staffData),
}).then(r => r.json());

console.log('Staff UUID:', staff.uuid);
// Give this UUID to Jane Smith for login
```

---

## Testing Credentials

Use these for testing:

```javascript
// Admin Login
{
  email: "admin@pharmacy.com",
  password: "admin123"
}

// Staff Login (Shop Manager)
{
  uuid: "d6bf746d-4602-452b-ae12-02bf8505224a"
}

// Staff Login (Regular Staff)
{
  uuid: "917b7037-b692-4a2b-be30-29328db4002f"
}
```

---

## Best Practices

1. **Always use HTTPS in production**
2. **Store tokens in httpOnly cookies** (more secure than localStorage)
3. **Implement token refresh** before expiry
4. **Add loading states** for better UX
5. **Handle network errors** gracefully
6. **Clear sensitive data** on logout
7. **Validate inputs** before API calls
8. **Show meaningful error messages** to users
9. **Implement request timeouts**
10. **Add request/response interceptors** for logging

---

## Next Steps

1. Implement the login page
2. Add protected routes
3. Create admin dashboard for shop management
4. Build staff portal with shop-specific data
5. Add permission checks in UI
6. Implement token refresh logic
7. Add loading and error states
8. Test multi-tenant data isolation

For complete API documentation, see `/api/docs` (Swagger UI).
