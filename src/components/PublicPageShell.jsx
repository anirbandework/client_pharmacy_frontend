/**
 * PublicPageShell
 *
 * Shared wrapper for all public (unauthenticated) pages:
 *   Welcome, PrivacyPolicy, TermsOfService, Support, SuperAdminLogin
 *
 * Provides:
 *   - Welcome-style animated background (radial gradients, grid, orbs, particles)
 *   - Sticky header: LedgerX logo + spinning ring + theme toggle + secure badge
 *   - Sticky footer: version + copyright + nav links
 *   - Reads isDark from ThemeContext — no local state needed in pages
 *
 * Usage:
 *   <PublicPageShell>
 *     <main className="flex-1 px-4 sm:px-6 py-10">
 *       ... your page content ...
 *     </main>
 *   </PublicPageShell>
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { t } from '../theme'

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left:     `${(i * 43 + 9)  % 100}%`,
  top:      `${(i * 61 + 19) % 100}%`,
  size:     (i % 3) + 1,
  delay:    `${(i * 0.4) % 6}s`,
  duration: `${12 + (i % 7) * 2}s`,
  opacity:  0.06 + (i % 4) * 0.06,
}))

export default function PublicPageShell({ children }) {
  const { isDark, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setTimeout(() => setMounted(true), 60) }, [])

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: t.pageBg(isDark), transition: 'background 0.4s ease' }}
    >
      <style>{`
        @keyframes shell-orb {
          0%,100% { transform: translateY(0) scale(1); }
          40%      { transform: translateY(-30px) scale(1.03); }
          70%      { transform: translateY(15px) scale(0.97); }
        }
        @keyframes shell-particle {
          0%,100% { transform: translate(0,0); }
          30%      { transform: translate(5px,-8px); }
          65%      { transform: translate(-6px,-11px); }
        }
        @keyframes shell-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .shell-orb-1 { animation: shell-orb 9s ease-in-out infinite; }
        .shell-orb-2 { animation: shell-orb 13s ease-in-out infinite reverse; animation-delay:-5s; }
        .shell-spin  { animation: shell-spin 9s linear infinite; }
      `}</style>

      {/* ── Background ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Radial top */}
        <div className="absolute inset-0" style={{
          background: isDark
            ? 'radial-gradient(ellipse 80% 55% at 50% -10%, rgba(17,43,99,0.5) 0%, transparent 68%)'
            : 'radial-gradient(ellipse 80% 55% at 50% -10%, rgba(147,197,253,0.4) 0%, transparent 68%)',
          transition: 'background 0.4s ease',
        }} />
        {/* Radial bottom-right */}
        <div className="absolute inset-0" style={{
          background: isDark
            ? 'radial-gradient(ellipse 60% 50% at 85% 90%, rgba(29,20,85,0.35) 0%, transparent 60%)'
            : 'radial-gradient(ellipse 60% 50% at 85% 90%, rgba(167,139,250,0.22) 0%, transparent 60%)',
          transition: 'background 0.4s ease',
        }} />
        {/* Grid */}
        <div className="absolute inset-0" style={t.gridBg(isDark)} />
        {/* Orbs */}
        <div
          className="shell-orb-1 absolute top-[5%] right-[10%] w-[500px] h-[500px] rounded-full"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(59,130,246,0.11) 0%, transparent 68%)'
              : 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 68%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="shell-orb-2 absolute bottom-[10%] left-[8%] w-[420px] h-[420px] rounded-full"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 68%)'
              : 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 68%)',
            filter: 'blur(55px)',
          }}
        />
        {/* Particles */}
        {PARTICLES.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: p.left, top: p.top,
              width: `${p.size}px`, height: `${p.size}px`,
              background: isDark
                ? `rgba(148,163,184,${p.opacity})`
                : `rgba(100,140,220,${p.opacity * 0.6})`,
              animation: `shell-particle ${p.duration} ${p.delay} ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-20" style={t.header(isDark)}>
        <div className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">

          {/* Logo */}
          <div className={`flex items-center gap-3 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0">
              <div
                className="shell-spin absolute inset-0 rounded-xl"
                style={{ background: 'conic-gradient(from 0deg, transparent 60%, rgba(99,102,241,0.6) 80%, rgba(59,130,246,0.8) 95%, transparent 100%)' }}
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: t.text.primary(isDark), transition: 'color 0.4s ease' }}>
                LedgerX
              </h1>
              <p className="text-[10px] sm:text-xs leading-none" style={{ color: t.text.muted(isDark) }}>
                A Business Solution
              </p>
            </div>
          </div>

          {/* Right side */}
          <div
            className={`flex items-center gap-3 sm:gap-4 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '0.15s' }}
          >
            <p className="hidden sm:block text-xs" style={{ color: t.text.muted(isDark) }}>
              powered by{' '}
              <span className="text-sm font-semibold" style={{ color: t.text.label(isDark) }}>
                Indus Infotech
              </span>
            </p>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              style={t.themeToggle(isDark)}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark
                ? <Sun  style={{ width: 14, height: 14, color: '#fbbf24' }} />
                : <Moon style={{ width: 14, height: 14, color: '#6366f1' }} />
              }
              <span
                className="text-[10px] sm:text-xs font-medium hidden sm:block"
                style={{ color: isDark ? '#fbbf24' : '#6366f1' }}
              >
                {isDark ? 'Light' : 'Dark'}
              </span>
            </button>

            {/* Secure badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] sm:text-xs text-green-400 font-medium">Secure</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Page content (slot) ── */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>

      {/* ── Footer ── */}
      <footer
        className="relative z-10 sticky bottom-0"
        style={{
          background: isDark ? 'rgba(1,12,26,0.6)' : 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(20px)',
          borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.1)',
          transition: 'background 0.4s ease, border-color 0.4s ease',
        }}
      >
        <div
          className="w-full px-4 sm:px-6 py-3 text-xs"
          style={{ color: t.text.muted(isDark) }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-0">
            <span className="order-2 sm:order-1">LedgerX v1.0</span>
            <span className="order-1 sm:order-2 sm:absolute sm:left-1/2 sm:-translate-x-1/2 text-center">
              © 2026 Indus Infotech. All rights reserved.
            </span>
            <div className="order-3 flex items-center gap-4">
              <Link to="/privacy-policy" className="hover:text-slate-400 transition-colors">Privacy</Link>
              <Link to="/terms-of-service" className="hover:text-slate-400 transition-colors">Terms</Link>
              <Link to="/support" className="hover:text-slate-400 transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
