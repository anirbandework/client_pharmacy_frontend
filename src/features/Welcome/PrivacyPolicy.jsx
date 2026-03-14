import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Shield, ArrowLeft, Lock, MapPin, Brain, Database, Clock, UserCheck, Mail } from 'lucide-react'

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 43 + 9) % 100}%`,
  top: `${(i * 61 + 19) % 100}%`,
  size: (i % 3) + 1,
  delay: `${(i * 0.4) % 6}s`,
  duration: `${12 + (i % 7) * 2}s`,
  opacity: 0.06 + (i % 4) * 0.06,
}))

const sections = [
  {
    num: '01', Icon: UserCheck, color: 'blue',
    title: 'Information We Collect',
    body: 'We collect information necessary to provide LedgerX services including: staff names, phone numbers, email addresses, attendance data (WiFi connection, GPS location for geofencing), salary information, payment details (UPI/bank account), purchase invoices, inventory data, sales records, and customer information (name, phone for billing purposes).',
  },
  {
    num: '02', Icon: Brain, color: 'indigo',
    title: 'How We Use Your Information',
    body: 'Your data is used to: manage staff attendance through WiFi-based automatic check-in/out, process salary payments, send OTP for authentication, track inventory and sales, generate bills and invoices, provide AI-powered invoice processing, send notifications to staff, generate analytics and reports, and improve our services.',
  },
  {
    num: '03', Icon: Lock, color: 'violet',
    title: 'Data Security & Encryption',
    body: 'We implement industry-standard security measures including: bcrypt password hashing (72-byte limit), JWT token-based authentication with 24-hour expiry, encrypted storage of sensitive payment information, secure file storage for invoice PDFs, role-based access control ensuring staff can only access their shop\'s data, and organisation-level data isolation.',
  },
  {
    num: '04', Icon: MapPin, color: 'emerald',
    title: 'Location Data & Privacy',
    body: 'GPS location is collected only for attendance geofencing validation (within 100 meters of shop). Location data is not stored permanently—only distance calculations are performed. Staff are notified when location is being checked, and location tracking only occurs during work hours when connected to shop WiFi.',
  },
  {
    num: '05', Icon: Brain, color: 'amber',
    title: 'AI Processing & Third-Party Services',
    body: 'We use Google Gemini 2.5 Flash AI for automatic invoice data extraction from PDFs. Invoice data is processed securely and used only for extracting structured information. We also use SMS services for OTP delivery. No data is shared with third parties for marketing purposes.',
  },
  {
    num: '06', Icon: Database, color: 'rose',
    title: 'Data Retention & Access',
    body: 'We retain your data as long as your account is active or as needed to provide services. Complete audit trails and transaction history are maintained indefinitely for compliance. Staff can view their own attendance, salary, and notification history. Admins can access all data within their organisation. You may request data deletion by contacting support.',
  },
  {
    num: '07', Icon: Shield, color: 'cyan',
    title: 'Your Rights',
    body: 'You have the right to: access your personal data, update your payment information, view your attendance and salary records, request data correction, request account deletion, and opt-out of non-essential notifications. Staff can manage their own payment details (UPI/bank account) through self-service portal.',
  },
  {
    num: '08', Icon: Mail, color: 'pink',
    title: 'Contact Us',
    body: 'For privacy concerns or data requests, contact us at privacy@indusinfotech.com or call +91 1800-123-456.',
  },
]

const palette = {
  blue:    { accent: '#60a5fa', bg: 'rgba(59,130,246,0.08)',   border: 'rgba(59,130,246,0.2)'  },
  indigo:  { accent: '#818cf8', bg: 'rgba(99,102,241,0.08)',   border: 'rgba(99,102,241,0.2)'  },
  violet:  { accent: '#a78bfa', bg: 'rgba(139,92,246,0.08)',   border: 'rgba(139,92,246,0.2)'  },
  emerald: { accent: '#34d399', bg: 'rgba(16,185,129,0.08)',   border: 'rgba(16,185,129,0.2)'  },
  amber:   { accent: '#fbbf24', bg: 'rgba(245,158,11,0.08)',   border: 'rgba(245,158,11,0.2)'  },
  rose:    { accent: '#fb7185', bg: 'rgba(244,63,94,0.08)',    border: 'rgba(244,63,94,0.2)'   },
  cyan:    { accent: '#22d3ee', bg: 'rgba(6,182,212,0.08)',    border: 'rgba(6,182,212,0.2)'   },
  pink:    { accent: '#f472b6', bg: 'rgba(236,72,153,0.08)',   border: 'rgba(236,72,153,0.2)'  },
}

const PrivacyPolicy = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setTimeout(() => setMounted(true), 60) }, [])

  return (
    <div className="min-h-screen" style={{ background: '#010c1a' }}>
      <style>{`
        @keyframes pp-orb {
          0%,100% { transform: translateY(0) scale(1); }
          40%      { transform: translateY(-30px) scale(1.03); }
          70%      { transform: translateY(15px) scale(0.97); }
        }
        @keyframes pp-particle {
          0%,100% { transform:translate(0,0); }
          30%      { transform:translate(5px,-8px); }
          65%      { transform:translate(-6px,-11px); }
        }
        @keyframes pp-fadeInUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pp-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .pp-orb-1 { animation: pp-orb 9s ease-in-out infinite; }
        .pp-orb-2 { animation: pp-orb 13s ease-in-out infinite reverse; animation-delay:-5s; }
        .pp-appear { opacity:0; animation: pp-fadeInUp 0.6s ease forwards; }
        .pp-spin-ring { animation: pp-spin 9s linear infinite; }
        .pp-section-card {
          background: rgba(8,16,38,0.6);
          border: 1px solid rgba(255,255,255,0.05);
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .pp-section-card:hover {
          border-color: rgba(255,255,255,0.1);
          box-shadow: 0 4px 24px rgba(0,0,0,0.3);
        }
      `}</style>

      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 55% at 50% -10%,rgba(17,43,99,0.5) 0%,transparent 68%)' }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)',
          backgroundSize: '36px 36px',
        }} />
        <div className="pp-orb-1 absolute top-[5%] right-[10%] w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle,rgba(59,130,246,0.11) 0%,transparent 68%)', filter: 'blur(50px)' }} />
        <div className="pp-orb-2 absolute bottom-[10%] left-[8%] w-[420px] h-[420px] rounded-full"
          style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.09) 0%,transparent 68%)', filter: 'blur(55px)' }} />
        {PARTICLES.map(p => (
          <div key={p.id} className="absolute rounded-full" style={{
            left: p.left, top: p.top,
            width: `${p.size}px`, height: `${p.size}px`,
            background: `rgba(148,163,184,${p.opacity})`,
            animation: `pp-particle ${p.duration} ${p.delay} ease-in-out infinite`,
          }} />
        ))}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Header */}
        <header className="sticky top-0 z-20" style={{ background: 'rgba(1,12,26,0.65)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className={`flex items-center gap-3 ${mounted ? 'pp-appear' : 'opacity-0'}`}>
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0">
                <div className="pp-spin-ring absolute inset-0 rounded-xl" style={{ background: 'conic-gradient(from 0deg,transparent 60%,rgba(99,102,241,0.6) 80%,rgba(59,130,246,0.8) 95%,transparent 100%)' }} />
                <div className="absolute inset-[2px] rounded-[10px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1d4ed8,#4338ca)' }}>
                  <Building2 className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">LedgerX</h1>
                <p className="text-[10px] sm:text-xs text-slate-500 leading-none">A Business Solution</p>
              </div>
            </div>
            <div className={`flex items-center gap-3 ${mounted ? 'pp-appear' : 'opacity-0'}`} style={{ animationDelay: '0.15s' }}>
              <p className="hidden sm:block text-xs text-slate-500">powered by <span className="font-semibold text-slate-300">Indus Infotech</span></p>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] text-green-400 font-medium">Secure</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 py-10 sm:py-14">
          <div className="max-w-3xl mx-auto">

            {/* Back */}
            <Link to="/" className={`inline-flex items-center gap-2 text-slate-500 hover:text-slate-200 transition-colors mb-8 group ${mounted ? 'pp-appear' : 'opacity-0'}`}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <ArrowLeft className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm">Back to Home</span>
            </Link>

            {/* Page title */}
            <div className={`flex items-center gap-4 mb-10 ${mounted ? 'pp-appear' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
                <Shield className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Privacy Policy</h1>
                <p className="text-slate-500 text-sm mt-1">Last updated: January 2024</p>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {sections.map((s, i) => {
                const p = palette[s.color]
                const Icon = s.Icon
                return (
                  <div
                    key={i}
                    className={`pp-section-card rounded-2xl p-5 sm:p-6 ${mounted ? 'pp-appear' : 'opacity-0'}`}
                    style={{ animationDelay: `${0.15 + i * 0.07}s` }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Number + icon */}
                      <div className="flex-shrink-0 flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: p.bg, border: `1px solid ${p.border}` }}>
                          <Icon style={{ width: 18, height: 18, color: p.accent }} />
                        </div>
                        <span className="text-[10px] font-bold tabular-nums" style={{ color: p.accent }}>{s.num}</span>
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <h2 className="text-base font-semibold text-white mb-2">{s.title}</h2>
                        <p className="text-sm text-slate-400 leading-relaxed">{s.body}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="sticky bottom-0 z-20" style={{ background: 'rgba(1,12,26,0.65)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="w-full px-4 sm:px-6 py-3 text-xs text-slate-600">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5">
              <span className="order-2 sm:order-1">LedgerX v1.0</span>
              <span className="order-1 sm:order-2 sm:absolute sm:left-1/2 sm:-translate-x-1/2">© 2026 Indus Infotech. All rights reserved.</span>
              <div className="order-3 flex items-center gap-4">
                <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy</Link>
                <Link to="/terms-of-service" className="hover:text-slate-300 transition-colors">Terms</Link>
                <Link to="/support" className="hover:text-slate-300 transition-colors">Support</Link>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  )
}

export default PrivacyPolicy
