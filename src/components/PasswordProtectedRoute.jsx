import React, { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { attendanceAPI } from '../features/Attendance/services/attendanceApi'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const PasswordProtectedRoute = ({ children, moduleName }) => {
  const [isVerified, setIsVerified] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isInsideShop, setIsInsideShop] = useState(false)
  const [checkingLocation, setCheckingLocation] = useState(true)
  const [error, setError] = useState('')
  const userType = localStorage.getItem('user_type')

  useEffect(() => {
    // Skip password protection for admin users
    if (userType === 'admin') {
      setCheckingLocation(false)
      setIsInsideShop(false)
      return
    }
    
    checkShopLocation()
    const interval = setInterval(checkShopLocation, 10000) // Check every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const checkShopLocation = async () => {
    try {
      const response = await attendanceAPI.getWiFiStatus()
      const inside = response.data?.is_inside_geofence || false
      setIsInsideShop(inside)
      
      // If user leaves shop, reset verification
      if (!inside && isVerified) {
        setIsVerified(false)
        setPassword('')
        toast.error('You have left the shop. Please verify again when inside.')
      }
    } catch (error) {
      console.error('Error checking location:', error)
      setIsInsideShop(false)
    } finally {
      setCheckingLocation(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    
    if (!password.trim()) {
      setError('Please enter your password')
      return
    }

    setLoading(true)
    setError('')
    try {
      await api.post('/auth/staff/verify-password', { password })
      setIsVerified(true)
      setPassword('')
      toast.success('Password verified successfully')
    } catch (error) {
      setError(error.response?.data?.detail || 'Invalid password')
    } finally {
      setLoading(false)
    }
  }

  // Show loading while checking location
  if (checkingLocation) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/20 border-t-blue-500"></div>
        </div>
      </div>
    )
  }

  // If not inside shop, no password protection needed
  if (!isInsideShop) {
    return <>{children}</>
  }

  // If inside shop and not verified, show password prompt
  if (!isVerified) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-y-auto">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Animated Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-20 sm:pt-24">
          <div className="max-w-md w-full">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6 sm:p-8">
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-3 sm:mb-4 shadow-lg">
                  <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-slate-100" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-2">
                  Secure Access Required
                </h2>
                <p className="text-sm sm:text-base text-slate-400">
                  Enter your password to access <span className="font-semibold text-blue-400">{moduleName}</span>
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-blue-300">
                    <p className="font-semibold mb-1">Why is this required?</p>
                    <p>This module contains sensitive information. Password verification is required when you're inside the shop for additional security.</p>
                  </div>
                </div>
              </div>

              {/* Password Form */}
              <form onSubmit={handleVerify} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your login password"
                      className="w-full px-4 py-2.5 sm:py-3 pr-12 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      disabled={loading}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {error && (
                    <p className="mt-2 text-xs sm:text-sm text-red-400">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-slate-100 py-2.5 sm:py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-100 border-t-transparent"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Verify & Continue</span>
                    </>
                  )}
                </button>
              </form>

              {/* Footer Note */}
              <p className="text-xs text-slate-500 text-center mt-4 sm:mt-6">
                This verification is valid for your current session while inside the shop
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If verified, show the protected content
  return <>{children}</>
}

export default PasswordProtectedRoute
