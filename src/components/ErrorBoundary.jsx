import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const isDark = document.documentElement.classList.contains('dark') || 
                     localStorage.getItem('theme') === 'dark'

      return (
        <div
          className="fixed inset-0 overflow-y-auto"
          style={{ 
            background: isDark ? '#010c1a' : '#f0f6ff',
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
            <div
              className="max-w-md w-full rounded-3xl p-8 text-center"
              style={{
                background: isDark
                  ? 'linear-gradient(145deg, rgba(10,20,46,0.85) 0%, rgba(5,12,32,0.92) 100%)'
                  : 'linear-gradient(145deg, rgba(255,255,255,0.97) 0%, rgba(248,250,255,0.99) 100%)',
                border: isDark
                  ? '1px solid rgba(59,130,246,0.2)'
                  : '1px solid rgba(59,130,246,0.15)',
                backdropFilter: 'blur(24px)',
                boxShadow: isDark
                  ? '0 0 0 1px rgba(59,130,246,0.25), 0 0 30px rgba(59,130,246,0.08)'
                  : '0 8px 40px rgba(59,130,246,0.12), 0 0 0 1px rgba(59,130,246,0.15)',
                transition: 'background 0.4s ease, border-color 0.4s ease'
              }}
            >
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.25)'
                  }}
                >
                  <AlertTriangle className="w-10 h-10 text-red-400" />
                </div>
              </div>

              {/* Title */}
              <h2 
                className="text-2xl font-bold mb-3"
                style={{ 
                  color: isDark ? '#ffffff' : '#1e293b',
                  transition: 'color 0.4s ease'
                }}
              >
                Something Went Wrong
              </h2>

              {/* Description */}
              <p 
                className="text-sm mb-8 leading-relaxed"
                style={{ 
                  color: isDark ? '#94a3b8' : '#64748b',
                  transition: 'color 0.4s ease'
                }}
              >
                We encountered an unexpected error. Don't worry, your data is safe. 
                Try refreshing the page or return to the home page.
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => this.setState({ hasError: false })}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white transition-all"
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
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>

                <button
                  onClick={() => window.location.href = '/'}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.08)',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(59,130,246,0.15)',
                    color: isDark ? '#94a3b8' : '#64748b'
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
                  <Home className="w-4 h-4" />
                  Go Home
                </button>
              </div>

              {/* Footer note */}
              <p 
                className="text-xs mt-6"
                style={{ 
                  color: isDark ? '#475569' : '#94a3b8',
                  transition: 'color 0.4s ease'
                }}
              >
                If this problem persists, please contact support
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary