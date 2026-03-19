import React, { useEffect, useRef, useState } from 'react'
import { Users, Clock, FileText, BarChart3, Package, IndianRupee } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

const features = [
  { icon: Users,        color: 'blue',   title: 'Multi-Level Access',      description: 'Organization, Admin & Staff hierarchy' },
  { icon: Clock,        color: 'violet', title: 'Smart Attendance',         description: 'WiFi-based auto check-in/out'            },
  { icon: FileText,     color: 'emerald',title: 'AI Invoice Processing',    description: 'Automatic data extraction from PDFs'    },
  { icon: BarChart3,    color: 'amber',  title: 'Real-Time Analytics',      description: 'Live dashboards & insights'              },
  { icon: Package,      color: 'indigo', title: 'Inventory Control',        description: 'Stock audit & expiry tracking'          },
  { icon: IndianRupee,  color: 'rose',   title: 'Payroll Management',       description: 'Automated salary processing'            },
]

const palette = {
  blue:    { border: 'rgba(59,130,246,0.35)',  bg: 'rgba(59,130,246,0.1)',  glow: 'rgba(59,130,246,0.12)',  text: '#60a5fa' },
  violet:  { border: 'rgba(139,92,246,0.35)', bg: 'rgba(139,92,246,0.1)', glow: 'rgba(139,92,246,0.12)', text: '#a78bfa' },
  emerald: { border: 'rgba(16,185,129,0.35)', bg: 'rgba(16,185,129,0.1)', glow: 'rgba(16,185,129,0.12)', text: '#34d399' },
  amber:   { border: 'rgba(245,158,11,0.35)',  bg: 'rgba(245,158,11,0.1)',  glow: 'rgba(245,158,11,0.12)',  text: '#fbbf24' },
  indigo:  { border: 'rgba(99,102,241,0.35)',  bg: 'rgba(99,102,241,0.1)',  glow: 'rgba(99,102,241,0.12)',  text: '#818cf8' },
  rose:    { border: 'rgba(244,63,94,0.35)',   bg: 'rgba(244,63,94,0.1)',   glow: 'rgba(244,63,94,0.12)',   text: '#fb7185' },
}

const FeatureCarousel = () => {
  const { isDark: darkMode } = useTheme()
  const scrollRef = useRef(null)
  const [isPaused, setIsPaused] = useState(false)
  const [hovered, setHovered] = useState(null)
  const lm = !darkMode

  useEffect(() => {
    const el = scrollRef.current
    if (!el || isPaused) return
    const CARD_W = 272
    const total = CARD_W * features.length
    const id = setInterval(() => {
      if (el.scrollLeft >= total) el.scrollLeft = 0
      else el.scrollLeft += 1
    }, 28)
    return () => clearInterval(id)
  }, [isPaused])

  // Fade edge color matches the parent background
  const edgeBg = lm ? '#f0f6ff' : '#010c1a'

  return (
    <div className="relative">
      <style>{`
        .fc-scrollbar::-webkit-scrollbar { display: none; }
        .fc-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fc-card-in {
          from { opacity:0; transform: translateY(10px) scale(0.97); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }
        .fc-card { transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.4s ease, border-color 0.4s ease; }
        .fc-card:hover { transform: translateY(-4px) scale(1.02); }
      `}</style>

      {/* Left/right fade edges — matches background color */}
      <div className="absolute left-0 top-0 bottom-4 w-10 z-10 pointer-events-none" style={{ background: `linear-gradient(to right, ${edgeBg}, transparent)` }} />
      <div className="absolute right-0 top-0 bottom-4 w-10 z-10 pointer-events-none" style={{ background: `linear-gradient(to left, ${edgeBg}, transparent)` }} />

      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => { setIsPaused(false); setHovered(null) }}
        className="fc-scrollbar flex gap-4 overflow-x-auto pb-4 pt-2"
      >
        {[...features, ...features].map((f, i) => {
          const Icon = f.icon
          const p = palette[f.color]
          const isHov = hovered === i
          return (
            <div
              key={i}
              className="fc-card flex-shrink-0 w-64 rounded-2xl p-4 cursor-default"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: isHov
                  ? lm
                    ? `linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,255,1))`
                    : `linear-gradient(135deg, rgba(10,20,46,0.9), rgba(8,15,38,0.95))`
                  : lm
                    ? 'rgba(255,255,255,0.75)'
                    : 'rgba(8,16,38,0.7)',
                border: `1px solid ${isHov ? p.border : lm ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.06)'}`,
                boxShadow: isHov
                  ? `0 8px 32px ${p.glow}, 0 0 0 1px ${p.border}${lm ? ', 0 2px 8px rgba(0,0,0,0.04)' : ''}`
                  : lm ? '0 2px 8px rgba(59,130,246,0.05)' : 'none',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-200"
                style={{
                  background: isHov ? p.bg : lm ? 'rgba(241,245,255,0.9)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isHov ? p.border : lm ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <Icon style={{ width: 18, height: 18, color: isHov ? p.text : lm ? '#94a3b8' : '#475569' }} />
              </div>
              <h3 className="font-semibold text-sm mb-0.5 transition-colors duration-200" style={{ color: isHov ? (lm ? '#1e293b' : '#f1f5f9') : lm ? '#475569' : '#94a3b8' }}>
                {f.title}
              </h3>
              <p className="text-xs leading-relaxed transition-colors duration-200" style={{ color: isHov ? (lm ? '#64748b' : '#64748b') : lm ? '#94a3b8' : '#334155' }}>
                {f.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FeatureCarousel
