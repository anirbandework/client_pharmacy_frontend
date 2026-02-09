# Salary Management - Quick Reference

## 🚀 Quick Start

### Admin Access
```
URL: /salary-management
Role: admin
Sidebar: "Salary Management"
```

### Staff Access
```
URL: /my-salary
Role: staff
Sidebar: "My Salary"
```

## 📡 API Quick Reference

### Import
```javascript
import { salaryAPI } from './services/salaryApi'
```

### Admin Calls
```javascript
// Dashboard
const { data } = await salaryAPI.getDashboard()

// Get Records
const { data } = await salaryAPI.getSalaryRecords({ month: 2, year: 2026 })

// Pay Salary
await salaryAPI.paySalary(recordId, { paid_by_admin: 'admin', notes: 'Paid' })

// View QR
const { data } = await salaryAPI.getStaffPaymentInfo(staffId)

// Alerts
const { data } = await salaryAPI.getAlerts()
await salaryAPI.dismissAlert(alertId)
```

### Staff Calls
```javascript
// My Profile
const { data } = await salaryAPI.getMyProfile()

// My History
const { data } = await salaryAPI.getMyHistory()

// Update Payment Info
await salaryAPI.updateMyPaymentInfo({
  upi_id: 'user@upi',
  preferred_payment_method: 'upi'
})

// Upload QR
await salaryAPI.uploadMyQRCode(file)
```

## 🎨 Component Usage

### Admin Component
```javascript
import AdminSalaryManagement from './features/SalaryManagement/AdminSalaryManagement'

<Route path="/salary-management" element={<AdminSalaryManagement />} />
```

### Staff Component
```javascript
import StaffSalaryProfile from './features/SalaryManagement/StaffSalaryProfile'

<Route path="/my-salary" element={<StaffSalaryProfile />} />
```

## 🎯 Key Functions

### Status Colors
```javascript
const getStatusColor = (status) => {
  const colors = {
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-100 text-red-700'
  }
  return colors[status] || colors.pending
}
```

### Month Names
```javascript
const monthNames = [...Array(12)].map((_, i) => 
  new Date(2024, i).toLocaleString('default', { month: 'long' })
)
```

## 📊 Data Structures

### Dashboard Response
```typescript
{
  total_staff: number
  pending_payments: number
  overdue_payments: number
  upcoming_payments: number
  total_pending_amount: number
  total_overdue_amount: number
  alerts: Alert[]
}
```

### Salary Record
```typescript
{
  id: number
  staff_id: number
  month: number
  year: number
  salary_amount: number
  payment_status: 'paid' | 'pending' | 'overdue'
  payment_date: string | null
  paid_by_admin: string | null
  due_date: string
  notes: string
}
```

### Payment Info
```typescript
{
  id: number
  staff_id: number
  upi_id: string
  qr_code_path: string
  bank_account: string
  ifsc_code: string
  account_holder_name: string
  preferred_payment_method: 'upi' | 'bank_transfer' | 'cash'
}
```

## 🔧 Common Tasks

### Add Salary Record (Admin)
```javascript
await salaryAPI.createSalaryRecord({
  staff_id: 5,
  month: 2,
  year: 2026,
  salary_amount: 10000,
  due_date: '2026-02-05'
})
```

### Pay Salary (Admin)
```javascript
await salaryAPI.paySalary(recordId, {
  paid_by_admin: localStorage.getItem('username'),
  notes: 'Paid via UPI'
})
```

### Update Payment Info (Staff)
```javascript
await salaryAPI.updateMyPaymentInfo({
  upi_id: 'staff@upi',
  bank_account: '1234567890',
  ifsc_code: 'BANK0001234',
  account_holder_name: 'Staff Name',
  preferred_payment_method: 'upi'
})
```

### Upload QR Code (Staff)
```javascript
const handleUpload = async (e) => {
  const file = e.target.files[0]
  await salaryAPI.uploadMyQRCode(file)
}
```

## 🐛 Debugging

### Check Auth
```javascript
console.log('Token:', localStorage.getItem('access_token'))
console.log('User Type:', localStorage.getItem('user_type'))
```

### API Errors
```javascript
try {
  await salaryAPI.someMethod()
} catch (err) {
  console.error('API Error:', err.response?.data?.detail)
}
```

### Network Issues
```
1. Check backend is running (http://localhost:8000)
2. Check /docs for API status
3. Verify JWT token is valid
4. Check browser console for errors
```

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) {
  /* Single column layout */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1024px) {
  /* 2 column layout */
}

/* Desktop */
@media (min-width: 1024px) {
  /* 4 column layout */
}
```

## 🎨 Tailwind Classes Used

### Cards
```
bg-white rounded-xl shadow-md p-4 border border-primary-100
```

### Buttons
```
px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700
```

### Status Badges
```
px-2 py-1 rounded-full text-xs font-semibold
```

### Modals
```
fixed inset-0 bg-black/50 flex items-center justify-center z-50
```

## 🔐 Security Notes

- All APIs require JWT authentication
- Token auto-attached in axios interceptor
- Staff can only access own data
- Admin has full access
- File uploads validated on backend

## 📞 Support

**Issues?**
1. Check README.md for detailed docs
2. Check IMPLEMENTATION_SUMMARY.md for status
3. Review API docs at /docs
4. Check browser console
5. Verify backend is running
