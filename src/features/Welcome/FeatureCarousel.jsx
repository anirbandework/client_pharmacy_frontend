import React, { useEffect, useRef, useState } from 'react'
import { Users, Clock, FileText, BarChart3, Package, DollarSign } from 'lucide-react'

const FeatureCarousel = () => {
  const scrollRef = useRef(null)
  const [isPaused, setIsPaused] = useState(false)

  const features = [
    {
      icon: Users,
      color: 'blue',
      title: 'Multi-Level Access',
      description: 'Organization, Admin & Staff hierarchy'
    },
    {
      icon: Clock,
      color: 'purple',
      title: 'Smart Attendance',
      description: 'WiFi-based auto check-in/out'
    },
    {
      icon: FileText,
      color: 'green',
      title: 'AI Invoice Processing',
      description: 'Automatic data extraction from PDFs'
    },
    {
      icon: BarChart3,
      color: 'yellow',
      title: 'Real-Time Analytics',
      description: 'Live dashboards & insights'
    },
    {
      icon: Package,
      color: 'indigo',
      title: 'Inventory Control',
      description: 'Stock audit & expiry tracking'
    },
    {
      icon: DollarSign,
      color: 'pink',
      title: 'Payroll Management',
      description: 'Automated salary processing'
    }
  ]

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer || isPaused) return

    const scroll = () => {
      const cardWidth = 272 // 256px + 16px gap
      const totalWidth = cardWidth * features.length
      
      if (scrollContainer.scrollLeft >= totalWidth) {
        scrollContainer.scrollLeft = 0
      } else {
        scrollContainer.scrollLeft += 1
      }
    }

    const interval = setInterval(scroll, 30)
    return () => clearInterval(interval)
  }, [isPaused, features.length])

  const colorClasses = {
    blue: { border: 'hover:border-blue-500/50', bg: 'bg-blue-500/10 group-hover:bg-blue-500/20', text: 'text-blue-400' },
    purple: { border: 'hover:border-purple-500/50', bg: 'bg-purple-500/10 group-hover:bg-purple-500/20', text: 'text-purple-400' },
    green: { border: 'hover:border-green-500/50', bg: 'bg-green-500/10 group-hover:bg-green-500/20', text: 'text-green-400' },
    yellow: { border: 'hover:border-yellow-500/50', bg: 'bg-yellow-500/10 group-hover:bg-yellow-500/20', text: 'text-yellow-400' },
    indigo: { border: 'hover:border-indigo-500/50', bg: 'bg-indigo-500/10 group-hover:bg-indigo-500/20', text: 'text-indigo-400' },
    pink: { border: 'hover:border-pink-500/50', bg: 'bg-pink-500/10 group-hover:bg-pink-500/20', text: 'text-pink-400' }
  }

  return (
    <div className="relative">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div 
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
      >
        {/* Render cards twice for seamless loop */}
        {[...features, ...features].map((feature, index) => {
          const Icon = feature.icon
          const colors = colorClasses[feature.color]
          return (
            <div 
              key={index}
              className={`flex-shrink-0 w-64 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 ${colors.border} transition-all group`}
            >
              <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center mb-3 transition-all`}>
                <Icon className={`w-5 h-5 ${colors.text}`} />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
              <p className="text-slate-400 text-xs">{feature.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FeatureCarousel
