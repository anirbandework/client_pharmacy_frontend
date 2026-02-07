# Module-Specific Frontend Integration

Guide for integrating authentication with Customer Tracking, Daily Records, and Stock Audit modules.

---

## Overview

All modules now require authentication and automatically filter data by `shop_id` for staff users. Admin users can access all shops.

**Key Changes:**
- All API calls require `Authorization: Bearer <token>` header
- Staff see only their shop's data (automatic filtering)
- Admin can view/manage all shops
- Some endpoints require specific permissions

---

## 1. Customer Tracking Module

### Authentication Requirements

| Endpoint | Auth Required | Permission | Notes |
|----------|---------------|------------|-------|
| `POST /api/customers/quick-purchase` | ✅ Staff/Admin | `can_manage_customers` | Auto-adds shop_id |
| `GET /api/customers` | ✅ Staff/Admin | `can_manage_customers` | Filtered by shop_id |
| `GET /api/customers/reminders/pending` | ✅ Staff/Admin | `can_manage_customers` | Filtered by shop_id |
| `GET /api/customers/ai-analytics/comprehensive` | ✅ Staff/Admin | `can_view_analytics` | Filtered by shop_id |

### Frontend Changes

#### Before (No Auth)
```javascript
// Old way - no authentication
const customers = await fetch('http://localhost:8000/api/customers')
  .then(r => r.json());
```

#### After (With Auth)
```javascript
// New way - with authentication
const token = localStorage.getItem('auth_token');

const customers = await fetch('http://localhost:8000/api/customers', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
}).then(r => r.json());

// Staff automatically see only their shop's customers
// Admin sees all customers (or can filter by shop_id)
```

### React Example - Customer List

```jsx
// components/CustomerList.jsx
import { useAuth } from '../contexts/AuthContext';
import { useAPI } from '../hooks/useAPI';

export default function CustomerList() {
  const { user } = useAuth();
  const { data: customers, loading, error } = useAPI('/customers');

  // Check permission
  if (!user.can_manage_customers) {
    return <div>You don't have permission to view customers</div>;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Customers - {localStorage.getItem('shop_name')}</h2>
      <p>Total: {customers?.length}</p>
      {customers?.map(customer => (
        <div key={customer.id}>
          {customer.name} - {customer.phone}
        </div>
      ))}
    </div>
  );
}
```

### Quick Purchase with Auth

```javascript
async function addQuickPurchase(purchaseData) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('http://localhost:8000/api/customers/quick-purchase', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      phone: purchaseData.phone,
      name: purchaseData.name,
      category: 'first_time_prescription',
      items: purchaseData.items
      // shop_id is automatically added from token
    })
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('You do not have permission to add purchases');
    }
    throw new Error('Failed to add purchase');
  }

  return response.json();
}
```

### AI Analytics with Permission Check

```jsx
// components/CustomerAnalytics.jsx
import { useAuth } from '../contexts/AuthContext';

export default function CustomerAnalytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (user.can_view_analytics) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(
      'http://localhost:8000/api/customers/ai-analytics/comprehensive?days=30',
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    setAnalytics(await response.json());
  };

  if (!user.can_view_analytics) {
    return <div>Analytics access denied</div>;
  }

  return (
    <div>
      <h2>Customer Analytics</h2>
      {analytics && (
        <div>
          <p>Total Customers: {analytics.customer_behavior.total_customers}</p>
          <p>Repeat Rate: {analytics.customer_behavior.repeat_customer_rate}%</p>
        </div>
      )}
    </div>
  );
}
```

---

## 2. Daily Records Module

### Authentication Requirements

| Endpoint | Auth Required | Permission | Notes |
|----------|---------------|------------|-------|
| `POST /api/daily-records/` | ✅ Staff/Admin | None | Auto-adds shop_id |
| `GET /api/daily-records/` | ✅ Staff/Admin | None | Filtered by shop_id |
| `PUT /api/daily-records/{id}` | ✅ Staff/Admin | None | Can only edit own shop |
| `GET /api/daily-records/analytics/monthly/{year}/{month}` | ✅ Staff/Admin | `can_view_analytics` | Filtered by shop_id |
| `GET /api/daily-records/ai-analytics/comprehensive` | ✅ Staff/Admin | `can_view_analytics` | Filtered by shop_id |

### Frontend Changes

#### Create Daily Record

```javascript
async function createDailyRecord(recordData) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('http://localhost:8000/api/daily-records/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      date: recordData.date,
      day: recordData.day,
      cash_balance: recordData.cash_balance,
      actual_cash: recordData.actual_cash,
      online_sales: recordData.online_sales,
      // ... other fields
      // shop_id automatically added from token
      created_by: localStorage.getItem('user_name') // Optional
    })
  });

  return response.json();
}
```

#### Get Monthly Records

