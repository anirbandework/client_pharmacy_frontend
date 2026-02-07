import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { ArrowRight, Lock, User } from 'lucide-react'

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
    <div className="h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 relative overflow-hidden font-bauhaus flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
            Genericart
          </h1>
          <p className="text-white/80 text-sm">Pharmacy Management System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl animate-fade-in">
          {/* Login Type Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setLoginType('staff'); setIsRegister(false); }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                loginType === 'staff'
                  ? 'bg-white text-primary-600 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Staff Login
            </button>
            <button
              onClick={() => { setLoginType('admin'); setIsRegister(false); }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                loginType === 'admin'
                  ? 'bg-white text-primary-600 shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Lock className="w-4 h-4 inline mr-2" />
              Admin Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {loginType === 'staff' ? (
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Staff UUID</label>
                <input
                  type="text"
                  value={uuid}
                  onChange={(e) => setUuid(e.target.value)}
                  placeholder="Enter your UUID"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  required
                />
              </div>
            ) : (
              <>
                {isRegister && (
                  <>
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter full name"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        required
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@pharmacy.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                    required
                  />
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-primary-600 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (isRegister ? 'Registering...' : 'Logging in...') : (isRegister ? 'Register' : 'Login')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {loginType === 'admin' && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-white/80 text-sm hover:text-white underline"
              >
                {isRegister ? 'Already have an account? Login' : 'New admin? Register here'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Welcome