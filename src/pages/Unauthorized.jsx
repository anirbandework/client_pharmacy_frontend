import { useNavigate, Link } from 'react-router-dom'
import { ShieldX, LogOut, ArrowLeft, AlertCircle } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { t } from '../theme'

const Unauthorized = () => {
  const navigate = useNavigate()
  const { isDark } = useTheme()

  const handleGoBack = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{ 
        background: t.pageBg(isDark),
        transition: 'background 0.4s ease'
      }}
    >
      {/* Background layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0" 
          style={{ 
            background: isDark
              ? 'radial-gradient(ellipse 90% 65% at 50% -10%, rgba(17,43,99,0.55) 0%, transparent 68%)'
              : 'radial-gradient(ellipse 90% 65% at 50% -10%, rgba(147,197,253,0.45) 0%, transparent 68%)'
          }} 
        />
        <div 
          className="absolute inset-0" 
          style={{ 
            background: isDark
              ? 'radial-gradient(ellipse 60% 50% at 85% 90%, rgba(29,20,85,0.4) 0%, transparent 60%)'
              : 'radial-gradient(ellipse 60% 50% at 85% 90%, rgba(167,139,250,0.28) 0%, transparent 60%)'
          }} 
        />
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: isDark
              ? 'linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)'
              : 'linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px)',
            backgroundSize: '36px 36px'
          }} 
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Main Card */}
          <div
            className="rounded-3xl p-8 text-center"
            style={{
              ...t.glassCard(isDark),
              boxShadow: isDark
                ? '0 0 0 1px rgba(59,130,246,0.25), 0 0 30px rgba(59,130,246,0.08)'
                : '0 8px 40px rgba(59,130,246,0.12), 0 0 0 1px rgba(59,130,246,0.15)'
            }}
          >
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center relative"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)'
                }}
              >
                <ShieldX className="w-10 h-10 text-red-400" />
              </div>
            </div>

            {/* Title */}
            <h1 
              className="text-2xl font-bold mb-3"
              style={{ 
                color: t.text.primary(isDark),
                transition: 'color 0.4s ease'
              }}
            >
              Access Denied
            </h1>

            {/* Description */}
            <p 
              className="text-sm mb-8 leading-relaxed"
              style={{ 
                color: t.text.secondary(isDark),
                transition: 'color 0.4s ease'
              }}
            >
              You don't have permission to access this module. Please contact your administrator or return to login.
            </p>

            {/* Info Box */}
            <div
              className="mb-8 p-4 rounded-xl flex items-start gap-3 text-left"
              style={{
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.2)'
              }}
            >
              <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-blue-300 font-medium mb-1">Why am I seeing this?</p>
                <p className="text-xs" style={{ color: t.text.muted(isDark) }}>
                  Your account doesn't have the required permissions for this resource. Contact your system administrator for access.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleGoBack}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #7c3aed 100%)',
                  boxShadow: '0 4px 16px rgba(59,130,246,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(59,130,246,0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(59,130,246,0.3)'
                }}
              >
                <LogOut className="w-4 h-4" />
                Back to Login
              </button>

              <button
                onClick={() => navigate(-1)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.08)',
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(59,130,246,0.15)',
                  color: t.text.secondary(isDark)
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(59,130,246,0.12)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.08)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
            </div>

            {/* Footer */}
            <div 
              className="mt-8 pt-6"
              style={{ borderTop: `1px solid ${t.divider(isDark)}` }}
            >
              <p 
                className="text-xs"
                style={{ color: t.text.muted(isDark) }}
              >
                Need help?{' '}
                <Link 
                  to="/support" 
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Contact Support
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom note */}
          <p 
            className="text-center text-xs mt-5"
            style={{ 
              color: t.text.label(isDark),
              transition: 'color 0.4s ease'
            }}
          >
            Protected by enterprise-grade security · LedgerX v1.0
          </p>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized
