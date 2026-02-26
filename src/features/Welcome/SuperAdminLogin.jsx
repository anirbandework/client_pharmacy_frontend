import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import OTPInput from '../../components/OTPInput'
import { ArrowRight, ArrowLeft, Shield, Eye, EyeOff } from 'lucide-react'

const SuperAdminLogin = () => {
  const navigate = useNavigate()
  const { superAdminSendOTP, superAdminVerifyOTP } = useAuth()
  const [step, setStep] = useState('credentials')
  const [phone, setPhone] = useState('+91')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await superAdminSendOTP(phone, password)
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
      await superAdminVerifyOTP(phone, otp)
      navigate('/super-admin')
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">SuperAdmin Portal</h1>
            <p className="text-white/70 text-sm">Restricted Access Only</p>
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
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/30 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-white text-sm font-semibold">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/30 transition-all"
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

              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-white px-4 py-2 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-violet-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full text-white/70 hover:text-white text-sm transition-colors"
              >
                ← Back to Login
              </button>
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
                className="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-violet-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
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
                    className="text-white text-sm hover:text-purple-200 font-medium transition-colors"
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
  )
}

export default SuperAdminLogin
