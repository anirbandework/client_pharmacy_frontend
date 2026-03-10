import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import OTPInput from '../../components/OTPInput'
import FeatureCarousel from './FeatureCarousel'
import { ArrowRight, ArrowLeft, Lock, User, BarChart3, Package, Users, Search, DollarSign, TrendingUp, Shield, Eye, EyeOff, Info, Building2, Briefcase, Clock, FileText, Bell, Zap, Database, Truck } from 'lucide-react'

const Welcome = () => {
  const navigate = useNavigate()
  const { adminSendOTP, adminVerifyOTP, adminSignup, staffSendOTP, staffVerifyOTP, staffSignup, superAdminSendOTP, superAdminVerifyOTP, distributorSendOTP, distributorVerifyOTP, distributorSignup } = useAuth()
  const [loginType, setLoginType] = useState('staff')
  const [isNewUser, setIsNewUser] = useState(false)
  const [step, setStep] = useState('credentials')
  const [uuid, setUuid] = useState('')
  const [phone, setPhone] = useState('')
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
        if (loginType === 'admin') {
          await adminSignup(phone, password)
        } else if (loginType === 'staff') {
          await staffSignup(phone, password)
        } else if (loginType === 'distributor') {
          await distributorSignup(phone, password)
        }
      } else {
        if (loginType === 'super_admin') {
          await superAdminSendOTP(phone, password)
        } else if (loginType === 'staff') {
          await staffSendOTP(phone, password)
        } else if (loginType === 'distributor') {
          await distributorSendOTP(phone, password)
        } else {
          await adminSendOTP(phone, password)
        }
      }
      setStep('otp')
      setCountdown(30)
    } catch (err) {
      console.error('OTP Error:', err)
      setError(err.message || 'An error occurred')
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
      } else if (loginType === 'distributor') {
        await distributorVerifyOTP(phone, otp)
        navigate('/distributor')
      } else {
        const normalizedPhone = phone.replace(/\D/g, '')
        const isSuperAdmin = normalizedPhone.endsWith('9383169659') || normalizedPhone.endsWith('9643579321')
        
        if (isSuperAdmin) {
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
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-y-auto">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Professional Header */}
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl">
          <div className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold text-white">LedgerX</h1>
                <p className="text-[10px] sm:text-xs text-slate-400">A Business Solution</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">powered by <span className="text-sm sm:text-base font-semibold text-white">Indus Infotech</span></p>
              <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-slate-400">
                <Shield className="w-3 h-3" />
                <span className="hidden sm:inline">Secure Access</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
            
            {/* Left: Enterprise Features */}
            <div className="space-y-4 sm:space-y-6 hidden lg:block">
              <div className="space-y-2 sm:space-y-3">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Complete Business<br />Management Solution
                </h2>
                <p className="text-base sm:text-lg text-slate-400">
                  Enterprise-grade system for multi-location business operations with real-time insights and automation.
                </p>
              </div>

              {/* Feature Carousel */}
              <div className="relative">
                <FeatureCarousel />
                
                {/* Trust Indicators - Centered below carousel */}
                <div className="flex items-center justify-center gap-3 sm:gap-6 pt-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-slate-400">99.9% Uptime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-400">AI-Powered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-400">Cloud Backup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-400">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Login Form */}
            <div className="w-full max-w-md mx-auto">
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
                
                {/* Role Selector */}
                <div className="mb-6">
                  <label className="block text-slate-400 text-xs font-medium mb-3 text-center">SELECT YOUR ROLE</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => { setLoginType('staff'); resetForm(); }}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        loginType === 'staff'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                      }`}
                    >
                      <Briefcase className={`w-5 h-5 mx-auto mb-1 ${loginType === 'staff' ? 'text-blue-400' : 'text-slate-400'}`} />
                      <div className={`text-xs font-semibold ${loginType === 'staff' ? 'text-white' : 'text-slate-400'}`}>Staff</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Employee</div>
                    </button>
                    <button
                      onClick={() => { setLoginType('admin'); resetForm(); }}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        loginType === 'admin'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                      }`}
                    >
                      <Lock className={`w-5 h-5 mx-auto mb-1 ${loginType === 'admin' ? 'text-blue-400' : 'text-slate-400'}`} />
                      <div className={`text-xs font-semibold ${loginType === 'admin' ? 'text-white' : 'text-slate-400'}`}>Admin</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Manager</div>
                    </button>
                    <button
                      onClick={() => { setLoginType('distributor'); resetForm(); }}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        loginType === 'distributor'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                      }`}
                    >
                      <Package className={`w-5 h-5 mx-auto mb-1 ${loginType === 'distributor' ? 'text-blue-400' : 'text-slate-400'}`} />
                      <div className={`text-xs font-semibold ${loginType === 'distributor' ? 'text-white' : 'text-slate-400'}`}>Distributor</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Supplier</div>
                    </button>
                  </div>
                </div>

                {step === 'credentials' ? (
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-2">Phone Number</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">+91</span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="1800123456"
                          className="w-full pl-14 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    {((loginType === 'admin' || loginType === 'super_admin') || loginType === 'staff' || loginType === 'distributor') && (
                      <>
                        <div>
                          <label className="block text-slate-300 text-sm font-medium mb-2">
                            {isNewUser ? 'Set Password' : 'Password'}
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder={isNewUser ? "Create password (min 6 characters)" : "Enter password"}
                              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {isNewUser && (
                          <div>
                            <label className="block text-slate-300 text-sm font-medium mb-2">Confirm Password</label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter password"
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                              >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {isNewUser && (
                      <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 px-4 py-3 rounded-xl text-xs flex items-start gap-2">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Use the phone number provided by your {loginType === 'admin' ? 'SuperAdmin' : loginType === 'distributor' ? 'SuperAdmin' : 'Admin'}</span>
                      </div>
                    )}

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                      {loading ? (isNewUser ? 'Setting up...' : 'Sending OTP...') : (isNewUser ? 'Set Password & Send OTP' : 'Send OTP')}
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {(loginType === 'admin' || loginType === 'staff' || loginType === 'distributor') && (
                      <div className="text-center text-sm text-slate-400">
                        {isNewUser ? (
                          <span>
                            Already have an account?{' '}
                            <button
                              type="button"
                              onClick={() => setIsNewUser(false)}
                              className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                            >
                              Sign In
                            </button>
                          </span>
                        ) : (
                          <span>
                            First time here?{' '}
                            <button
                              type="button"
                              onClick={() => setIsNewUser(true)}
                              className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                            >
                              Create Account
                            </button>
                          </span>
                        )}
                      </div>
                    )}
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Lock className="w-8 h-8 text-blue-400" />
                      </div>
                      <h3 className="text-white font-semibold mb-1">Verify OTP</h3>
                      <p className="text-slate-400 text-sm">Code sent to {phone}</p>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-blue-400 text-xs hover:text-blue-300 flex items-center gap-1 mx-auto mt-2"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        Change number
                      </button>
                    </div>

                    <div>
                      <label className="block text-slate-300 text-sm font-medium mb-3 text-center">Enter 6-digit OTP</label>
                      <OTPInput value={otp} onChange={setOtp} length={6} />
                    </div>

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                      {loading ? 'Verifying...' : 'Verify & Sign In'}
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="text-center">
                      {countdown > 0 ? (
                        <p className="text-slate-400 text-sm">Resend OTP in {countdown}s</p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOTP}
                          className="text-blue-400 text-sm hover:text-blue-300 font-medium transition-colors"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>

              {/* Footer Note */}
              <p className="text-center text-slate-500 text-xs mt-6">
                Protected by enterprise-grade security. Your data is encrypted and secure.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="sticky bottom-0 z-20 border-t border-white/10 bg-slate-900/50 backdrop-blur-xl">
          <div className="w-full px-4 sm:px-6 py-3 sm:py-4 text-xs text-slate-400">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2 sm:gap-0">
              <div className="order-2 sm:order-1">LedgerX v1.0</div>
              <div className="order-1 sm:order-2 sm:absolute sm:left-1/2 sm:-translate-x-1/2 text-center">© 2026 Indus Infotech. All rights reserved.</div>
              <div className="order-3 flex items-center gap-3 sm:gap-4">
                <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
                <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms</Link>
                <Link to="/support" className="hover:text-white transition-colors">Support</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Welcome
