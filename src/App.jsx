import React, { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'
import WiFiHeartbeatService from './features/Attendance/components/WiFiHeartbeatService'
import './App.css'

const Welcome = lazy(() => import('./features/Welcome'))
const SuperAdminLogin = lazy(() => import('./features/Welcome/SuperAdminLogin'))
const PurchaseInvoice = lazy(() => import('./features/PurchaseInvoice'))
const StockAudit = lazy(() => import('./features/StockAudit'))
const Billing = lazy(() => import('./features/Billing'))
const CustomerTracking = lazy(() => import('./features/CustomerTracking'))
const Attendance = lazy(() => import('./features/Attendance'))
const AdminDashboard = lazy(() => import('./features/Login'))
const SuperAdminDashboard = lazy(() => import('./features/Login/SuperAdminDashboard'))
const AdminNotifications = lazy(() => import('./features/Notifications'))
const StaffNotificationsPage = lazy(() => import('./features/Notifications/StaffNotificationsPage'))
const AdminSalaryManagement = lazy(() => import('./features/SalaryManagement/components/AdminSalaryManagement'))
const StaffSalaryProfile = lazy(() => import('./features/SalaryManagement/components/StaffSalaryProfile'))
const SuperAdminFeedback = lazy(() => import('./features/feedback/components/SuperAdminFeedback'))
const MyFeedback = lazy(() => import('./features/feedback/components/MyFeedback'))

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
                  <Route path="/super-admin-login" element={<SuperAdminLogin />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/super-admin" element={<SuperAdminDashboard />} />
                  <Route path="/feedback-management" element={<SuperAdminFeedback />} />
                  <Route path="/my-feedback" element={<MyFeedback />} />
                  <Route path="/notifications" element={<AdminNotifications />} />
                  <Route path="/my-notifications" element={<StaffNotificationsPage />} />
                  <Route path="/purchase-invoice" element={<PurchaseInvoice />} />
                  <Route path="/stock-audit" element={<StockAudit />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/customer-tracking" element={<CustomerTracking />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/salary-management" element={<AdminSalaryManagement />} />
                  <Route path="/my-salary" element={<StaffSalaryProfile />} />
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
