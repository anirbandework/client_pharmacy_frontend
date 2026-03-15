import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, ArrowLeft } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import PublicPageShell from '../../components/PublicPageShell'
import { t } from '../../theme'

const TERMS = [
  { title: '1. Acceptance of Terms',              body: 'By accessing and using LedgerX services provided by Indus Infotech, you accept and agree to be bound by these terms. LedgerX is a comprehensive business management solution for pharmacy operations including attendance tracking, salary management, inventory control, billing, and AI-powered invoice processing. If you do not agree to these terms, please discontinue use immediately.' },
  { title: '2. User Accounts & Authentication',   body: 'You are responsible for maintaining the confidentiality of your phone number and password. OTP-based authentication is required for all logins. Admins can manage multiple shops under one organization ID. Staff members are assigned to specific shops and have role-based access. You must notify us immediately of any unauthorized access to your account.' },
  { title: '3. Attendance & Location Services',   body: "By using the attendance feature, you consent to WiFi-based automatic check-in/out and GPS location verification for geofencing (within 100 meters of shop). The system sends heartbeats every 30-60 seconds when connected to shop WiFi. Automatic check-out occurs after 5 minutes of no heartbeat or at configured end-of-day time. Staff must be within the geofence radius to check in." },
  { title: '4. Data Accuracy & Responsibility',   body: 'You are responsible for the accuracy of all data entered including: purchase invoices, stock quantities, sales records, customer information, and salary details. While our AI-powered invoice processing provides automatic data extraction, you must verify all extracted data before saving. Indus Infotech is not liable for losses resulting from inaccurate data entry or failure to conduct regular stock audits.' },
  { title: '5. Payment Processing & Salary',      body: 'Salary payment processing is facilitated through the system, but actual payments are made by admins via UPI or bank transfer. Indus Infotech does not process payments directly and is not responsible for payment delays or errors. Staff must provide accurate UPI/bank details. Admins are responsible for timely salary payments and compliance with labor laws.' },
  { title: '6. Inventory & Stock Management',     body: 'The system provides tools for inventory management including AI-powered invoice processing, automatic stock sync, physical audits, and discrepancy tracking. You are responsible for conducting regular physical audits and resolving discrepancies. Indus Infotech is not liable for inventory losses, theft, or discrepancies between physical and software quantities.' },
  { title: '7. Service Modifications & Availability', body: 'We reserve the right to modify, suspend, or discontinue any feature of LedgerX with or without notice. We strive for 99.9% uptime but do not guarantee uninterrupted service. We are not liable for any service interruptions, data loss, or business losses resulting from system downtime. Regular backups are performed, but you should maintain your own records.' },
  { title: '8. Limitation of Liability',          body: 'Indus Infotech and LedgerX shall not be liable for any indirect, incidental, special, consequential, or punitive damages including loss of profits, data, or business opportunities resulting from your use or inability to use the service. Our total liability shall not exceed the amount paid for the service in the past 12 months.' },
  { title: '9. Compliance & Legal',               body: 'You agree to comply with all applicable laws including labor laws, tax regulations, and pharmacy regulations. You are responsible for maintaining proper licenses (drug license, GST registration) and compliance with local regulations. Indus Infotech provides software tools but does not provide legal or compliance advice.' },
  { title: '10. Contact Information',             body: 'For questions about these Terms of Service, contact us at legal@indusinfotech.com or call +91 1800-123-456.' },
]

const TermsOfService = () => {
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
            className={`inline-flex items-center gap-2 mb-8 transition-colors ${mounted ? 'opacity-100' : 'opacity-0'}`}
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
              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)' }}
            >
              <FileText className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: t.text.primary(isDark), transition: 'color 0.4s ease' }}>
                Terms of Service
              </h1>
              <p className="text-sm mt-1" style={{ color: t.text.muted(isDark) }}>Last updated: January 2024</p>
            </div>
          </div>

          {/* Sections */}
          <div
            className="rounded-2xl p-6 sm:p-8 space-y-7"
            style={{
              ...t.card(isDark),
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s, background 0.4s ease, border-color 0.4s ease',
            }}
          >
            {TERMS.map((s, i) => (
              <section key={i}>
                <h2 className="text-base font-semibold mb-2" style={{ color: t.text.primary(isDark), transition: 'color 0.4s ease' }}>
                  {s.title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: t.text.secondary(isDark), transition: 'color 0.4s ease' }}>
                  {s.body}
                </p>
                {i < TERMS.length - 1 && (
                  <div className="mt-7" style={{ borderBottom: `1px solid ${t.divider(isDark)}` }} />
                )}
              </section>
            ))}
          </div>

        </div>
      </main>
    </PublicPageShell>
  )
}

export default TermsOfService
