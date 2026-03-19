import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import OTPInput from '../../components/OTPInput'
import { ArrowRight, ArrowLeft, Shield, Eye, EyeOff, Building2, Lock, AlertTriangle, Sun, Moon } from 'lucide-react'
import toast from 'react-hot-toast'

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 41 + 11) % 100}%`,
  top: `${(i * 59 + 17) % 100}%`,
  size: (i % 3) + 1,
  delay: `${(i * 0.42) % 7}s`,
  duration: `${13 + (i % 7) * 2}s`,
  opacity: 0.07 + (i % 4) * 0.06,
}))

const SuperAdminLogin = () => {
  const navigate = useNavigate()
  const { superAdminSendOTP, superAdminVerifyOTP } = useAuth()
  const [step, setStep] = useState('credentials')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => { setTimeout(() => setMounted(true), 60) }, [])

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

  const handleResendOTP = () => { setOtp(''); setStep('credentials') }
  const resetForm = () => { setStep('credentials'); setOtp(''); setError(''); setResetToken(''); setConfirmPassword('') }

  const handleForgotPassword = async () => {
    if (!phone) { setError('Please enter your phone number'); return }
    setError('')
    setLoading(true)
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, user_type: 'super_admin' })
      })
      if (!response.ok) throw new Error('Failed to send reset OTP')
      setStep('reset-otp')
      setCountdown(30)
    } catch (err) {
      setError(err.message || 'Failed to send reset OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyResetOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-reset-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, user_type: 'super_admin' })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Invalid OTP')
      setResetToken(data.reset_token)
      setStep('new-password')
    } catch (err) {
      setError(err.message || 'Failed to verify OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setError('')
    setLoading(true)
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset_token: resetToken, new_password: password, user_type: 'super_admin' })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Failed to reset password')
      setPassword('')
      setConfirmPassword('')
      setStep('credentials')
      setError('')
      toast.success('Password reset successfully! Please login with your new password.', {
        duration: 4000,
        position: 'top-right',
      })
    } catch (err) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  const lm = !darkMode

  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      data-light={lm}
      style={{ background: lm ? '#f5f3ff' : '#010c1a', transition: 'background 0.4s ease' }}
    >
      <style>{`
        @keyframes sa-float-orb {
          0%,100% { transform: translateY(0) scale(1); }
          40%      { transform: translateY(-35px) scale(1.04); }
          70%      { transform: translateY(18px) scale(0.97); }
        }
        @keyframes sa-particle {
          0%,100% { transform: translate(0,0); }
          30%      { transform: translate(6px,-8px); }
          60%      { transform: translate(-5px,-12px); }
        }
        @keyframes sa-gradient {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes sa-fadeInUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes sa-slideUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes sa-border-pulse {
          0%,100% { box-shadow: 0 0 0 1px rgba(139,92,246,0.25), 0 0 30px rgba(139,92,246,0.08); }
          50%      { box-shadow: 0 0 0 1px rgba(168,85,247,0.45), 0 0 60px rgba(168,85,247,0.16), 0 0 100px rgba(139,92,246,0.08); }
        }
        @keyframes sa-border-pulse-light {
          0%,100% { box-shadow: 0 8px 40px rgba(139,92,246,0.14), 0 0 0 1px rgba(139,92,246,0.18), 0 2px 8px rgba(0,0,0,0.04); }
          50%      { box-shadow: 0 12px 60px rgba(168,85,247,0.22), 0 0 0 1px rgba(168,85,247,0.28), 0 4px 16px rgba(0,0,0,0.06); }
        }
        @keyframes sa-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes sa-lock-glow {
          0%,100% { filter: drop-shadow(0 0 6px rgba(139,92,246,0.5)); }
          50%      { filter: drop-shadow(0 0 20px rgba(168,85,247,0.8)); }
        }
        @keyframes sa-shimmer {
          from { transform: translateX(-100%) skewX(-12deg); }
          to   { transform: translateX(250%) skewX(-12deg); }
        }
        @keyframes sa-warning-pulse {
          0%,100% { opacity: 0.7; }
          50%      { opacity: 1; }
        }

        .sa-orb-1 { animation: sa-float-orb 10s ease-in-out infinite; }
        .sa-orb-2 { animation: sa-float-orb 14s ease-in-out infinite reverse; animation-delay: -5s; }
        .sa-orb-3 { animation: sa-float-orb 18s ease-in-out infinite; animation-delay: -10s; }

        .sa-appear { opacity:0; animation: sa-fadeInUp 0.6s ease forwards; }
        .sa-step   { animation: sa-slideUp 0.4s ease forwards; }

        .sa-card-glow { animation: sa-border-pulse 4s ease-in-out infinite; }
        [data-light="true"] .sa-card-glow { animation: sa-border-pulse-light 4s ease-in-out infinite; }

        .sa-input {
          background: rgba(2,8,24,0.7);
          border: 1px solid rgba(71,85,105,0.4);
          transition: all 0.25s ease;
        }
        .sa-input:focus {
          border-color: rgba(139,92,246,0.65) !important;
          box-shadow: 0 0 0 3px rgba(139,92,246,0.12), 0 0 20px rgba(139,92,246,0.08);
          outline: none;
        }
        [data-light="true"] .sa-input {
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(203,213,225,0.8);
          color: #1e293b;
        }
        [data-light="true"] .sa-input::placeholder { color: #94a3b8; }
        [data-light="true"] .sa-input:focus {
          border-color: rgba(139,92,246,0.55) !important;
          box-shadow: 0 0 0 3px rgba(139,92,246,0.1), 0 0 20px rgba(139,92,246,0.06);
        }

        .sa-btn {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%);
          background-size: 200% 200%;
          animation: sa-gradient 4s ease infinite;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .sa-btn::after {
          content: '';
          position: absolute; top: 0; left: 0;
          width: 40%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          animation: sa-shimmer 3.5s ease-in-out infinite;
          pointer-events: none;
        }
        .sa-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(139,92,246,0.45), 0 4px 16px rgba(109,40,217,0.35);
        }
        .sa-btn:active:not(:disabled) { transform: translateY(0); }
        .sa-spin-ring { animation: sa-spin 8s linear infinite; }
        .sa-lock-glow { animation: sa-lock-glow 2.5s ease-in-out infinite; }
        .sa-warning { animation: sa-warning-pulse 2s ease-in-out infinite; }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0" style={{
          background: lm
            ? 'radial-gradient(ellipse 80% 60% at 50% -15%, rgba(167,139,250,0.35) 0%, transparent 68%)'
            : 'radial-gradient(ellipse 80% 60% at 50% -15%, rgba(60,20,100,0.5) 0%, transparent 68%)'
        }} />
        <div className="absolute inset-0" style={{
          background: lm
            ? 'radial-gradient(ellipse 55% 45% at 80% 85%, rgba(139,92,246,0.2) 0%, transparent 58%)'
            : 'radial-gradient(ellipse 55% 45% at 80% 85%, rgba(40,15,80,0.35) 0%, transparent 58%)'
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: lm
            ? 'linear-gradient(rgba(139,92,246,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.07) 1px,transparent 1px)'
            : 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
          backgroundSize: '36px 36px',
        }} />
        <div className="sa-orb-1 absolute top-[8%] left-[10%] w-[480px] h-[480px] rounded-full"
          style={{
            background: lm
              ? 'radial-gradient(circle,rgba(139,92,246,0.2) 0%,transparent 68%)'
              : 'radial-gradient(circle,rgba(139,92,246,0.13) 0%,transparent 68%)',
            filter: 'blur(45px)'
          }} />
        <div className="sa-orb-2 absolute bottom-[8%] right-[8%] w-[560px] h-[560px] rounded-full"
          style={{
            background: lm
              ? 'radial-gradient(circle,rgba(109,40,217,0.16) 0%,transparent 68%)'
              : 'radial-gradient(circle,rgba(109,40,217,0.10) 0%,transparent 68%)',
            filter: 'blur(55px)'
          }} />
        <div className="sa-orb-3 absolute top-[42%] left-[48%] w-[380px] h-[380px] rounded-full"
          style={{
            background: lm
              ? 'radial-gradient(circle,rgba(168,85,247,0.12) 0%,transparent 68%)'
              : 'radial-gradient(circle,rgba(168,85,247,0.07) 0%,transparent 68%)',
            filter: 'blur(60px)'
          }} />
        {PARTICLES.map(p => (
          <div key={p.id} className="absolute rounded-full" style={{
            left: p.left, top: p.top,
            width: `${p.size}px`, height: `${p.size}px`,
            background: lm
              ? `rgba(139,92,246,${p.opacity * 0.6})`
              : `rgba(196,181,253,${p.opacity})`,
            animation: `sa-particle ${p.duration} ${p.delay} ease-in-out infinite`,
          }} />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Header */}
        <header
          className="sticky top-0 z-20"
          style={{
            background: lm ? 'rgba(255,255,255,0.82)' : 'rgba(1,8,20,0.6)',
            backdropFilter: 'blur(20px)',
            borderBottom: lm ? '1px solid rgba(139,92,246,0.15)' : '1px solid rgba(139,92,246,0.12)',
            transition: 'background 0.4s ease, border-color 0.4s ease',
          }}
        >
          <div className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className={`flex items-center gap-3 ${mounted ? 'sa-appear' : 'opacity-0'}`}>
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0">
                <div className="sa-spin-ring absolute inset-0 rounded-xl" style={{ background: 'conic-gradient(from 0deg,transparent 60%,rgba(139,92,246,0.6) 80%,rgba(168,85,247,0.8) 95%,transparent 100%)' }} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: lm ? '#1e293b' : '#ffffff', transition: 'color 0.4s ease' }}>LedgerX</h1>
                <p className="text-[10px] sm:text-xs leading-none" style={{ color: lm ? '#94a3b8' : '#64748b', transition: 'color 0.4s ease' }}>A Business Solution</p>
              </div>
            </div>
            <div className={`flex items-center gap-3 sm:gap-4 ${mounted ? 'sa-appear' : 'opacity-0'}`} style={{ animationDelay: '0.15s' }}>
              <p className="hidden sm:block text-xs" style={{ color: lm ? '#94a3b8' : '#64748b' }}>
                powered by <span className="font-semibold" style={{ color: lm ? '#475569' : '#cbd5e1' }}>Indus Infotech</span>
              </p>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '999px', cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(139,92,246,0.08)',
                  border: darkMode ? '1px solid rgba(255,255,255,0.13)' : '1px solid rgba(139,92,246,0.22)',
                }}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode
                  ? <Sun style={{ width: 14, height: 14, color: '#fbbf24' }} />
                  : <Moon style={{ width: 14, height: 14, color: '#7c3aed' }} />
                }
                <span className="text-[10px] sm:text-xs font-medium hidden sm:block" style={{ color: darkMode ? '#fbbf24' : '#7c3aed' }}>
                  {darkMode ? 'Light' : 'Dark'}
                </span>
              </button>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}>
                <Shield className="w-3 h-3 text-violet-400" />
                <span className="text-[10px] text-violet-400 font-medium hidden sm:inline">Restricted</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <div className="flex-1 flex items-center justify-center px-4 py-10">
          <div className={`w-full max-w-sm ${mounted ? 'sa-appear' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>

            {/* Warning badge */}
            <div className="sa-warning flex items-center justify-center gap-2 mb-6 px-4 py-2.5 rounded-full mx-auto w-fit" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-amber-400 font-semibold tracking-wide uppercase">Restricted Portal</span>
            </div>

            {/* Card */}
            <div
              className="sa-card-glow rounded-3xl p-6 sm:p-8"
              style={{
                background: lm
                  ? 'linear-gradient(145deg,rgba(255,255,255,0.97) 0%,rgba(250,248,255,0.99) 100%)'
                  : 'linear-gradient(145deg,rgba(14,8,40,0.88) 0%,rgba(6,4,24,0.94) 100%)',
                backdropFilter: 'blur(24px)',
                border: lm ? '1px solid rgba(139,92,246,0.18)' : '1px solid rgba(139,92,246,0.2)',
                transition: 'background 0.4s ease, border-color 0.4s ease',
              }}
            >
              {/* Shield logo */}
              <div className="text-center mb-7">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="sa-spin-ring absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 0deg,transparent 55%,rgba(139,92,246,0.5) 75%,rgba(168,85,247,0.8) 92%,transparent 100%)' }} />
                  <div className="absolute inset-[3px] rounded-full flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}>
                    <Shield className="sa-lock-glow w-9 h-9 text-violet-400" />
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-1" style={{ color: lm ? '#1e293b' : '#ffffff', transition: 'color 0.4s ease' }}>SuperAdmin Access</h2>
                <p className="text-sm" style={{ color: lm ? '#64748b' : '#64748b' }}>Authorised personnel only</p>
              </div>

              {/* Credentials step */}
              {step === 'credentials' && (
                <form onSubmit={handleSendOTP} className="sa-step space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: lm ? '#64748b' : '#94a3b8' }}>Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: lm ? '#94a3b8' : '#64748b' }}>+91</span>
                      <input
                        type="tel" value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="9800000000"
                        className="sa-input w-full pl-14 pr-4 py-3 rounded-xl text-sm"
                        style={{ color: lm ? '#1e293b' : '#ffffff' }}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium" style={{ color: lm ? '#64748b' : '#94a3b8' }}>Password</label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'} value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="sa-input w-full px-4 py-3 pr-11 rounded-xl text-sm"
                        style={{ color: lm ? '#1e293b' : '#ffffff' }}
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                        style={{ color: lm ? '#94a3b8' : '#64748b' }}>
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="px-4 py-3 rounded-xl text-sm text-red-300" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    className="sa-btn w-full text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? 'Sending OTP…' : 'Send OTP'}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center">
                    <Link to="/" className="text-sm hover:text-violet-300 transition-colors inline-flex items-center gap-1" style={{ color: lm ? '#64748b' : '#64748b' }}>
                      <ArrowLeft className="w-3 h-3" /> Back to Login
                    </Link>
                  </div>
                </form>
              )}

              {/* Reset OTP step */}
              {step === 'reset-otp' && (
                <form onSubmit={handleVerifyResetOTP} className="sa-step space-y-5">
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <div className="sa-spin-ring absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 0deg,transparent 55%,rgba(139,92,246,0.5) 75%,rgba(168,85,247,0.8) 92%,transparent 100%)' }} />
                      <div className="absolute inset-[3px] rounded-full flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}>
                        <Lock className="sa-lock-glow w-8 h-8 text-violet-400" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: lm ? '#1e293b' : '#ffffff', transition: 'color 0.4s ease' }}>Reset Password</h3>
                    <p className="text-sm" style={{ color: lm ? '#64748b' : '#94a3b8' }}>OTP sent to <span style={{ color: lm ? '#475569' : '#cbd5e1' }}>+91 {phone}</span></p>
                    <button type="button" onClick={resetForm}
                      className="inline-flex items-center gap-1 text-violet-400 text-xs hover:text-violet-300 transition-colors mt-2">
                      <ArrowLeft className="w-3 h-3" /> Back to login
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-3 text-center" style={{ color: lm ? '#64748b' : '#94a3b8' }}>Enter 6-digit OTP</label>
                    <OTPInput value={otp} onChange={setOtp} length={6} />
                  </div>

                  {error && (
                    <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: lm ? '#991b1b' : '#fca5a5' }}>
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading || otp.length !== 6}
                    className="sa-btn w-full text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? 'Verifying…' : 'Verify OTP'}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-sm" style={{ color: lm ? '#64748b' : '#94a3b8' }}>Resend in <span className="tabular-nums" style={{ color: lm ? '#475569' : '#cbd5e1' }}>{countdown}s</span></p>
                    ) : (
                      <button type="button" onClick={handleForgotPassword}
                        className="text-violet-400 text-sm hover:text-violet-300 font-medium transition-colors">
                        Resend OTP
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* New Password step */}
              {step === 'new-password' && (
                <form onSubmit={handleResetPassword} className="sa-step space-y-4">
                  <div className="text-center mb-5">
                    <h3 className="font-bold text-lg mb-1" style={{ color: lm ? '#1e293b' : '#ffffff', transition: 'color 0.4s ease' }}>Set New Password</h3>
                    <p className="text-sm" style={{ color: lm ? '#64748b' : '#94a3b8' }}>Create a strong password for your account</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: lm ? '#64748b' : '#94a3b8' }}>New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter new password (min 6 chars)"
                        className="sa-input w-full px-4 py-3 pr-11 rounded-xl text-sm"
                        style={{ color: lm ? '#1e293b' : '#ffffff' }}
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                        style={{ color: lm ? '#94a3b8' : '#64748b' }}>
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: lm ? '#64748b' : '#94a3b8' }}>Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="sa-input w-full px-4 py-3 pr-11 rounded-xl text-sm"
                        style={{ color: lm ? '#1e293b' : '#ffffff' }}
                        required
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                        style={{ color: lm ? '#94a3b8' : '#64748b' }}>
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: lm ? '#991b1b' : '#fca5a5' }}>
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    className="sa-btn w-full text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? 'Resetting…' : 'Reset Password'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* OTP step */}
              {step === 'otp' && (
                <form onSubmit={handleVerifyOTP} className="sa-step space-y-5">
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <div className="sa-spin-ring absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 0deg,transparent 55%,rgba(139,92,246,0.5) 75%,rgba(168,85,247,0.8) 92%,transparent 100%)' }} />
                      <div className="absolute inset-[3px] rounded-full flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}>
                        <Lock className="sa-lock-glow w-8 h-8 text-violet-400" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-1" style={{ color: lm ? '#1e293b' : '#ffffff', transition: 'color 0.4s ease' }}>Verify OTP</h3>
                    <p className="text-slate-500 text-sm">Code sent to <span style={{ color: lm ? '#475569' : '#cbd5e1' }}>+91 {phone}</span></p>
                    <button type="button" onClick={resetForm}
                      className="inline-flex items-center gap-1 text-violet-400 text-xs hover:text-violet-300 transition-colors mt-2">
                      <ArrowLeft className="w-3 h-3" /> Change number
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-3 text-center" style={{ color: lm ? '#64748b' : '#94a3b8' }}>Enter 6-digit OTP</label>
                    <OTPInput value={otp} onChange={setOtp} length={6} />
                  </div>

                  {error && (
                    <div className="px-4 py-3 rounded-xl text-sm text-red-300" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={loading || otp.length !== 6}
                    className="sa-btn w-full text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? 'Verifying…' : 'Verify & Sign In'}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-slate-500 text-sm">Resend in <span className="tabular-nums" style={{ color: lm ? '#475569' : '#cbd5e1' }}>{countdown}s</span></p>
                    ) : (
                      <button type="button" onClick={handleResendOTP}
                        className="text-violet-400 text-sm hover:text-violet-300 font-medium transition-colors">
                        Resend OTP
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>

            <p className="text-center text-xs mt-5" style={{ color: lm ? '#94a3b8' : '#475569' }}>
              Protected by enterprise-grade security · Data encrypted & secure
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer
          className="sticky bottom-0 z-20"
          style={{
            background: lm ? 'rgba(255,255,255,0.82)' : 'rgba(1,8,20,0.6)',
            backdropFilter: 'blur(20px)',
            borderTop: lm ? '1px solid rgba(139,92,246,0.1)' : '1px solid rgba(139,92,246,0.08)',
            transition: 'background 0.4s ease, border-color 0.4s ease',
          }}
        >
          <div className="w-full px-4 sm:px-6 py-3 text-xs" style={{ color: lm ? '#94a3b8' : '#475569' }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5">
              <span className="order-2 sm:order-1">LedgerX v1.0</span>
              <span className="order-1 sm:order-2 sm:absolute sm:left-1/2 sm:-translate-x-1/2">© 2026 Indus Infotech. All rights reserved.</span>
              <div className="order-3 flex items-center gap-4">
                <Link to="/privacy-policy" className="hover:text-slate-400 transition-colors">Privacy</Link>
                <Link to="/terms-of-service" className="hover:text-slate-400 transition-colors">Terms</Link>
                <Link to="/support" className="hover:text-slate-400 transition-colors">Support</Link>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  )
}

export default SuperAdminLogin
