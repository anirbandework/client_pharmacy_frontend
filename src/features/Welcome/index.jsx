import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Users, FileText, Package, TrendingUp, DollarSign, Bell } from 'lucide-react'

const Welcome = () => {
  const navigate = useNavigate()

  const handleEnter = () => {
    navigate('/daily-records')
  }

  const features = [
    { 
      icon: Users, 
      title: 'Customer Tracking', 
      desc: 'Auto reminders & repeat customer management',
      status: 'Coming Soon',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      icon: FileText, 
      title: 'Invoice Analyzer', 
      desc: 'Visual invoice tracking with color coding',
      status: 'Coming Soon',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      icon: Package, 
      title: 'Stock Audit', 
      desc: 'Random section audits & reconciliation',
      status: 'Coming Soon',
      color: 'from-green-500 to-green-600'
    },
    { 
      icon: TrendingUp, 
      title: 'Daily Records', 
      desc: 'Secure daily business tracking',
      status: 'Active',
      color: 'from-primary-500 to-primary-600'
    },
    { 
      icon: DollarSign, 
      title: 'Profit Analysis', 
      desc: 'Bill-wise profit margin calculation',
      status: 'Coming Soon',
      color: 'from-yellow-500 to-yellow-600'
    },
    { 
      icon: Bell, 
      title: 'Smart Alerts', 
      desc: 'WhatsApp notifications & reminders',
      status: 'Coming Soon',
      color: 'from-red-500 to-red-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 relative overflow-hidden font-bauhaus">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Logo */}
        <div className="mb-6 animate-bounce-subtle">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30 shadow-glow-lg">
            <Package className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">
            Pharmacy Management
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-light mb-2">
            Complete Business Solution
          </p>
          <div className="flex items-center justify-center gap-2 text-white/80">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">System Ready</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleEnter}
          className="group relative mb-12 animate-scale-in"
        >
          <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <div className="relative bg-white text-primary-600 px-8 py-4 rounded-2xl text-base font-semibold shadow-glow-lg hover:shadow-glow transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center gap-3">
            Access Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl w-full animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 bg-gradient-to-br ${feature.color} rounded-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  feature.status === 'Active' 
                    ? 'bg-green-400/20 text-green-100 border border-green-400/30' 
                    : 'bg-white/10 text-white/70 border border-white/20'
                }`}>
                  {feature.status}
                </span>
              </div>
              <h3 className="text-white font-semibold text-base mb-1.5">{feature.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-white/60 text-sm">
            Powered by Modern Technology • Secure & Reliable
          </p>
        </div>
      </div>
    </div>
  )
}

export default Welcome