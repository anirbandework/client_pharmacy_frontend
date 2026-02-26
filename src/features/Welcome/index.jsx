import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import OTPInput from '../../components/OTPInput'
import { ArrowRight, ArrowLeft, Lock, User, BarChart3, Package, Users, Search, DollarSign, TrendingUp, Shield, Eye, EyeOff, Info } from 'lucide-react'

const Welcome = () => {
  const navigate = useNavigate()
  const { adminSendOTP, adminVerifyOTP, adminSignup, staffSendOTP, staffVerifyOTP, staffSignup, superAdminSendOTP, superAdminVerifyOTP } = useAuth()
  const [loginType, setLoginType] = useState('staff')
  const [isNewUser, setIsNewUser] = useState(false)
  const [step, setStep] = useState('credentials')
  const [uuid, setUuid] = useState('')
  const [phone, setPhone] = useState('+91')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')

    if (isNewUser && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      if (isNewUser) {
        // Signup flow
        if (loginType === 'admin') {
          await adminSignup(phone, password)
        } else if (loginType === 'staff') {
          await staffSignup(phone, password)
        }
      } else {
        // Login flow
        if (loginType === 'super_admin') {
          await superAdminSendOTP(phone, password)
        } else if (loginType === 'staff') {
          await staffSendOTP(phone, password)
        } else {
          await adminSendOTP(phone, password)
        }
      }
      setStep('otp')
      setCountdown(30)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (loginType === 'staff') {
        await staffVerifyOTP(phone, otp)
        navigate('/billing')
      } else if (loginType === 'super_admin') {
        await superAdminVerifyOTP(phone, otp)
        navigate('/super-admin')
      } else {
        // Admin login - check if SuperAdmin phone
        const normalizedPhone = phone.replace(/\D/g, '')
        const isSuperAdmin = normalizedPhone.endsWith('9383169659') || normalizedPhone.endsWith('9643579321')
        
        if (isSuperAdmin) {
          // Auto-upgrade to SuperAdmin
          await superAdminVerifyOTP(phone, otp)
          navigate('/super-admin')
        } else {
          await adminVerifyOTP(phone, otp)
          navigate('/admin')
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = () => {
    setOtp('')
    setStep('credentials')
  }

  const resetForm = () => {
    setStep('credentials')
    setOtp('')
    setError('')
    setIsNewUser(false)
    setConfirmPassword('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 relative overflow-hidden flex items-center lg:items-start justify-center pt-0 lg:pt-8">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[120rem] mx-auto px-4 md:px-6 py-4 md:py-8 flex lg:flex-row flex-col gap-6 md:gap-12 items-start">
        {/* Left Side - About Section */}
        <div className="hidden lg:block flex-1 space-y-4 md:space-y-6 animate-fade-in-up">
          {/* Header Card */}
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 md:p-6 shadow-xl">
            <h2 className="text-2xl md:text-4xl font-bold text-center">
              <span className="bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent">XPert-Pharma</span>
            </h2>
            <p className="text-center text-white/90 text-base md:text-lg mt-2">Complete Pharmacy Management Solution</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 text-sm">Daily Records</h3>
                  <p className="text-xs text-blue-100 leading-relaxed">Track sales & cash flow</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Package className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 text-sm">Invoice Tracking</h3>
                  <p className="text-xs text-blue-100 leading-relaxed">Monitor stock & expiry alerts</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <Users className="w-6 h-6 text-green-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 text-sm">Staff Management</h3>
                  <p className="text-xs text-blue-100 leading-relaxed">Manage employees & attendance</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <Search className="w-6 h-6 text-yellow-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 text-sm">Stock Audit</h3>
                  <p className="text-xs text-blue-100 leading-relaxed">Audit trails & analytics</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-indigo-500/20 rounded-xl">
                  <DollarSign className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 text-sm">Salary Processing</h3>
                  <p className="text-xs text-blue-100 leading-relaxed">Automated salary calculations</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-pink-500/20 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-pink-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 text-sm">Analytics & Reports</h3>
                  <p className="text-xs text-blue-100 leading-relaxed">Performance metrics & insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden lg:block self-stretch">
          <div className="h-full w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-[500px] animate-fade-in self-center" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
            {/* Logo and Tagline */}
            <div className="bg-white rounded-2xl p-4 md:p-6 mb-6 text-center">
              <img src="/vite.jpg" alt="Xpert-Pharma" className="h-12 md:h-16 mx-auto mb-3" />
              <p className="text-sm text-gray-700 font-medium">Specialised in Pharmacy management.</p>
            </div>
            
            {/* Login Type Toggle - Only Staff and Admin */}
            <div className="flex gap-2 mb-6 p-1.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
              <button
                onClick={() => { setLoginType('staff'); resetForm(); }}
                className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  loginType === 'staff'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <User className="w-4 h-4 inline mr-1" />
                Staff
              </button>
              <button
                onClick={() => { setLoginType('admin'); resetForm(); }}
                className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  loginType === 'admin'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Lock className="w-4 h-4 inline mr-1" />
                Admin
              </button>
            </div>

            {step === 'credentials' ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-white text-sm font-semibold">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+919383169659"
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all"
                    required
                  />
                </div>
                {((loginType === 'admin' || loginType === 'super_admin') || loginType === 'staff') && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-white text-sm font-semibold">
                        {isNewUser ? 'Set Password' : 'Password'}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={isNewUser ? "Create a password (min 6 characters)" : "Enter password"}
                          className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {isNewUser && (
                      <div className="space-y-2">
                        <label className="block text-white text-sm font-semibold">Confirm Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter your password"
                            className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {isNewUser && (
                  <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/50 text-white px-3 py-2 rounded-lg text-xs flex items-center gap-2">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <span>Enter the phone number provided by your {loginType === 'admin' ? 'SuperAdmin' : 'Admin'}</span>
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-white px-4 py-2 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? (isNewUser ? 'Setting up...' : 'Sending OTP...') : (isNewUser ? 'Set Password & Send OTP' : 'Send OTP')}
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* New User Toggle - Only for Admin and Staff */}
                {(loginType === 'admin' || loginType === 'staff') && (
                  <div className="text-center text-sm text-white/80">
                    {isNewUser ? (
                      <span>
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => setIsNewUser(false)}
                          className="text-white font-semibold hover:text-blue-200 transition-colors underline"
                        >
                          Existing User
                        </button>
                      </span>
                    ) : (
                      <span>
                        First time here?{' '}
                        <button
                          type="button"
                          onClick={() => setIsNewUser(true)}
                          className="text-white font-semibold hover:text-blue-200 transition-colors underline"
                        >
                          New User
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-white text-sm mb-2">OTP sent to {phone}</p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-white/80 text-xs hover:text-white flex items-center gap-1 mx-auto"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Change phone number
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-white text-sm font-semibold text-center">Enter 6-digit OTP</label>
                  <OTPInput value={otp} onChange={setOtp} length={6} />
                </div>

                {error && (
                  <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-white px-4 py-2 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-white/80 text-sm">Resend OTP in {countdown}s</p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="text-white text-sm hover:text-blue-200 font-medium transition-colors"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome