import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'
import './App.css'

const Welcome = lazy(() => import('./features/Welcome'))
const DailyRecords = lazy(() => import('./features/DailyRecords'))
const CustomerTracking = lazy(() => import('./features/CustomerTracking'))
const StockAudit = lazy(() => import('./features/StockAudit'))
const AdminDashboard = lazy(() => import('./features/Admin'))

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
                  <Route path="/daily-records" element={<DailyRecords />} />
                  <Route path="/customer-tracking" element={<CustomerTracking />} />
                  <Route path="/stock-audit" element={<StockAudit />} />
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
