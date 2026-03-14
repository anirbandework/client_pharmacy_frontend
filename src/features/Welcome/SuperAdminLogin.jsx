import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import OTPInput from '../../components/OTPInput'
import { ArrowRight, ArrowLeft, Shield, Eye, EyeOff, Building2, Lock, AlertTriangle } from 'lucide-react'

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
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)

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
  const resetForm = () => { setStep('credentials'); setOtp(''); setError('') }

  return (
    <div className="fixed inset-0 overflow-y-auto" style={{ background: '#010c1a' }}>
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
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -15%, rgba(60,20,100,0.5) 0%, transparent 68%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 45% at 80% 85%, rgba(40,15,80,0.35) 0%, transparent 58%)' }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
          backgroundSize: '36px 36px',
        }} />
        <div className="sa-orb-1 absolute top-[8%] left-[10%] w-[480px] h-[480px] rounded-full"
          style={{ background: 'radial-gradient(circle,rgba(139,92,246,0.13) 0%,transparent 68%)', filter: 'blur(45px)' }} />
        <div className="sa-orb-2 absolute bottom-[8%] right-[8%] w-[560px] h-[560px] rounded-full"
          style={{ background: 'radial-gradient(circle,rgba(109,40,217,0.10) 0%,transparent 68%)', filter: 'blur(55px)' }} />
        <div className="sa-orb-3 absolute top-[42%] left-[48%] w-[380px] h-[380px] rounded-full"
          style={{ background: 'radial-gradient(circle,rgba(168,85,247,0.07) 0%,transparent 68%)', filter: 'blur(60px)' }} />
        {PARTICLES.map(p => (
          <div key={p.id} className="absolute rounded-full" style={{
            left: p.left, top: p.top,
            width: `${p.size}px`, height: `${p.size}px`,
            background: `rgba(196,181,253,${p.opacity})`,
            animation: `sa-particle ${p.duration} ${p.delay} ease-in-out infinite`,
          }} />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Header */}
        <header className="sticky top-0 z-20" style={{ background: 'rgba(1,8,20,0.6)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(139,92,246,0.12)' }}>
          <div className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className={`flex items-center gap-3 ${mounted ? 'sa-appear' : 'opacity-0'}`}>
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0">
                <div className="sa-spin-ring absolute inset-0 rounded-xl" style={{ background: 'conic-gradient(from 0deg,transparent 60%,rgba(139,92,246,0.6) 80%,rgba(168,85,247,0.8) 95%,transparent 100%)' }} />
                <div className="absolute inset-[2px] rounded-[10px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#5b21b6,#7c3aed)' }}>
                  <Building2 className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">LedgerX</h1>
                <p className="text-[10px] sm:text-xs text-slate-500 leading-none">A Business Solution</p>
              </div>
            </div>
            <div className={`flex items-center gap-3 ${mounted ? 'sa-appear' : 'opacity-0'}`} style={{ animationDelay: '0.15s' }}>
              <p className="hidden sm:block text-xs text-slate-500">powered by <span className="font-semibold text-slate-300">Indus Infotech</span></p>
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
            <div className="sa-card-glow rounded-3xl p-6 sm:p-8" style={{
              background: 'linear-gradient(145deg,rgba(14,8,40,0.88) 0%,rgba(6,4,24,0.94) 100%)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(139,92,246,0.2)',
            }}>
              {/* Shield logo */}
              <div className="text-center mb-7">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className="sa-spin-ring absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 0deg,transparent 55%,rgba(139,92,246,0.5) 75%,rgba(168,85,247,0.8) 92%,transparent 100%)' }} />
                  <div className="absolute inset-[3px] rounded-full flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}>
                    <Shield className="sa-lock-glow w-9 h-9 text-violet-400" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white mb-1">SuperAdmin Access</h2>
                <p className="text-sm text-slate-500">Authorised personnel only</p>
              </div>

              {/* Credentials step */}
              {step === 'credentials' && (
                <form onSubmit={handleSendOTP} className="sa-step space-y-4">
                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-1.5">Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">+91</span>
                      <input
                        type="tel" value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="9800000000"
                        className="sa-input w-full pl-14 pr-4 py-3 rounded-xl text-white placeholder-slate-600 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'} value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="sa-input w-full px-4 py-3 pr-11 rounded-xl text-white placeholder-slate-600 text-sm"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors">
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
                    <Link to="/" className="text-slate-500 text-sm hover:text-slate-300 transition-colors inline-flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3" /> Back to Login
                    </Link>
                  </div>
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
                    <h3 className="text-white font-bold text-lg mb-1">Verify OTP</h3>
                    <p className="text-slate-500 text-sm">Code sent to <span className="text-slate-300">+91 {phone}</span></p>
                    <button type="button" onClick={resetForm}
                      className="inline-flex items-center gap-1 text-violet-400 text-xs hover:text-violet-300 transition-colors mt-2">
                      <ArrowLeft className="w-3 h-3" /> Change number
                    </button>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-3 text-center">Enter 6-digit OTP</label>
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
                      <p className="text-slate-500 text-sm">Resend in <span className="text-slate-300 tabular-nums">{countdown}s</span></p>
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

            <p className="text-center text-slate-600 text-xs mt-5">
              Protected by enterprise-grade security · Data encrypted & secure
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="sticky bottom-0 z-20" style={{ background: 'rgba(1,8,20,0.6)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(139,92,246,0.08)' }}>
          <div className="w-full px-4 sm:px-6 py-3 text-xs text-slate-600">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5">
              <span className="order-2 sm:order-1">LedgerX v1.0</span>
              <span className="order-1 sm:order-2 sm:absolute sm:left-1/2 sm:-translate-x-1/2">© 2026 Indus Infotech. All rights reserved.</span>
              <div className="order-3 flex items-center gap-4">
                <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy</Link>
                <Link to="/terms-of-service" className="hover:text-slate-300 transition-colors">Terms</Link>
                <Link to="/support" className="hover:text-slate-300 transition-colors">Support</Link>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  )
}

export default SuperAdminLogin
