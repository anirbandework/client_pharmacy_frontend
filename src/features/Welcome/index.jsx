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
      desc: 'Auto reminders & repeat customers',
      status: 'Soon',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      icon: FileText, 
      title: 'Invoice Analyzer', 
      desc: 'Visual tracking with color coding',
      status: 'Soon',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      icon: Package, 
      title: 'Stock Audit', 
      desc: 'Random audits & reconciliation',
      status: 'Soon',
      color: 'from-green-500 to-green-600'
    },
    { 
      icon: TrendingUp, 
      title: 'Daily Records', 
      desc: 'Secure business tracking',
      status: 'Active',
      color: 'from-primary-500 to-primary-600'
    },
    { 
      icon: DollarSign, 
      title: 'Profit Analysis', 
      desc: 'Bill-wise profit margins',
      status: 'Soon',
      color: 'from-yellow-500 to-yellow-600'
    },
    { 
      icon: Bell, 
      title: 'Smart Alerts', 
      desc: 'WhatsApp notifications',
      status: 'Soon',
      color: 'from-red-500 to-red-600'
    }
  ]

  return (
    <div className="h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 relative overflow-hidden font-bauhaus flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl px-4">
        <div className="text-center mb-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            Complete Business Solution
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/80">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">System Ready</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 bg-gradient-to-br ${feature.color} rounded-lg`}>
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  feature.status === 'Active' 
                    ? 'bg-green-400/20 text-green-100 border border-green-400/30' 
                    : 'bg-white/10 text-white/70 border border-white/20'
                }`}>
                  {feature.status}
                </span>
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
              <p className="text-white/70 text-xs leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={handleEnter}
            className="group relative inline-flex"
          >
            <div className="absolute inset-0 bg-white rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-white text-primary-600 px-8 py-3 rounded-xl text-sm font-semibold shadow-glow-lg hover:shadow-glow transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center gap-2">
              Access Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Welcome