```jsx
// components/MonthlyRecords.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function MonthlyRecords({ year, month }) {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, [year, month]);

  const loadRecords = async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(
      `http://localhost:8000/api/daily-records/?start_date=${year}-${month}-01&end_date=${year}-${month}-31`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    const data = await response.json();
    setRecords(data);
    setLoading(false);
  };

  return (
    <div>
      <h2>Daily Records - {localStorage.getItem('shop_name')}</h2>
      <p>{year}/{month}</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Sales</th>
              <th>Cash Difference</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.id}>
                <td>{record.date}</td>
                <td>₹{record.total_sales}</td>
                <td>₹{record.sales_difference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

#### Update Record with Tracking

```javascript
async function updateDailyRecord(recordId, updates) {
  const token = localStorage.getItem('auth_token');
  const userName = localStorage.getItem('user_name'); // Store this on login
  
  const response = await fetch(
    `http://localhost:8000/api/daily-records/${recordId}?modified_by=${userName}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    }
  );

  if (response.status === 403) {
    throw new Error('You can only edit records from your shop');
  }

  return response.json();
}
```

#### AI Analytics Dashboard

```jsx
// components/DailyRecordsDashboard.jsx
export default function DailyRecordsDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (user.can_view_analytics) {
      loadAnalytics();
    }
  }, []);

  const loadAnalytics = async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(
      'http://localhost:8000/api/daily-records/ai-analytics/comprehensive?days=90',
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    setAnalytics(await response.json());
  };

  if (!user.can_view_analytics) {
    return <div>Analytics access denied</div>;
  }

  return (
    <div>
      <h2>AI Analytics - {localStorage.getItem('shop_name')}</h2>
      {analytics && (
        <>
          <div className="metrics">
            <div>Avg Daily Sales: ₹{analytics.trends?.sales_trend?.avg_daily_sales}</div>
            <div>Growth Rate: {analytics.trends?.sales_trend?.sales_growth_rate}%</div>
          </div>
          
          <div className="chart">
            {/* Use analytics.chart_data for visualizations */}
          </div>

          <div className="insights">
            <h3>AI Insights</h3>
            {analytics.ai_insights?.insights?.map((insight, i) => (
              <div key={i} className={`insight ${insight.priority}`}>
                <strong>{insight.category}:</strong> {insight.insight}
                <p>{insight.recommendation}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

---

## 3. Stock Audit Module

### Authentication Requirements

| Endpoint | Auth Required | Permission | Notes |
|----------|---------------|------------|-------|
| `POST /api/stock/items` | ✅ Staff/Admin | `can_manage_inventory` | Auto-adds shop_id |
| `GET /api/stock/items` | ✅ Staff/Admin | `can_manage_inventory` | Filtered by shop_id |
| `POST /api/stock/purchases` | ✅ Staff/Admin | `can_manage_inventory` | Auto-adds shop_id |
| `POST /api/stock/sales` | ✅ Staff/Admin | `can_manage_inventory` | Auto-adds shop_id |
| `GET /api/stock/audit/random-section` | ✅ Staff/Admin | `can_manage_inventory` | Filtered by shop_id |
| `PUT /api/stock/items/{id}/audit` | ✅ Staff/Admin | `can_manage_inventory` | Can only audit own shop |

### Frontend Changes

#### Add Stock Item

```javascript
async function addStockItem(itemData) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('http://localhost:8000/api/stock/items', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      section_id: itemData.section_id,
      item_name: itemData.item_name,
      batch_number: itemData.batch_number,
      quantity_software: itemData.quantity,
      unit_price: itemData.unit_price,
      expiry_date: itemData.expiry_date
      // shop_id automatically added from token
    })
  });

  if (response.status === 403) {
    throw new Error('You do not have permission to manage inventory');
  }

  return response.json();
}
```

#### Stock List with Permission Check

```jsx
// components/StockList.jsx
import { useAuth } from '../contexts/AuthContext';

export default function StockList() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user.can_manage_inventory) {
      loadItems();
    }
  }, [user]);

  const loadItems = async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch('http://localhost:8000/api/stock/items', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    setItems(await response.json());
    setLoading(false);
  };

  if (!user.can_manage_inventory) {
    return <div>You don't have permission to view inventory</div>;
  }

  return (
    <div>
      <h2>Stock Items - {localStorage.getItem('shop_name')}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Batch</th>
              <th>Software Qty</th>
              <th>Physical Qty</th>
              <th>Discrepancy</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.item_name}</td>
                <td>{item.batch_number}</td>
                <td>{item.quantity_software}</td>
                <td>{item.quantity_physical || '-'}</td>
                <td className={item.audit_discrepancy !== 0 ? 'warning' : ''}>
                  {item.audit_discrepancy}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

#### Random Audit Section

```jsx
// components/RandomAudit.jsx
export default function RandomAudit() {
  const { user } = useAuth();
  const [auditSection, setAuditSection] = useState(null);

  const getRandomSection = async () => {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(
      'http://localhost:8000/api/stock/audit/random-section',
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    setAuditSection(await response.json());
  };

  const submitAudit = async (itemId, physicalQty) => {
    const token = localStorage.getItem('auth_token');
    const userName = user.full_name;
    
    const response = await fetch(
      `http://localhost:8000/api/stock/items/${itemId}/audit?physical_quantity=${physicalQty}&audited_by=${userName}`,
      {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    return response.json();
  };

  if (!user.can_manage_inventory) {
    return <div>Inventory access denied</div>;
  }

  return (
    <div>
      <h2>Random Section Audit</h2>
      <button onClick={getRandomSection}>Get Random Section</button>
      
      {auditSection && (
        <div>
          <h3>{auditSection.section.section_name}</h3>
          <p>Items to audit: {auditSection.total_items}</p>
          
          {auditSection.items_to_audit.map(item => (
            <div key={item.id}>
              <p>{item.item_name} - Software: {item.quantity_software}</p>
              <input 
                type="number" 
                placeholder="Physical count"
                onBlur={(e) => submitAudit(item.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

#### Record Purchase

```javascript
async function recordPurchase(purchaseData) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch('http://localhost:8000/api/stock/purchases', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      purchase: {
        purchase_date: purchaseData.date,
        supplier_name: purchaseData.supplier,
        total_amount: purchaseData.total,
        recorded_by: localStorage.getItem('user_name')
        // shop_id automatically added
      },
      items: purchaseData.items.map(item => ({
        stock_item_id: item.stock_item_id,
        quantity: item.quantity,
        unit_cost: item.unit_cost,
        total_cost: item.total_cost
        // shop_id automatically added
      }))
    })
  });

  return response.json();
}
```

---

## Common Patterns Across All Modules

### 1. API Helper Function

```javascript
// utils/api.js
const API_BASE_URL = 'http://localhost:8000/api';

export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (response.status === 401) {
    localStorage.clear();
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  if (response.status === 403) {
    throw new Error('Permission denied');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Request failed');
  }

  return response.json();
}

// Usage
import { apiCall } from './utils/api';

const customers = await apiCall('/customers');
const record = await apiCall('/daily-records/', {
  method: 'POST',
  body: JSON.stringify(recordData)
});
```

### 2. Permission Check Component

```jsx
// components/PermissionGate.jsx
import { useAuth } from '../contexts/AuthContext';

export default function PermissionGate({ permission, children, fallback }) {
  const { user } = useAuth();

  if (!user) return null;

  // Check permission
  const hasPermission = permission ? user[permission] : true;

  if (!hasPermission) {
    return fallback || <div>Access Denied</div>;
  }

  return children;
}

// Usage
<PermissionGate permission="can_manage_inventory">
  <StockList />
</PermissionGate>

<PermissionGate permission="can_view_analytics">
  <AnalyticsDashboard />
</PermissionGate>
```

### 3. Shop Context Display

```jsx
// components/ShopHeader.jsx
export default function ShopHeader() {
  const shopName = localStorage.getItem('shop_name');
  const userType = localStorage.getItem('user_type');

  return (
    <header>
      <h1>{shopName || 'All Shops'}</h1>
      <span className="badge">{userType}</span>
    </header>
  );
}
```

### 4. Auto-Logout on Token Expiry

```javascript
// utils/tokenCheck.js
export function setupTokenCheck() {
  setInterval(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000;
        
        if (Date.now() >= expiry) {
          localStorage.clear();
          window.location.href = '/login';
        }
      } catch (e) {
        console.error('Invalid token');
      }
    }
  }, 60000); // Check every minute
}

// Call in App.jsx
useEffect(() => {
  setupTokenCheck();
}, []);
```

---

## Migration Checklist

### For Each Module:

- [ ] Add `Authorization: Bearer <token>` to all API calls
- [ ] Remove manual `shop_id` from request bodies (auto-added by backend)
- [ ] Add permission checks before showing UI elements
- [ ] Handle 401 (unauthorized) and 403 (forbidden) errors
- [ ] Display shop name in header for staff users
- [ ] Add loading states during authentication
- [ ] Clear localStorage on logout
- [ ] Test with both admin and staff accounts
- [ ] Verify data isolation (staff only see their shop)
- [ ] Test permission-based UI hiding

---

## Testing Guide

### Test Scenarios:

1. **Staff Login**
   - Login with staff UUID
   - Verify shop name displayed
   - Check only shop's data visible
   - Test permission restrictions

2. **Admin Login**
   - Login with admin credentials
   - Verify access to all shops
   - Test shop creation
   - Test staff management

3. **Permission Tests**
   - Staff without `can_view_analytics` → Analytics hidden
   - Staff without `can_manage_inventory` → Stock hidden
   - Staff without `can_manage_customers` → Customers hidden

4. **Data Isolation**
   - Create data as Staff A (Shop 1)
   - Login as Staff B (Shop 2)
   - Verify Staff B cannot see Staff A's data

5. **Token Expiry**
   - Wait 7 days or manually expire token
   - Verify auto-redirect to login

---

## Quick Reference

### Staff User Flow
```
1. Enter UUID → Login
2. Token stored with shop_id
3. All API calls include token
4. Backend filters by shop_id automatically
5. Staff sees only their shop's data
```

### Admin User Flow
```
1. Enter email/password → Login
2. Token stored (no shop_id)
3. Can view all shops
4. Can create shops and staff
5. Can filter by shop_id if needed
```

### API Call Pattern
```javascript
// Before
fetch('/api/customers')

// After
fetch('/api/customers', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

For complete examples, see `FRONTEND_INTEGRATION.md`.
