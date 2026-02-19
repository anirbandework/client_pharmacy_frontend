import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'
import './App.css'

const Welcome = lazy(() => import('./features/Welcome'))
const PurchaseInvoice = lazy(() => import('./features/PurchaseInvoice'))
const CustomerTracking = lazy(() => import('./features/CustomerTracking'))
const StockAudit = lazy(() => import('./features/StockAudit'))
const Billing = lazy(() => import('./features/Billing'))
const Attendance = lazy(() => import('./features/Attendance'))
const AdminDashboard = lazy(() => import('./features/Login'))
const SuperAdminDashboard = lazy(() => import('./features/Login/SuperAdminDashboard'))
const AdminNotifications = lazy(() => import('./features/Notifications'))
const StaffNotificationsPage = lazy(() => import('./features/Notifications/StaffNotificationsPage'))
const AdminSalaryManagement = lazy(() => import('./features/SalaryManagement/components/AdminSalaryManagement'))
const StaffSalaryProfile = lazy(() => import('./features/SalaryManagement/components/StaffSalaryProfile'))
const SuperAdminFeedback = lazy(() => import('./features/Feedback/components/SuperAdminFeedback'))
const MyFeedback = lazy(() => import('./features/Feedback/components/MyFeedback'))

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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ErrorBoundary>
          <Router>
            <div className="min-h-screen">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Welcome />} />
                  <Route path="/login" element={<Welcome />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/super-admin" element={<SuperAdminDashboard />} />
                  <Route path="/feedback-management" element={<SuperAdminFeedback />} />
                  <Route path="/my-feedback" element={<MyFeedback />} />
                  <Route path="/notifications" element={<AdminNotifications />} />
                  <Route path="/my-notifications" element={<StaffNotificationsPage />} />
                  <Route path="/purchase-invoice" element={<PurchaseInvoice />} />
                  <Route path="/customer-tracking" element={<CustomerTracking />} />
                  <Route path="/stock-audit" element={<StockAudit />} />
                  <Route path="/billing" element={<Billing />} />
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
