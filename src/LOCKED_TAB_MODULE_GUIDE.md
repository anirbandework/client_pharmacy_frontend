# Locked Tab & Module System — Implementation Guide

This document explains how the premium lock system works and exactly how to apply it to any new page.

---

## How It Works (Overview)

There are **two levels** of locking:

| Level | What it locks | Where it's handled |
|---|---|---|
| **Module lock** | Entire page/module | Sidebar (`LockedModuleModal`) |
| **Tab lock** | Individual tabs within a page | Inside the page component |

### Module Lock (Sidebar)
- The backend returns ALL modules for the user's type, even disabled ones, with `locked: true`
- The Sidebar shows locked modules with an amber lock badge
- Clicking a locked module opens `LockedModuleModal` — **no navigation happens**
- This works automatically for all pages — **no page-level change needed for module lock**

### Tab Lock (Page Level)
- `useTabPermissions(moduleKey)` returns both `isTabEnabled()` and `isTabLocked()`
- `isTabLocked(tabKey)` returns `true` when the tab is explicitly set to `false` in RBAC
- Locked tabs show in the tab bar with an amber lock badge
- Clicking a locked tab shows the real component **blurred** with an upgrade card floating on top

---

## Step-by-Step: Add Tab Locking to a Page

### Step 1 — Import the hook and icons

```jsx
import useTabPermissions from '../../hooks/useTabPermissions'
import { Lock, Crown, Star } from 'lucide-react'
// adjust relative path based on file location
```

### Step 2 — Replace `isTabEnabled` with both functions

```jsx
// BEFORE
const { isTabEnabled, isLoaded } = useTabPermissions('your_module_key')

// AFTER
const { isTabEnabled, isTabLocked, isLoaded } = useTabPermissions('your_module_key')
```

### Step 3 — Show ALL tabs (remove filter, use allTabs directly)

```jsx
// BEFORE
const tabs = allTabs.filter(t => isTabEnabled(t.id))
// ... rendered from `tabs`

// AFTER — iterate allTabs directly (no filter)
// ... rendered from `allTabs`
```

### Step 4 — Add the `LockedTabOverlay` component (copy-paste, no imports needed)

Paste this above your page component:

```jsx
const LockedTabOverlay = ({ tab }) => (
  <div
    className="absolute inset-0 z-10 flex items-start justify-center px-4 pt-10"
    style={{ backdropFilter: 'blur(2px)', background: 'rgba(255,255,255,0.45)' }}
  >
    <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-2xl p-8 text-center w-full max-w-md">
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
            <Lock className="w-7 h-7 text-indigo-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
            <Crown className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">Premium Feature</h3>
      <p className="text-sm font-semibold text-indigo-600 mb-3 flex items-center justify-center gap-1.5">
        <tab.icon className="w-4 h-4" />
        {tab.label}
      </p>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        This tab is not included in your current plan. Upgrade to unlock{' '}
        <strong className="text-gray-700">{tab.label}</strong> and get access to powerful analytics & tools.
      </p>
      <div className="bg-indigo-50 rounded-xl p-4 mb-6 text-left space-y-2">
        {['Full access to all premium tabs', 'Priority support & updates', 'Advanced analytics & insights'].map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-indigo-700">
            <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" fill="currentColor" />
            {f}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400">
        Contact your administrator or reach out to us to upgrade your plan.
      </p>
    </div>
  </div>
)
```

### Step 5 — Update the tab bar buttons

Replace the tab button render with this pattern:

```jsx
{allTabs.map((tab) => {
  const locked = isTabLocked(tab.id)
  const active = activeTab === tab.id
  return (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`relative py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
        active
          ? locked
            ? 'text-white bg-gradient-to-r from-gray-500 to-gray-600 shadow-lg'
            : 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20'
          : locked
            ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      <tab.icon className="w-4 h-4" />
      <span className="hidden sm:inline">{tab.label}</span>
      {locked && (
        <span className="ml-0.5 inline-flex items-center justify-center w-4 h-4 bg-amber-400 rounded-full flex-shrink-0">
          <Lock className="w-2.5 h-2.5 text-white" />
        </span>
      )}
    </button>
  )
})}
```

> **Note:** If your tab bar uses `dark:` Tailwind variants, add them back to the non-locked state classes.

### Step 6 — Wrap the content area

Replace your content `div` with this pattern:

```jsx
<div className="animate-fade-in space-y-4 pb-20">
  <div className="relative">
    {/* Real component always rendered — blurred when locked */}
    <div className={isTabLocked(activeTab) ? 'pointer-events-none select-none blur-sm' : ''}>
      <ErrorBoundary key={activeTab}>
        {activeTab === 'tab1' && <Tab1Component />}
        {activeTab === 'tab2' && <Tab2Component />}
        {/* ... all your tabs */}
      </ErrorBoundary>
    </div>

    {/* Upgrade card floats on top of blurred content */}
    {isTabLocked(activeTab) && (
      <LockedTabOverlay tab={allTabs.find(t => t.id === activeTab)} />
    )}
  </div>
</div>
```

---

## Checklist

- [ ] `useTabPermissions` destructures `isTabLocked`
- [ ] Tab bar iterates `allTabs` (not filtered)
- [ ] Tab buttons have lock badge when `isTabLocked(tab.id)`
- [ ] Active locked tab gets grey gradient (not blue)
- [ ] Content `div` has `relative` wrapper
- [ ] Blurred `div` has `pointer-events-none select-none blur-sm` when locked
- [ ] `LockedTabOverlay` rendered absolutely on top when `isTabLocked(activeTab)`
- [ ] `LockedTabOverlay` component defined above the page component
- [ ] `Lock`, `Crown`, `Star` imported from `lucide-react`

---

## Reference: Module Keys

These are the RBAC module keys used in `useTabPermissions(moduleKey)`:

| Page | Module Key | User Type |
|---|---|---|
| Billing (staff) | `billing` | staff |
| Stock Audit (staff) | `stock_audit` | staff |
| Purchase Invoice (staff) | `purchase_invoice` | staff |
| My Attendance (staff) | `attendance_staff` | staff |
| My Notifications (staff) | `my_notifications` | staff |
| My Salary (staff) | `my_salary` | staff |
| Invoice Analytics (admin) | `invoice_analytics` | admin |
| Stock Analytics (admin) | `stock_analytics` | admin |
| Billing Analytics (admin) | `billing_analytics` | admin |
| Attendance (admin) | `attendance_admin` | admin |
| Notifications (admin) | `notifications_admin` | admin |
| Payroll (admin) | `salary_management` | admin |

---

## Already Implemented

- `src/features/PurchaseInvoice/admin_purchase_invoice_page.jsx` — full tab lock ✅
- `src/hooks/useTabPermissions.js` — exposes `isTabLocked` ✅
- `src/components/Sidebar.jsx` — shows lock badge, opens modal on click ✅
- `src/components/LockedModuleGuard.jsx` — reusable page-level guard (optional) ✅
