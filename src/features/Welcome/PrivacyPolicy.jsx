import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, UserCheck, Brain, Lock, MapPin, Database, Mail, ArrowLeft } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import PublicPageShell from '../../components/PublicPageShell'
import { t } from '../../theme'

const palette = {
  blue:    { accent: '#60a5fa', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.2)'  },
  indigo:  { accent: '#818cf8', bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.2)'  },
  violet:  { accent: '#a78bfa', bg: 'rgba(139,92,246,0.08)',  border: 'rgba(139,92,246,0.2)'  },
  emerald: { accent: '#34d399', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)'  },
  amber:   { accent: '#fbbf24', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
  rose:    { accent: '#fb7185', bg: 'rgba(244,63,94,0.08)',   border: 'rgba(244,63,94,0.2)'   },
  cyan:    { accent: '#22d3ee', bg: 'rgba(6,182,212,0.08)',   border: 'rgba(6,182,212,0.2)'   },
  pink:    { accent: '#f472b6', bg: 'rgba(236,72,153,0.08)',  border: 'rgba(236,72,153,0.2)'  },
}

const sections = [
  { num: '01', Icon: UserCheck, color: 'blue',    title: 'Information We Collect',            body: 'We collect information necessary to provide LedgerX services including: staff names, phone numbers, email addresses, attendance data (WiFi connection, GPS location for geofencing), salary information, payment details (UPI/bank account), purchase invoices, inventory data, sales records, and customer information (name, phone for billing purposes).' },
  { num: '02', Icon: Brain,     color: 'indigo',  title: 'How We Use Your Information',       body: 'Your data is used to: manage staff attendance through WiFi-based automatic check-in/out, process salary payments, send OTP for authentication, track inventory and sales, generate bills and invoices, provide AI-powered invoice processing, send notifications to staff, generate analytics and reports, and improve our services.' },
  { num: '03', Icon: Lock,      color: 'violet',  title: 'Data Security & Encryption',        body: "We implement industry-standard security measures including: bcrypt password hashing (72-byte limit), JWT token-based authentication with 24-hour expiry, encrypted storage of sensitive payment information, secure file storage for invoice PDFs, role-based access control ensuring staff can only access their shop's data, and organisation-level data isolation." },
  { num: '04', Icon: MapPin,    color: 'emerald', title: 'Location Data & Privacy',           body: 'GPS location is collected only for attendance geofencing validation (within 100 meters of shop). Location data is not stored permanently—only distance calculations are performed. Staff are notified when location is being checked, and location tracking only occurs during work hours when connected to shop WiFi.' },
  { num: '05', Icon: Brain,     color: 'amber',   title: 'AI Processing & Third-Party Services', body: 'We use Google Gemini 2.5 Flash AI for automatic invoice data extraction from PDFs. Invoice data is processed securely and used only for extracting structured information. We also use SMS services for OTP delivery. No data is shared with third parties for marketing purposes.' },
  { num: '06', Icon: Database,  color: 'rose',    title: 'Data Retention & Access',           body: 'We retain your data as long as your account is active or as needed to provide services. Complete audit trails and transaction history are maintained indefinitely for compliance. Staff can view their own attendance, salary, and notification history. Admins can access all data within their organisation. You may request data deletion by contacting support.' },
  { num: '07', Icon: Shield,    color: 'cyan',    title: 'Your Rights',                       body: 'You have the right to: access your personal data, update your payment information, view your attendance and salary records, request data correction, request account deletion, and opt-out of non-essential notifications. Staff can manage their own payment details (UPI/bank account) through self-service portal.' },
  { num: '08', Icon: Mail,      color: 'pink',    title: 'Contact Us',                        body: 'For privacy concerns or data requests, contact us at privacy@indusinfotech.com or call +91 1800-123-456.' },
]

const PrivacyPolicy = () => {
  const { isDark } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setTimeout(() => setMounted(true), 60) }, [])

  return (
    <PublicPageShell>
      <main className="flex-1 px-4 sm:px-6 py-10 sm:py-14">
        <div className="max-w-3xl mx-auto">

          {/* Back link */}
          <Link
            to="/"
            className={`inline-flex items-center gap-2 mb-8 transition-colors group ${mounted ? 'opacity-100' : 'opacity-0'}`}
            style={{ color: t.text.secondary(isDark) }}
            onMouseEnter={e => e.currentTarget.style.color = t.text.primary(isDark)}
            onMouseLeave={e => e.currentTarget.style.color = t.text.secondary(isDark)}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(59,130,246,0.07)',
                border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(59,130,246,0.15)',
              }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm">Back to Home</span>
          </Link>

          {/* Title */}
          <div
            className={`flex items-center gap-4 mb-10 ${mounted ? 'opacity-100' : 'opacity-0'}`}
            style={{ transition: 'opacity 0.4s ease 0.1s' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}
            >
              <Shield className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: t.text.primary(isDark), transition: 'color 0.4s ease' }}>
                Privacy Policy
              </h1>
              <p className="text-sm mt-1" style={{ color: t.text.muted(isDark) }}>Last updated: January 2024</p>
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
                  className="rounded-2xl p-5 sm:p-6"
                  style={{
                    ...t.card(isDark),
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                    transition: `opacity 0.5s ease ${0.15 + i * 0.06}s, transform 0.5s ease ${0.15 + i * 0.06}s, background 0.4s ease, border-color 0.4s ease`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: p.bg, border: `1px solid ${p.border}` }}
                      >
                        <Icon style={{ width: 18, height: 18, color: p.accent }} />
                      </div>
                      <span className="text-[10px] font-bold tabular-nums" style={{ color: p.accent }}>{s.num}</span>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h2 className="text-base font-semibold mb-2" style={{ color: t.text.primary(isDark), transition: 'color 0.4s ease' }}>
                        {s.title}
                      </h2>
                      <p className="text-sm leading-relaxed" style={{ color: t.text.secondary(isDark), transition: 'color 0.4s ease' }}>
                        {s.body}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </main>
    </PublicPageShell>
  )
}

export default PrivacyPolicy
