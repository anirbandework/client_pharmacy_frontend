import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { ArrowRight, Lock, User, BarChart3, Package, Users, Search, DollarSign, TrendingUp } from 'lucide-react'

const Welcome = () => {
  const navigate = useNavigate()
  const { adminLogin, staffLogin, adminRegister } = useAuth()
  const [loginType, setLoginType] = useState('staff')
  const [isRegister, setIsRegister] = useState(false)
  const [uuid, setUuid] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (loginType === 'staff') {
        await staffLogin(uuid)
        navigate('/daily-records')
      } else if (isRegister) {
        await adminRegister({ email, password, full_name: fullName, phone })
        setIsRegister(false)
        setError('Registration successful! Please login.')
      } else {
        await adminLogin(email, password)
        navigate('/admin')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 relative overflow-hidden flex items-start justify-center pt-4 md:pt-8">
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
            
            {/* Login Type Toggle */}
            <div className="flex gap-2 mb-6 p-1.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
              <button
                onClick={() => { setLoginType('staff'); setIsRegister(false); }}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  loginType === 'staff'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Staff Login
              </button>
              <button
                onClick={() => { setLoginType('admin'); setIsRegister(false); }}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  loginType === 'admin'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Lock className="w-4 h-4 inline mr-2" />
                Admin Login
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {loginType === 'staff' ? (
                <>
                  <div className="space-y-2">
                    <label className="block text-white text-sm font-semibold">Staff UUID</label>
                    <input
                      type="text"
                      value={uuid}
                      onChange={(e) => setUuid(e.target.value)}
                      placeholder="Enter your UUID"
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-white text-sm font-semibold">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  {isRegister && (
                    <>
                      <div className="space-y-2">
                        <label className="block text-white text-sm font-semibold">Full Name</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter full name"
                          className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-white text-sm font-semibold">Phone</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter phone number"
                          className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all"
                          required
                        />
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                    <label className="block text-white text-sm font-semibold">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@pharmacy.com"
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-white text-sm font-semibold">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all"
                      required
                    />
                  </div>
                </>
              )}

              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-white px-4 py-2 rounded-xl text-sm font-medium animate-fade-in">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (isRegister ? 'Registering...' : 'Logging in...') : (isRegister ? 'Register' : 'Login')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {loginType === 'admin' && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-white text-sm hover:text-blue-200 font-medium transition-colors"
                >
                  {isRegister ? 'Already have an account? Login' : 'New admin? Register here'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Welcome