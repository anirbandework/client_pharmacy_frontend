# RBAC Frontend Implementation

## Overview
Complete Role-Based Access Control (RBAC) frontend system that dynamically manages module permissions per organization. SuperAdmin can configure which modules are accessible to admins and staff for each organization.

## Architecture

### Folder Structure
```
src/features/RBAC/
├── components/
│   └── OrganizationPermissions.jsx  # SuperAdmin UI for managing permissions
├── services/
│   ├── axios.js                     # Axios instance with interceptors
│   └── rbacApi.js                   # API service methods
└── index.jsx                        # Main RBAC page component
```

## Features

### 1. Dynamic Sidebar Navigation
- **Location**: `src/components/Sidebar.jsx`
- **Functionality**: 
  - Fetches user permissions from `/api/rbac/my-permissions`
  - Dynamically renders navigation items based on accessible modules
  - SuperAdmin gets hardcoded items (Super Admin, RBAC, Feedback)
  - Admin/Staff get filtered modules based on organization permissions

### 2. Organization Permissions Management
- **Component**: `OrganizationPermissions.jsx`
- **Features**:
  - Select organization from list
  - View all available modules
  - Toggle admin_enabled/staff_enabled per module
  - Search modules by name
  - Reset organization to defaults (all enabled)
  - Real-time permission updates

### 3. API Integration
- **Service**: `rbacApi.js`
- **Endpoints**:
  - `GET /api/rbac/my-permissions` - Get current user's accessible modules
  - `GET /api/rbac/modules` - Get all modules (SuperAdmin only)
  - `GET /api/rbac/organization/{org_id}/permissions` - Get org permissions
  - `PUT /api/rbac/organization/{org_id}/module/{module_id}` - Update permission
  - `POST /api/rbac/organization/{org_id}/reset-defaults` - Reset to defaults

## Module Configuration

### Supported Modules
```javascript
{
  'billing': { path: '/billing', icon: Receipt },
  'customer_tracking': { path: '/customer-tracking', icon: UserCheck },
  'purchase_invoice': { path: '/purchase-invoice', icon: ShoppingCart },
  'stock_audit': { path: '/stock-audit', icon: Package },
  'attendance': { path: '/attendance', icon: Clock },
  'my_notifications': { path: '/my-notifications', icon: Bell },
  'my_salary': { path: '/my-salary', icon: Wallet },
  'admin_panel': { path: '/admin', icon: Settings },
  'notifications_admin': { path: '/notifications', icon: Bell },
  'salary_management': { path: '/salary-management', icon: Wallet },
  'rbac': { path: '/rbac', icon: Shield }
}
```

## User Flow

### SuperAdmin
1. Login as SuperAdmin
2. Navigate to RBAC from sidebar
3. Select organization
4. View all modules with current permissions
5. Toggle admin_enabled/staff_enabled for each module
6. Changes apply immediately

### Admin/Staff
1. Login as Admin or Staff
2. Sidebar automatically fetches accessible modules
3. Only enabled modules appear in navigation
4. Disabled modules are completely hidden

## UI Components

### OrganizationPermissions Component
- **Organization Selector**: Grid of organization cards
- **Module List**: Each module shows:
  - Display name and description
  - Admin toggle (green when enabled)
  - Staff toggle (blue when enabled)
- **Search Bar**: Filter modules by name
- **Reset Button**: Restore all modules to enabled state

### Styling
- Gradient header (purple/indigo theme)
- Responsive grid layout
- Toggle buttons with color-coded states
- Toast notifications for all actions
- Loading states and error handling

## Integration Points

### 1. Sidebar.jsx
```javascript
// Fetches permissions on mount
useEffect(() => {
  fetchPermissions()
}, [])

// SuperAdmin bypass
if (userType === 'super_admin') {
  setNavItems([...hardcodedItems])
  return
}

// Dynamic module loading
const response = await axios.get('/api/rbac/my-permissions')
const items = response.data.modules.map(m => ({
  id: m.name,
  label: m.display_name,
  path: moduleConfig[m.name].path,
  icon: moduleConfig[m.name].icon
}))
```

### 2. App.jsx
```javascript
// Added RBAC route
<Route path="/rbac" element={<RBAC />} />
```

## API Response Format

### GET /api/rbac/my-permissions
```json
{
  "user_type": "staff",
  "organization_id": 1,
  "shop_id": 5,
  "modules": [
    {
      "id": 1,
      "name": "billing",
      "display_name": "Billing System",
      "description": "Customer billing & invoice management"
    }
  ]
}
```

### GET /api/rbac/organization/{org_id}/permissions
```json
{
  "organization_id": 1,
  "permissions": [
    {
      "module_id": 1,
      "module_name": "billing",
      "admin_enabled": true,
      "staff_enabled": true
    }
  ]
}
```

## Error Handling

### Axios Interceptors
- **401**: Session expired, prompt re-login
- **403**: Access denied (SuperAdmin only)
- **404**: Resource not found
- **500**: Server error
- **Network**: Connection issues

### Fallback Behavior
- If RBAC API fails, sidebar shows empty state
- SuperAdmin always gets hardcoded navigation
- Toast notifications for all errors

## Security

### Access Control
- RBAC page only accessible to SuperAdmin
- Backend validates user_type on all endpoints
- JWT token required for all API calls
- Organization-level isolation enforced

### Token Management
- Token stored in localStorage
- Automatically attached to all requests
- Interceptor handles expired tokens

## Testing Checklist

### SuperAdmin
- [ ] Can access /rbac page
- [ ] Can view all organizations
- [ ] Can toggle admin_enabled
- [ ] Can toggle staff_enabled
- [ ] Can search modules
- [ ] Can reset to defaults
- [ ] Changes persist after refresh

### Admin
- [ ] Sidebar shows only enabled modules
- [ ] Cannot access disabled modules
- [ ] Permissions update without re-login
- [ ] RBAC page not accessible

### Staff
- [ ] Sidebar shows only enabled modules
- [ ] Cannot access disabled modules
- [ ] Permissions update without re-login
- [ ] RBAC page not accessible

## Future Enhancements

1. **Bulk Operations**: Enable/disable all modules at once
2. **Permission History**: Track who changed what and when
3. **Module Groups**: Group related modules for easier management
4. **Custom Roles**: Create custom role templates
5. **Permission Preview**: Preview sidebar before applying changes
6. **Audit Logs**: Track all permission changes

## Troubleshooting

### Sidebar not updating
- Check browser console for API errors
- Verify JWT token is valid
- Clear localStorage and re-login

### Modules not appearing
- Verify module is enabled in database
- Check organization_module_permissions table
- Ensure module name matches moduleConfig

### SuperAdmin can't access RBAC
- Verify user_type is 'super_admin'
- Check route is registered in App.jsx
- Verify backend RBAC routes are mounted

## Dependencies

- **react**: ^18.x
- **react-router-dom**: ^6.x
- **axios**: ^1.x
- **react-hot-toast**: ^2.x
- **lucide-react**: ^0.x

## Environment Variables

```env
VITE_API_URL=http://localhost:8000
```

## Deployment Notes

1. Ensure backend RBAC routes are deployed
2. Run database migrations for RBAC tables
3. Seed default modules in production
4. Test SuperAdmin access after deployment
5. Verify CORS settings allow frontend domain
