import { useNavigate } from 'react-router-dom'
import { ShieldX, LogOut } from 'lucide-react'

const Unauthorized = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-pink-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-red-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Glass card */}
      <div className="relative z-10 max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Icon with glow effect */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-red-500 to-pink-600 rounded-full p-5 mx-auto w-20 h-20 flex items-center justify-center shadow-lg">
              <ShieldX className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-bold text-white">
              Access Denied
            </h1>
            <p className="text-white/80 text-sm leading-relaxed">
              You don't have permission to access this module. Please contact your administrator.
            </p>
          </div>

          {/* Action button */}
          <div className="mt-6">
            <button
              onClick={handleGoBack}
              className="w-full group relative overflow-hidden bg-white text-red-600 font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-red-50 transition-all duration-300"
            >
              <div className="relative flex items-center justify-center gap-2">
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Back to Login</span>
              </div>
            </button>
          </div>

          {/* Additional info */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-xs text-white/70 text-center">
              Need help? Contact your system administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized
