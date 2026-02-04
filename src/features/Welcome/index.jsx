import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react'

const Welcome = () => {
  const navigate = useNavigate()

  const handleEnter = () => {
    navigate('/daily-records')
  }

  const features = [
    { icon: TrendingUp, title: 'Real-time Tracking', desc: 'Monitor daily records instantly' },
    { icon: Shield, title: 'Secure & Reliable', desc: 'Your data is safe with us' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for performance' },
    { icon: BarChart3, title: 'Smart Analytics', desc: 'Auto-calculated insights' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 relative overflow-hidden font-bauhaus">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo/Icon */}
        <div className="mb-8 animate-bounce-subtle">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center border border-white/30 shadow-glow-lg">
            <BarChart3 className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Daily Records
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light">
            Smart Business Management System
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-white/80">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">System Online</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleEnter}
          className="group relative mb-16 animate-scale-in"
        >
          <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div className="relative bg-white text-primary-600 px-10 py-5 rounded-2xl text-lg font-semibold shadow-glow-lg hover:shadow-glow transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center gap-3">
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <feature.icon className="w-8 h-8 text-white mb-2" />
              <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
              <p className="text-white/70 text-xs">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 text-center">
          <p className="text-white/60 text-sm">
            Powered by Modern Technology
          </p>
        </div>
      </div>
    </div>
  )
}

export default Welcome