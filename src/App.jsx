import React, { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'
import ProtectedRoute from './components/ProtectedRoute'
import WiFiHeartbeatService from './features/Attendance/components/WiFiHeartbeatService'
import './App.css'

const Welcome = lazy(() => import('./features/Welcome'))
const PrivacyPolicy = lazy(() => import('./features/Welcome/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./features/Welcome/TermsOfService'))
const Support = lazy(() => import('./features/Welcome/Support'))
const SuperAdminLogin = lazy(() => import('./features/Welcome/SuperAdminLogin'))
const StaffPurchaseInvoicePage = lazy(() => import('./features/PurchaseInvoice/staff_purchase_invoice_page'))
const AdminPurchaseInvoicePage = lazy(() => import('./features/PurchaseInvoice/admin_purchase_invoice_page'))
const AdminStockAnalytics = lazy(() => import('./features/StockAudit/admin_stock_audit_page'))
const AdminBillingAnalytics = lazy(() => import('./features/Billing/AdminAnalytics'))
const StockAudit = lazy(() => import('./features/StockAudit/staff_stock_audit_page'))
const Billing = lazy(() => import('./features/Billing'))
const CustomerTracking = lazy(() => import('./features/CustomerTracking'))
const Attendance = lazy(() => import('./features/Attendance'))
const MyAttendance = lazy(() => import('./features/Attendance/MyAttendance'))
const AdminDashboard = lazy(() => import('./features/Admin&SuperAdmin/index_admin'))
const SuperAdminDashboard = lazy(() => import('./features/Admin&SuperAdmin/index_super-admin'))
const AdminNotifications = lazy(() => import('./features/Notifications'))
const StaffNotificationsPage = lazy(() => import('./features/Notifications/StaffNotificationsPage'))
const AdminSalaryManagement = lazy(() => import('./features/SalaryManagement/components/AdminSalaryManagement'))
const StaffSalaryProfile = lazy(() => import('./features/SalaryManagement/components/StaffSalaryProfile'))
const SuperAdminFeedback = lazy(() => import('./features/Feedback/components/SuperAdminFeedback'))
const MyFeedback = lazy(() => import('./features/Feedback/components/MyFeedback'))
const RBAC = lazy(() => import('./features/RBAC'))
const DistributorDashboard = lazy(() => import('./features/Distributor'))
const DistributorProfile = lazy(() => import('./features/Distributor/ProfilePage'))
const Unauthorized = lazy(() => import('./pages/Unauthorized'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false
    }
  }
})

function App() {
  const [userType, setUserType] = useState(localStorage.getItem('user_type'))

  useEffect(() => {
    // Check localStorage periodically for login/logout changes
    const checkUserType = () => {
      const currentUserType = localStorage.getItem('user_type')
      if (currentUserType !== userType) {
        setUserType(currentUserType)
      }
    }
    
    const interval = setInterval(checkUserType, 1000)
    return () => clearInterval(interval)
  }, [userType])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ErrorBoundary>
          <Toaster position="top-right" />
          {userType === 'staff' && <WiFiHeartbeatService />}
          <Router>
            <div className="min-h-screen">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Welcome />} />
                  <Route path="/login" element={<Welcome />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/super-admin-login" element={<SuperAdminLogin />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/super-admin" element={<SuperAdminDashboard />} />
                  <Route path="/rbac" element={<RBAC />} />
                  <Route path="/feedback-management" element={<SuperAdminFeedback />} />
                  <Route path="/my-feedback" element={<MyFeedback />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="/notifications" element={<ProtectedRoute requiredModule="notifications_admin"><AdminNotifications /></ProtectedRoute>} />
                  <Route path="/my-notifications" element={<ProtectedRoute requiredModule="my_notifications"><StaffNotificationsPage /></ProtectedRoute>} />
                  <Route path="/purchase-invoice" element={<ProtectedRoute requiredModule="purchase_invoice"><StaffPurchaseInvoicePage /></ProtectedRoute>} />
                  <Route path="/invoice-analytics" element={<ProtectedRoute requiredModule="invoice_analytics"><AdminPurchaseInvoicePage /></ProtectedRoute>} />
                  <Route path="/stock-analytics" element={<ProtectedRoute requiredModule="stock_analytics"><AdminStockAnalytics /></ProtectedRoute>} />
                  <Route path="/stock-audit" element={<ProtectedRoute requiredModule="stock_audit"><StockAudit /></ProtectedRoute>} />
                  <Route path="/billing-analytics" element={<ProtectedRoute requiredModule="billing_analytics"><AdminBillingAnalytics /></ProtectedRoute>} />
                  <Route path="/billing" element={<ProtectedRoute requiredModule="billing"><Billing /></ProtectedRoute>} />
                  <Route path="/customer-tracking" element={<ProtectedRoute requiredModule="customer_tracking"><CustomerTracking /></ProtectedRoute>} />
                  <Route path="/my-attendance" element={<ProtectedRoute requiredModule="attendance_staff"><MyAttendance /></ProtectedRoute>} />
                  <Route path="/attendance" element={<ProtectedRoute requiredModule="attendance_admin"><Attendance /></ProtectedRoute>} />
                  <Route path="/salary-management" element={<ProtectedRoute requiredModule="salary_management"><AdminSalaryManagement /></ProtectedRoute>} />
                  <Route path="/my-salary" element={<ProtectedRoute requiredModule="my_salary"><StaffSalaryProfile /></ProtectedRoute>} />
                  <Route path="/distributor" element={<DistributorDashboard />} />
                  <Route path="/distributor/profile" element={<DistributorProfile />} />
                </Routes>
              </Suspense>
            </div>
          </Router>
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
