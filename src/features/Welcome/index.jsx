import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import OTPInput from '../../components/OTPInput'
import FeatureCarousel from './FeatureCarousel'
import Logo from '../../components/Logo'
import { ArrowRight, ArrowLeft, Lock, Package, Shield, Eye, EyeOff, Info, Briefcase, Bell, Database, Zap, Sun, Moon } from 'lucide-react'
import toast from 'react-hot-toast'

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 7) % 100}%`,
  top: `${(i * 53 + 13) % 100}%`,
  size: (i % 3) + 1,
  delay: `${(i * 0.38) % 7}s`,
  duration: `${14 + (i % 8) * 1.8}s`,
  opacity: 0.08 + (i % 5) * 0.07,
}))

const ROLES = [
  { key: 'staff',       label: 'Staff',       sub: 'Employee', Icon: Briefcase },
  { key: 'admin',       label: 'Admin',        sub: 'Manager',  Icon: Lock      },
  { key: 'distributor', label: 'Distributor',  sub: 'Supplier', Icon: Package   },
]

const Welcome = () => {
  const navigate = useNavigate()
  const {
    adminSendOTP, adminVerifyOTP, adminSignup,
    staffSendOTP, staffVerifyOTP, staffSignup,
    superAdminSendOTP, superAdminVerifyOTP,
    distributorSendOTP, distributorVerifyOTP, distributorSignup,
  } = useAuth()

  const [loginType, setLoginType] = useState(null)
  const [isNewUser, setIsNewUser] = useState(false)
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
  const { isDark: darkMode, toggleTheme } = useTheme()

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
    if (isNewUser && password !== confirmPassword) { setError('Passwords do not match'); return }
    setLoading(true)
    try {
      if (isNewUser) {
        if (loginType === 'admin') await adminSignup(phone, password)
        else if (loginType === 'staff') await staffSignup(phone, password)
        else if (loginType === 'distributor') await distributorSignup(phone, password)
      } else {
        if (loginType === 'super_admin') await superAdminSendOTP(phone, password)
        else if (loginType === 'staff') await staffSendOTP(phone, password)
        else if (loginType === 'distributor') await distributorSendOTP(phone, password)
        else await adminSendOTP(phone, password)
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
        await staffVerifyOTP(phone, otp); navigate('/billing')
      } else if (loginType === 'super_admin') {
        await superAdminVerifyOTP(phone, otp); navigate('/super-admin')
      } else if (loginType === 'distributor') {
        await distributorVerifyOTP(phone, otp); navigate('/distributor')
      } else {
        const norm = phone.replace(/\D/g, '')
        const isSA = norm.endsWith('9383169659') || norm.endsWith('9643579321')
        if (isSA) { await superAdminVerifyOTP(phone, otp); navigate('/super-admin') }
        else { await adminVerifyOTP(phone, otp); navigate('/admin') }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = () => { setOtp(''); setStep('credentials') }

  const resetForm = () => {
    setStep('credentials'); setOtp(''); setError('')
    setIsNewUser(false); setConfirmPassword(''); setResetToken('')
  }

  const handleRoleSelect = (role) => {
    setLoginType(role)
    resetForm()
  }

  const handleBackToRoles = () => {
    setLoginType(null)
    resetForm()
  }

  const handleForgotPassword = async () => {
    if (!phone) { setError('Please enter your phone number'); return }
    setError('')
    setLoading(true)
    try {
      const userTypeMap = { staff: 'staff', admin: 'admin', distributor: 'distributor' }
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, user_type: userTypeMap[loginType] })
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
      const userTypeMap = { staff: 'staff', admin: 'admin', distributor: 'distributor' }
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-reset-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, user_type: userTypeMap[loginType] })
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
      const userTypeMap = { staff: 'staff', admin: 'admin', distributor: 'distributor' }
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset_token: resetToken, new_password: password, user_type: userTypeMap[loginType] })
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

  const roleIndex = ROLES.findIndex(r => r.key === loginType)
  const lm = !darkMode // light mode shorthand

  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      data-light={lm}
      style={{ background: lm ? '#f0f6ff' : '#010c1a', transition: 'background 0.4s ease' }}
    >
      <style>{`
        @keyframes float-orb {
          0%,100% { transform: translateY(0px) scale(1); }
          33%      { transform: translateY(-40px) scale(1.04); }
          66%      { transform: translateY(20px) scale(0.97); }
        }
        @keyframes particle-float {
          0%,100% { transform: translate(0,0); }
          25%      { transform: translate(7px,-9px); }
          50%      { transform: translate(-5px,-14px); }
          75%      { transform: translate(-9px,-5px); }
        }
        @keyframes gradient-sweep {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeInRight {
          from { opacity:0; transform:translateX(28px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes border-pulse {
          0%,100% { box-shadow: 0 0 0 1px rgba(59,130,246,0.25), 0 0 30px rgba(59,130,246,0.08); }
          50%      { box-shadow: 0 0 0 1px rgba(99,102,241,0.45), 0 0 60px rgba(99,102,241,0.15), 0 0 100px rgba(59,130,246,0.08); }
        }
        @keyframes border-pulse-light {
          0%,100% { box-shadow: 0 8px 40px rgba(59,130,246,0.12), 0 0 0 1px rgba(59,130,246,0.15), 0 2px 8px rgba(0,0,0,0.04); }
          50%      { box-shadow: 0 12px 60px rgba(99,102,241,0.2), 0 0 0 1px rgba(99,102,241,0.25), 0 4px 16px rgba(0,0,0,0.06); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes lock-glow {
          0%,100% { filter: drop-shadow(0 0 6px rgba(59,130,246,0.4)); }
          50%      { filter: drop-shadow(0 0 18px rgba(99,102,241,0.7)); }
        }
        @keyframes shimmer-sweep {
          from { transform: translateX(-100%) skewX(-12deg); }
          to   { transform: translateX(250%) skewX(-12deg); }
        }

        .orb-1 { animation: float-orb 9s ease-in-out infinite; }
        .orb-2 { animation: float-orb 13s ease-in-out infinite reverse; animation-delay:-4s; }
        .orb-3 { animation: float-orb 17s ease-in-out infinite; animation-delay:-9s; }

        .animated-gradient-text {
          background: linear-gradient(90deg, #60a5fa, #818cf8, #c084fc, #60a5fa);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-sweep 5s ease infinite;
        }
        .cta-btn {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%);
          background-size: 200% 200%;
          animation: gradient-sweep 4s ease infinite;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .cta-btn::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 40%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          animation: shimmer-sweep 3s ease-in-out infinite;
          pointer-events: none;
        }
        .cta-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(59,130,246,0.45), 0 4px 16px rgba(79,70,229,0.35);
        }
        .cta-btn:active:not(:disabled) { transform: translateY(0); }

        .card-glow { animation: border-pulse 4s ease-in-out infinite; }
        [data-light="true"] .card-glow { animation: border-pulse-light 4s ease-in-out infinite; }

        .input-field {
          background: rgba(2,12,28,0.7);
          border: 1px solid rgba(71,85,105,0.5);
          transition: all 0.25s ease;
        }
        .input-field:focus {
          border-color: rgba(59,130,246,0.6) !important;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12), 0 0 24px rgba(59,130,246,0.08);
          outline: none;
        }
        [data-light="true"] .input-field {
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(203,213,225,0.8);
          color: #1e293b;
        }
        [data-light="true"] .input-field::placeholder { color: #94a3b8; }
        [data-light="true"] .input-field:focus {
          border-color: rgba(59,130,246,0.55) !important;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1), 0 0 20px rgba(59,130,246,0.06);
        }

        .lock-icon { animation: lock-glow 2.5s ease-in-out infinite; }
        .spin-ring  { animation: spin-slow 8s linear infinite; }

        .appear { opacity:0; animation: fadeInUp 0.6s ease forwards; }
        .appear-r { opacity:0; animation: fadeInRight 0.6s ease forwards; }

        .step-enter { animation: slideUp 0.4s ease forwards; }

        .trust-item {
          opacity: 0;
          animation: fadeInUp 0.5s ease forwards;
        }
        .stat-item {
          opacity: 0;
          animation: fadeInUp 0.55s ease forwards;
        }

        .theme-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .theme-toggle:hover { transform: translateY(-1px); }
      `}</style>

      {/* ─── Background Layer ─── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Base radial gradients */}
        <div className="absolute inset-0" style={{ background: lm
          ? 'radial-gradient(ellipse 90% 65% at 50% -10%, rgba(147,197,253,0.45) 0%, transparent 68%)'
          : 'radial-gradient(ellipse 90% 65% at 50% -10%, rgba(17,43,99,0.55) 0%, transparent 68%)'
        }} />
        <div className="absolute inset-0" style={{ background: lm
          ? 'radial-gradient(ellipse 60% 50% at 85% 90%, rgba(167,139,250,0.28) 0%, transparent 60%)'
          : 'radial-gradient(ellipse 60% 50% at 85% 90%, rgba(29,20,85,0.4) 0%, transparent 60%)'
        }} />
        <div className="absolute inset-0" style={{ background: lm
          ? 'radial-gradient(ellipse 50% 40% at 10% 80%, rgba(96,165,250,0.22) 0%, transparent 55%)'
          : 'radial-gradient(ellipse 50% 40% at 10% 80%, rgba(15,30,70,0.35) 0%, transparent 55%)'
        }} />

        {/* Fine grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: lm
            ? 'linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px)'
            : 'linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)',
          backgroundSize: '36px 36px'
        }} />

        {/* Animated orbs */}
        <div className="orb-1 absolute top-[5%] left-[8%] w-[520px] h-[520px] rounded-full" style={{
          background: lm
            ? 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 68%)'
            : 'radial-gradient(circle, rgba(59,130,246,0.13) 0%, transparent 68%)',
          filter: 'blur(45px)'
        }} />
        <div className="orb-2 absolute bottom-[5%] right-[5%] w-[620px] h-[620px] rounded-full" style={{
          background: lm
            ? 'radial-gradient(circle, rgba(99,102,241,0.16) 0%, transparent 68%)'
            : 'radial-gradient(circle, rgba(99,102,241,0.11) 0%, transparent 68%)',
          filter: 'blur(55px)'
        }} />
        <div className="orb-3 absolute top-[38%] left-[45%] w-[440px] h-[440px] rounded-full" style={{
          background: lm
            ? 'radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 68%)'
            : 'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 68%)',
          filter: 'blur(65px)'
        }} />

        {/* Particles */}
        {PARTICLES.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: p.left, top: p.top,
              width: `${p.size}px`, height: `${p.size}px`,
              background: lm
                ? `rgba(100,140,220,${p.opacity * 0.6})`
                : `rgba(148,163,184,${p.opacity})`,
              animation: `particle-float ${p.duration} ${p.delay} ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* ─── App Shell ─── */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Header */}
        <header
          className="sticky top-0 z-20"
          style={{
            background: lm ? 'rgba(255,255,255,0.82)' : 'rgba(1,12,26,0.6)',
            backdropFilter: 'blur(20px)',
            borderBottom: lm ? '1px solid rgba(59,130,246,0.12)' : '1px solid rgba(255,255,255,0.07)',
            transition: 'background 0.4s ease, border-color 0.4s ease',
          }}
        >
          <div className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className={`flex items-center gap-3 ${mounted ? 'appear' : 'opacity-0'}`}>
              {/* Logo with spinning ring */}
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0">
                <div
                  className="spin-ring absolute inset-0 rounded-xl"
                  style={{ background: 'conic-gradient(from 0deg, transparent 60%, rgba(99,102,241,0.6) 80%, rgba(59,130,246,0.8) 95%, transparent 100%)' }}
                />
                <div className="absolute inset-[2px] flex items-center justify-center"><Logo size={30} id="wh" /></div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: lm ? '#1e293b' : '#ffffff', transition: 'color 0.4s ease' }}>LedgerX</h1>
                <p className="text-[10px] sm:text-xs leading-none" style={{ color: lm ? '#94a3b8' : '#64748b', transition: 'color 0.4s ease' }}>A Business Solution</p>
              </div>
            </div>

            <div className={`flex items-center gap-3 sm:gap-4 ${mounted ? 'appear-r' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <p className="hidden sm:block text-xs" style={{ color: lm ? '#94a3b8' : '#64748b' }}>
                powered by <span className="text-sm font-semibold" style={{ color: lm ? '#475569' : '#cbd5e1' }}>Indus Infotech</span>
              </p>

              {/* ── Theme Toggle ── */}
              <button
                onClick={toggleTheme}
                className="theme-toggle"
                style={{
                  background: lm ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.07)',
                  border: lm ? '1px solid rgba(99,102,241,0.22)' : '1px solid rgba(255,255,255,0.13)',
                }}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode
                  ? <Sun className="w-3.5 h-3.5 text-amber-400" />
                  : <Moon className="w-3.5 h-3.5 text-indigo-500" />
                }
                <span className="text-[10px] sm:text-xs font-medium hidden sm:block" style={{ color: darkMode ? '#fbbf24' : '#6366f1' }}>
                  {darkMode ? 'Light' : 'Dark'}
                </span>
              </button>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] sm:text-xs text-green-400 font-medium">Secure</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
          <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* ── Left: Feature Side ── */}
            <div className="hidden lg:flex flex-col gap-7">

              {/* Headline */}
              <div
                className={mounted ? 'appear' : 'opacity-0'}
                style={{ animationDelay: '0.1s' }}
              >
                <h2 className="text-4xl xl:text-5xl font-bold leading-[1.12] tracking-tight" style={{ color: lm ? '#0f172a' : '#ffffff', transition: 'color 0.4s ease' }}>
                  Complete Business<br />
                  <span className="animated-gradient-text">Management Solution</span>
                </h2>
                <p className="mt-4 text-base leading-relaxed max-w-md" style={{ color: lm ? '#64748b' : '#94a3b8', transition: 'color 0.4s ease' }}>
                  Enterprise-grade system for multi-location operations with real-time insights and intelligent automation.
                </p>
              </div>

              {/* Stats row */}
              <div
                className={`grid grid-cols-3 gap-3 ${mounted ? 'appear' : 'opacity-0'}`}
                style={{ animationDelay: '0.25s' }}
              >
                {[
                  { value: '500+', label: 'Businesses' },
                  { value: '99.9%', label: 'Uptime' },
                  { value: '24/7', label: 'Support' },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="stat-item rounded-2xl p-4 text-center"
                    style={{
                      background: lm ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.03)',
                      border: lm ? '1px solid rgba(59,130,246,0.12)' : '1px solid rgba(255,255,255,0.07)',
                      boxShadow: lm ? '0 2px 12px rgba(59,130,246,0.07)' : 'none',
                      transition: 'background 0.4s ease, border-color 0.4s ease',
                      animationDelay: `${0.3 + i * 0.1}s`,
                    }}
                  >
                    <div className="text-2xl font-bold" style={{ color: lm ? '#1e293b' : '#ffffff', transition: 'color 0.4s ease' }}>{s.value}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Feature Carousel */}
              <div
                className={mounted ? 'appear' : 'opacity-0'}
                style={{ animationDelay: '0.35s' }}
              >
                <FeatureCarousel darkMode={darkMode} />
              </div>

              {/* Trust indicators */}
              <div
                className={`flex items-center gap-5 flex-wrap ${mounted ? 'appear' : 'opacity-0'}`}
                style={{ animationDelay: '0.45s' }}
              >
                {[
                  { Icon: Shield,   label: 'AI-Powered'   },
                  { Icon: Database, label: 'Cloud Backup' },
                  { Icon: Bell,     label: '24/7 Support' },
                ].map(({ Icon, label }, i) => (
                  <div
                    key={i}
                    className="trust-item flex items-center gap-2"
                    style={{ animationDelay: `${0.5 + i * 0.08}s` }}
                  >
                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs text-slate-500">{label}</span>
                  </div>
                ))}
                <div
                  className="trust-item flex items-center gap-2"
                  style={{ animationDelay: '0.74s' }}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-slate-500">99.9% Uptime</span>
                </div>
              </div>
            </div>

            {/* ── Right: Role Selection or Login Card ── */}
            <div
              className={`w-full max-w-md mx-auto ${mounted ? 'appear-r' : 'opacity-0'}`}
              style={{ animationDelay: '0.15s' }}
            >
              {/* Card */}
              <div
                className="card-glow rounded-3xl p-6 sm:p-8"
                style={{
                  background: lm
                    ? 'linear-gradient(145deg, rgba(255,255,255,0.97) 0%, rgba(248,250,255,0.99) 100%)'
                    : 'linear-gradient(145deg, rgba(10,20,46,0.85) 0%, rgba(5,12,32,0.92) 100%)',
                  backdropFilter: 'blur(24px)',
                  border: lm ? '1px solid rgba(59,130,246,0.15)' : '1px solid rgba(59,130,246,0.2)',
                  transition: 'background 0.4s ease, border-color 0.4s ease',
                }}
              >
                {!loginType ? (
                  // Role Selection Screen
                  <div className="step-enter">
                    <div className="mb-8 text-center">
                      <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: lm ? '#94a3b8' : '#64748b' }}>Welcome to</p>
                      <h3 className="text-2xl font-bold" style={{ color: lm ? '#1e293b' : '#ffffff', transition: 'color 0.4s ease' }}>LedgerX</h3>
                    </div>

                    <p className="text-center text-sm font-semibold tracking-wide uppercase mb-5" style={{ color: lm ? '#64748b' : '#94a3b8' }}>Select Your Role</p>

                    <div className="space-y-3">
                      {ROLES.map(({ key, label, sub, Icon }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleRoleSelect(key)}
                          className="w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group"
                          style={{
                            background: lm ? 'rgba(241,245,255,0.6)' : 'rgba(2,8,20,0.5)',
                            border: lm ? '1px solid rgba(59,130,246,0.15)' : '1px solid rgba(255,255,255,0.08)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = lm ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.12)'
                            e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'
                            e.currentTarget.style.transform = 'translateX(4px)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = lm ? 'rgba(241,245,255,0.6)' : 'rgba(2,8,20,0.5)'
                            e.currentTarget.style.borderColor = lm ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.08)'
                            e.currentTarget.style.transform = 'translateX(0)'
                          }}
                        >
                          <div className="flex items-center justify-center w-12 h-12 rounded-xl" style={{ background: 'rgba(59,130,246,0.1)' }}>
                            <Icon className="w-6 h-6 text-blue-400" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-base font-semibold" style={{ color: lm ? '#1e293b' : '#ffffff' }}>{label}</div>
                            <div className="text-xs" style={{ color: lm ? '#94a3b8' : '#64748b' }}>{sub}</div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Login Form
                  <div>
                    {/* Card header with back button */}
                    <div className="mb-7">
                      <button
                        type="button"
                        onClick={handleBackToRoles}
                        className="inline-flex items-center gap-1.5 text-sm mb-4 transition-colors"
                        style={{ color: lm ? '#64748b' : '#94a3b8' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
                        onMouseLeave={(e) => e.currentTarget.style.color = lm ? '#64748b' : '#94a3b8'}
                      >
                        <ArrowLeft className="w-4 h-4" /> Back to roles
                      </button>
                      <div className="text-center">
                        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: lm ? '#94a3b8' : '#64748b' }}>Welcome Back</p>
                        <h3 className="text-xl font-bold" style={{ color: lm ? '#1e293b' : '#ffffff', transition: 'color 0.4s ease' }}>Sign in as {ROLES.find(r => r.key === loginType)?.label}</h3>
                      </div>
                    </div>

                {/* Step: credentials */}
                {step === 'credentials' && (
                  <form onSubmit={handleSendOTP} className="step-enter space-y-4">

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: lm ? '#64748b' : '#94a3b8' }}>Phone Number</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none select-none" style={{ color: lm ? '#94a3b8' : '#64748b' }}>+91</span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="9800000000"
                          className="input-field w-full pl-14 pr-4 py-3 rounded-xl text-sm"
                          style={{ color: lm ? '#1e293b' : '#ffffff' }}
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    {(loginType === 'admin' || loginType === 'super_admin' || loginType === 'staff' || loginType === 'distributor') && (
                      <>
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-medium" style={{ color: lm ? '#64748b' : '#94a3b8' }}>
                              {isNewUser ? 'Set Password' : 'Password'}
                            </label>
                            {!isNewUser && (
                              <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                Forgot?
                              </button>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              placeholder={isNewUser ? 'Create password (min 6 chars)' : 'Enter your password'}
                              className="input-field w-full px-4 py-3 pr-11 rounded-xl text-sm"
                              style={{ color: lm ? '#1e293b' : '#ffffff' }}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                              style={{ color: lm ? '#94a3b8' : '#64748b' }}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {isNewUser && (
                          <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: lm ? '#64748b' : '#94a3b8' }}>Confirm Password</label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter password"
                                className="input-field w-full px-4 py-3 pr-11 rounded-xl text-sm"
                                style={{ color: lm ? '#1e293b' : '#ffffff' }}
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                                style={{ color: lm ? '#94a3b8' : '#64748b' }}
                              >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Info banner */}
                    {isNewUser && (
                      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-xs text-blue-300" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-blue-400" />
                        <span>Use the phone number provided by your {loginType === 'admin' ? 'SuperAdmin' : loginType === 'distributor' ? 'SuperAdmin' : 'Admin'}</span>
                      </div>
                    )}

                    {/* Error */}
                    {error && (
                      <div className="px-4 py-3 rounded-xl text-sm text-red-300" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                        {error}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="cta-btn w-full text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading
                        ? (isNewUser ? 'Setting up…' : 'Sending OTP…')
                        : (isNewUser ? 'Set Password & Send OTP' : 'Send OTP')}
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Toggle new/existing user */}
                    {(loginType === 'admin' || loginType === 'staff' || loginType === 'distributor') && (
                      <p className="text-center text-sm" style={{ color: lm ? '#64748b' : '#64748b' }}>
                        {isNewUser ? (
                          <>Already have an account?{' '}
                            <button type="button" onClick={() => setIsNewUser(false)} className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                              Sign In
                            </button>
                          </>
                        ) : (
                          <>First time here?{' '}
                            <button type="button" onClick={() => setIsNewUser(true)} className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                              Create Account
                            </button>
                          </>
                        )}
                      </p>
                    )}
                  </form>
                )}

                {/* Step: reset-otp */}
                {step === 'reset-otp' && (
                  <form onSubmit={handleVerifyResetOTP} className="step-enter space-y-5">
                    <div className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <div className="spin-ring absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 0deg, transparent 55%, rgba(99,102,241,0.5) 75%, rgba(59,130,246,0.8) 92%, transparent 100%)' }} />
                        <div className="absolute inset-[3px] rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
                          <Lock className="lock-icon w-8 h-8 text-blue-400" />
                        </div>
                      </div>
                      <h3 className="font-bold text-lg mb-1" style={{ color: lm ? '#1e293b' : '#ffffff', transition: 'color 0.4s ease' }}>Reset Password</h3>
                      <p className="text-sm" style={{ color: lm ? '#64748b' : '#94a3b8' }}>OTP sent to <span style={{ color: lm ? '#475569' : '#cbd5e1' }}>{phone}</span></p>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="inline-flex items-center gap-1 text-blue-400 text-xs hover:text-blue-300 transition-colors mt-2"
                      >
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

                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="cta-btn w-full text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? 'Verifying…' : 'Verify OTP'}
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="text-center">
                      {countdown > 0 ? (
                        <p className="text-sm" style={{ color: lm ? '#64748b' : '#94a3b8' }}>Resend OTP in <span className="font-medium tabular-nums" style={{ color: lm ? '#475569' : '#cbd5e1' }}>{countdown}s</span></p>
                      ) : (
                        <button type="button" onClick={handleForgotPassword} className="text-blue-400 text-sm hover:text-blue-300 font-medium transition-colors">
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </form>
                )}

                {/* Step: new-password */}
                {step === 'new-password' && (
                  <form onSubmit={handleResetPassword} className="step-enter space-y-4">
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
                          className="input-field w-full px-4 py-3 pr-11 rounded-xl text-sm"
                          style={{ color: lm ? '#1e293b' : '#ffffff' }}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                          style={{ color: lm ? '#94a3b8' : '#64748b' }}
                        >
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
                          className="input-field w-full px-4 py-3 pr-11 rounded-xl text-sm"
                          style={{ color: lm ? '#1e293b' : '#ffffff' }}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                          style={{ color: lm ? '#94a3b8' : '#64748b' }}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: lm ? '#991b1b' : '#fca5a5' }}>
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="cta-btn w-full text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? 'Resetting…' : 'Reset Password'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* Step: otp */}
                {step === 'otp' && (
                  <form onSubmit={handleVerifyOTP} className="step-enter space-y-5">
                    <div className="text-center">
                      {/* Animated lock */}
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        {/* Outer ring */}
                        <div className="spin-ring absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 0deg, transparent 55%, rgba(99,102,241,0.5) 75%, rgba(59,130,246,0.8) 92%, transparent 100%)' }} />
                        <div className="absolute inset-[3px] rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
                          <Lock className="lock-icon w-8 h-8 text-blue-400" />
                        </div>
                      </div>
                      <h3 className="font-bold text-lg mb-1" style={{ color: lm ? '#1e293b' : '#ffffff', transition: 'color 0.4s ease' }}>Verify OTP</h3>
                      <p className="text-slate-500 text-sm">Code sent to <span style={{ color: lm ? '#475569' : '#cbd5e1' }}>{phone}</span></p>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="inline-flex items-center gap-1 text-blue-400 text-xs hover:text-blue-300 transition-colors mt-2"
                      >
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

                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="cta-btn w-full text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? 'Verifying…' : 'Verify & Sign In'}
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="text-center">
                      {countdown > 0 ? (
                        <p className="text-slate-500 text-sm">Resend OTP in <span className="font-medium tabular-nums" style={{ color: lm ? '#475569' : '#cbd5e1' }}>{countdown}s</span></p>
                      ) : (
                        <button type="button" onClick={handleResendOTP} className="text-blue-400 text-sm hover:text-blue-300 font-medium transition-colors">
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </form>
                )}
                  </div>
                )}
              </div>

              <p className="text-center text-xs mt-5" style={{ color: lm ? '#94a3b8' : '#475569' }}>
                Protected by enterprise-grade security · Data encrypted & secure
              </p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer
          className="sticky bottom-0 z-20"
          style={{
            background: lm ? 'rgba(255,255,255,0.82)' : 'rgba(1,12,26,0.6)',
            backdropFilter: 'blur(20px)',
            borderTop: lm ? '1px solid rgba(59,130,246,0.1)' : '1px solid rgba(255,255,255,0.06)',
            transition: 'background 0.4s ease, border-color 0.4s ease',
          }}
        >
          <div className="w-full px-4 sm:px-6 py-3 text-xs" style={{ color: lm ? '#94a3b8' : '#475569' }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-0">
              <span className="order-2 sm:order-1">LedgerX v1.0</span>
              <span className="order-1 sm:order-2 sm:absolute sm:left-1/2 sm:-translate-x-1/2 text-center">
                © 2026 Indus Infotech. All rights reserved.
              </span>
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

export default Welcome
