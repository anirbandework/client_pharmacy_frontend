import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Shield, FileText, ArrowLeft, Sun, Moon } from 'lucide-react'

const TermsOfService = () => {
  const [darkMode, setDarkMode] = useState(true)
  const lm = !darkMode

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: lm ? '#f0f6ff' : '#010c1a', transition: 'background 0.4s ease' }}
    >
      {/* Grid Pattern */}
      <div className="absolute inset-0" style={{
        backgroundImage: lm
          ? 'linear-gradient(rgba(59,130,246,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.07) 1px,transparent 1px)'
          : 'linear-gradient(rgba(128,128,128,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(128,128,128,0.07) 1px,transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{ background: lm ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)' }} />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{ background: lm ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)', animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Header */}
        <header
          className="sticky top-0 z-20"
          style={{
            background: lm ? 'rgba(255,255,255,0.82)' : 'rgba(1,12,26,0.6)',
            backdropFilter: 'blur(20px)',
            borderBottom: lm ? '1px solid rgba(59,130,246,0.12)' : '1px solid rgba(255,255,255,0.1)',
            transition: 'background 0.4s ease, border-color 0.4s ease',
          }}
        >
          <div className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold" style={{ color: lm ? '#1e293b' : '#ffffff', transition: 'color 0.4s ease' }}>LedgerX</h1>
                <p className="text-[10px] sm:text-xs" style={{ color: lm ? '#94a3b8' : '#94a3b8' }}>A Business Solution</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <p className="text-[10px] sm:text-xs hidden sm:block" style={{ color: lm ? '#94a3b8' : '#94a3b8' }}>
                powered by <span className="text-sm sm:text-base font-semibold" style={{ color: lm ? '#475569' : '#ffffff' }}>Indus Infotech</span>
              </p>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '999px', cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.08)',
                  border: darkMode ? '1px solid rgba(255,255,255,0.13)' : '1px solid rgba(99,102,241,0.22)',
                }}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode
                  ? <Sun style={{ width: 14, height: 14, color: '#fbbf24' }} />
                  : <Moon style={{ width: 14, height: 14, color: '#6366f1' }} />
                }
                <span className="text-[10px] sm:text-xs font-medium hidden sm:block" style={{ color: darkMode ? '#fbbf24' : '#6366f1' }}>
                  {darkMode ? 'Light' : 'Dark'}
                </span>
              </button>

              <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs" style={{ color: lm ? '#94a3b8' : '#94a3b8' }}>
                <Shield className="w-3 h-3" />
                <span className="hidden sm:inline">Secure Access</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 px-6 py-12">
          <div className="max-w-4xl mx-auto">

            <Link
              to="/"
              className="inline-flex items-center gap-2 transition-colors mb-6"
              style={{ color: lm ? '#64748b' : '#94a3b8' }}
              onMouseEnter={e => e.currentTarget.style.color = lm ? '#1e293b' : '#ffffff'}
              onMouseLeave={e => e.currentTarget.style.color = lm ? '#64748b' : '#94a3b8'}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Home</span>
            </Link>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: lm ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.1)', border: lm ? '1px solid rgba(99,102,241,0.2)' : 'none' }}>
                <FileText className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: lm ? '#1e293b' : '#ffffff', transition: 'color 0.4s ease' }}>Terms of Service</h1>
                <p className="text-sm" style={{ color: lm ? '#94a3b8' : '#94a3b8' }}>Last updated: January 2024</p>
              </div>
            </div>

            <div className="space-y-6 text-sm" style={{ color: lm ? '#475569' : '#cbd5e1' }}>
              {[
                { title: '1. Acceptance of Terms', body: 'By accessing and using LedgerX services provided by Indus Infotech, you accept and agree to be bound by these terms. LedgerX is a comprehensive business management solution for pharmacy operations including attendance tracking, salary management, inventory control, billing, and AI-powered invoice processing. If you do not agree to these terms, please discontinue use immediately.' },
                { title: '2. User Accounts & Authentication', body: 'You are responsible for maintaining the confidentiality of your phone number and password. OTP-based authentication is required for all logins. Admins can manage multiple shops under one organization ID. Staff members are assigned to specific shops and have role-based access. You must notify us immediately of any unauthorized access to your account.' },
                { title: '3. Attendance & Location Services', body: 'By using the attendance feature, you consent to WiFi-based automatic check-in/out and GPS location verification for geofencing (within 100 meters of shop). The system sends heartbeats every 30-60 seconds when connected to shop WiFi. Automatic check-out occurs after 5 minutes of no heartbeat or at configured end-of-day time. Staff must be within the geofence radius to check in.' },
                { title: '4. Data Accuracy & Responsibility', body: 'You are responsible for the accuracy of all data entered including: purchase invoices, stock quantities, sales records, customer information, and salary details. While our AI-powered invoice processing provides automatic data extraction, you must verify all extracted data before saving. Indus Infotech is not liable for losses resulting from inaccurate data entry or failure to conduct regular stock audits.' },
                { title: '5. Payment Processing & Salary', body: 'Salary payment processing is facilitated through the system, but actual payments are made by admins via UPI or bank transfer. Indus Infotech does not process payments directly and is not responsible for payment delays or errors. Staff must provide accurate UPI/bank details. Admins are responsible for timely salary payments and compliance with labor laws.' },
                { title: '6. Inventory & Stock Management', body: 'The system provides tools for inventory management including AI-powered invoice processing, automatic stock sync, physical audits, and discrepancy tracking. You are responsible for conducting regular physical audits and resolving discrepancies. Indus Infotech is not liable for inventory losses, theft, or discrepancies between physical and software quantities.' },
                { title: '7. Service Modifications & Availability', body: 'We reserve the right to modify, suspend, or discontinue any feature of LedgerX with or without notice. We strive for 99.9% uptime but do not guarantee uninterrupted service. We are not liable for any service interruptions, data loss, or business losses resulting from system downtime. Regular backups are performed, but you should maintain your own records.' },
                { title: '8. Limitation of Liability', body: 'Indus Infotech and LedgerX shall not be liable for any indirect, incidental, special, consequential, or punitive damages including loss of profits, data, or business opportunities resulting from your use or inability to use the service. Our total liability shall not exceed the amount paid for the service in the past 12 months.' },
                { title: '9. Compliance & Legal', body: 'You agree to comply with all applicable laws including labor laws, tax regulations, and pharmacy regulations. You are responsible for maintaining proper licenses (drug license, GST registration) and compliance with local regulations. Indus Infotech provides software tools but does not provide legal or compliance advice.' },
                { title: '10. Contact Information', body: 'For questions about these Terms of Service, contact us at legal@indusinfotech.com or call +91 1800-123-456.' },
              ].map((s, i) => (
                <section key={i}>
                  <h2 className="text-lg font-semibold mb-3" style={{ color: lm ? '#1e293b' : '#ffffff', transition: 'color 0.4s ease' }}>{s.title}</h2>
                  <p className="leading-relaxed">{s.body}</p>
                </section>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default TermsOfService
