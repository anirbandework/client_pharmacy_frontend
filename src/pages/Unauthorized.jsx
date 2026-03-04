import { useNavigate, Link } from 'react-router-dom'
import { ShieldX, LogOut, Building2, Shield } from 'lucide-react'

const Unauthorized = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
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
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
              {/* Icon */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <ShieldX className="w-8 h-8 text-red-400" />
                </div>
              </div>

              {/* Content */}
              <div className="text-center space-y-3 mb-6">
                <h1 className="text-2xl font-bold text-white">Access Denied</h1>
                <p className="text-slate-400 text-sm leading-relaxed">
                  You don't have permission to access this module. Please contact your administrator.
                </p>
              </div>

              {/* Action button */}
              <button
                onClick={handleGoBack}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Back to Login</span>
              </button>

              {/* Additional info */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-xs text-slate-400 text-center">
                  Need help? <Link to="/support" className="text-blue-400 hover:text-blue-300 underline transition-colors">Contact your system administrator</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized
