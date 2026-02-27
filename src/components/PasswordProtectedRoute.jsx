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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-primary-100">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Secure Access Required
              </h2>
              <p className="text-gray-600">
                Enter your password to access <span className="font-semibold text-primary-600">{moduleName}</span>
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">Why is this required?</p>
                  <p>This module contains sensitive information. Password verification is required when you're inside the shop for additional security.</p>
                </div>
              </div>
            </div>

            {/* Password Form */}
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your login password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    disabled={loading}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
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
            <p className="text-xs text-gray-500 text-center mt-6">
              This verification is valid for your current session while inside the shop
            </p>
          </div>
        </div>
      </div>
    )
  }

  // If verified, show the protected content
  return <>{children}</>
}

export default PasswordProtectedRoute
