import { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { attendanceAPI } from '../features/Attendance/services/attendanceApi'
import { useTheme } from '../contexts/ThemeContext'

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
  const { isDark } = useTheme()
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
    const interval = setInterval(checkShopLocation, 30000) // Check every 30s (was 10s)
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
      <div className="fixed inset-0" style={{ background: isDark ? '#010c1a' : '#f0f6ff', transition: 'background 0.4s ease' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: isDark ? 'linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)' : 'linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px)', backgroundSize: '36px 36px' }}></div>
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
      <div className="fixed inset-0 overflow-y-auto" style={{ background: isDark ? '#010c1a' : '#f0f6ff', transition: 'background 0.4s ease' }}>
        {/* Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: isDark ? 'linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)' : 'linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px)', backgroundSize: '36px 36px' }}></div>

        {/* Animated Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full animate-pulse" style={{ background: isDark ? 'radial-gradient(circle, rgba(59,130,246,0.13) 0%, transparent 68%)' : 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 68%)', filter: 'blur(45px)' }}></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full animate-pulse" style={{ background: isDark ? 'radial-gradient(circle, rgba(99,102,241,0.11) 0%, transparent 68%)' : 'radial-gradient(circle, rgba(99,102,241,0.16) 0%, transparent 68%)', filter: 'blur(55px)', animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-20 sm:pt-24">
          <div className="max-w-md w-full">
            <div className="backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8" style={{ background: isDark ? 'rgba(30,41,59,0.5)' : 'rgba(255,255,255,0.85)', border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(59,130,246,0.12)', transition: 'background 0.4s ease, border-color 0.4s ease' }}>
              {/* Header */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-3 sm:mb-4 shadow-lg">
                  <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>
                  Secure Access Required
                </h2>
                <p className="text-sm sm:text-base" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                  Enter your password to access <span className="font-semibold" style={{ color: isDark ? '#60a5fa' : '#2563eb' }}>{moduleName}</span>
                </p>
              </div>

              {/* Info Box */}
              <div className="rounded-xl p-3 sm:p-4 mb-4 sm:mb-6" style={{ background: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(219,234,254,0.8)', border: isDark ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(147,197,253,0.8)' }}>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" style={{ color: isDark ? '#60a5fa' : '#3b82f6' }} />
                  <div className="text-xs sm:text-sm" style={{ color: isDark ? '#93c5fd' : '#1d4ed8' }}>
                    <p className="font-semibold mb-1">Why is this required?</p>
                    <p>This module contains sensitive information. Password verification is required when you're inside the shop for additional security.</p>
                  </div>
                </div>
              </div>

              {/* Password Form */}
              <form onSubmit={handleVerify} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: isDark ? '#cbd5e1' : '#374151' }}>
                    Your Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your login password"
                      className="w-full px-4 py-2.5 sm:py-3 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      style={{ background: isDark ? 'rgba(2,6,23,0.5)' : '#ffffff', border: isDark ? '1px solid rgba(51,65,85,1)' : '1px solid #d1d5db', color: isDark ? '#e2e8f0' : '#1e293b' }}
                      disabled={loading}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: isDark ? '#94a3b8' : '#9ca3af' }}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {error && (
                    <p className="mt-2 text-xs sm:text-sm" style={{ color: isDark ? '#f87171' : '#ef4444' }}>{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
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
              <p className="text-xs text-center mt-4 sm:mt-6" style={{ color: isDark ? '#64748b' : '#9ca3af' }}>
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
