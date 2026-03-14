import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Shield, Headphones, Mail, Phone, MessageCircle, ArrowLeft, Sun, Moon } from 'lucide-react'

const CONTACT_CARDS = [
  {
    color: 'blue', Icon: Mail,
    title: 'Email Support', sub: 'Response within 24 hours',
    action: <a href="mailto:support@indusinfotech.com" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">support@indusinfotech.com</a>,
  },
  {
    color: 'green', Icon: Phone,
    title: 'Phone Support', sub: 'Available 24/7',
    action: <a href="tel:+911800123456" className="text-green-400 hover:text-green-300 text-sm transition-colors">+91 1800-123-456</a>,
  },
  {
    color: 'purple', Icon: MessageCircle,
    title: 'Live Chat', sub: 'Instant assistance',
    action: <button className="text-purple-400 hover:text-purple-300 text-sm transition-colors">Start Chat</button>,
  },
  {
    color: 'yellow', Icon: Headphones,
    title: 'Help Center', sub: 'Browse FAQs & guides',
    action: <button className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors">Visit Help Center</button>,
  },
]

const colorBg = {
  blue:   { bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.2)',  icon: 'text-blue-400'   },
  green:  { bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.2)',   icon: 'text-green-400'  },
  purple: { bg: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.2)',  icon: 'text-purple-400' },
  yellow: { bg: 'rgba(234,179,8,0.1)',   border: 'rgba(234,179,8,0.2)',   icon: 'text-yellow-400' },
}

const FAQS = [
  { q: 'How does WiFi-based attendance work?', a: 'When you connect to your shop\'s WiFi, the app automatically checks you in. It sends heartbeats every 30-60 seconds. You\'re automatically checked out after 5 minutes of no heartbeat or at the configured end-of-day time. GPS location is verified to ensure you\'re within 100 meters of the shop.' },
  { q: 'How do I upload and process purchase invoices?', a: 'Simply upload your purchase invoice PDF. Our AI (Google Gemini 2.5 Flash) automatically extracts all data including supplier details, product information, quantities, prices, and taxes. Review the extracted data, make any corrections, and verify. The system then automatically syncs to your inventory.' },
  { q: 'How do I manage staff salaries?', a: 'Admins can set monthly salaries for each staff member. The system can auto-generate salary records for all eligible staff each month. Staff can add their UPI/bank details through self-service. When paying salaries, view the staff\'s payment info, make the transfer, and mark as paid in the system.' },
  { q: 'How does the stock audit system work?', a: 'The system randomly selects a rack section for audit (avoiding recently audited sections). Count the physical stock for all items in that section and enter the quantities. The system automatically compares with software quantities and identifies discrepancies. You can then investigate and create adjustments if needed.' },
  { q: 'Can I use split payments for billing?', a: 'Yes! LedgerX supports split payments. You can combine cash, card, and online payments in a single bill. For example, ₹500 cash + ₹300 card. The system tracks each payment method separately and calculates change automatically.' },
  { q: 'How do I send notifications to staff?', a: 'Admins can send notifications to all staff in selected shops or to specific staff members. Choose the notification type (info, warning, urgent, announcement), write your message, and select recipients. Staff receive notifications in real-time with a notification bell showing unread count.' },
  { q: 'Is my data secure and private?', a: 'Yes! We use industry-standard security including bcrypt password hashing, JWT token authentication, encrypted storage for sensitive data, and role-based access control. Staff can only access their own shop\'s data. Organization data is completely isolated. GPS location is only used for geofencing validation and not stored permanently.' },
  { q: 'How do I get started with LedgerX?', a: 'Contact your admin to get your phone number registered. On first login, set your password and verify OTP. Admins can create shops, add staff, configure WiFi networks, and start using features. Staff can immediately start with attendance, view notifications, upload invoices, manage inventory, and process bills.' },
]

const Support = () => {
  const [darkMode, setDarkMode] = useState(true)
  const lm = !darkMode

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: lm ? '#f0f6ff' : '#010c1a', transition: 'background 0.4s ease' }}
    >
      {/* Grid */}
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
                <p className="text-[10px] sm:text-xs" style={{ color: '#94a3b8' }}>A Business Solution</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <p className="text-[10px] sm:text-xs hidden sm:block" style={{ color: '#94a3b8' }}>
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

              <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs" style={{ color: '#94a3b8' }}>
                <Shield className="w-3 h-3" />
                <span className="hidden sm:inline">Secure Access</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 px-6 py-12">
          <div className="max-w-4xl mx-auto">

            <div className="flex items-center justify-between mb-6">
              <Link
                to="/"
                className="inline-flex items-center gap-2 transition-colors"
                style={{ color: lm ? '#64748b' : '#94a3b8' }}
                onMouseEnter={e => e.currentTarget.style.color = lm ? '#1e293b' : '#ffffff'}
                onMouseLeave={e => e.currentTarget.style.color = lm ? '#64748b' : '#94a3b8'}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Home</span>
              </Link>
              <span className="text-xs" style={{ color: '#94a3b8' }}>Last updated: March 2026</span>
            </div>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: lm ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.1)', border: lm ? '1px solid rgba(34,197,94,0.2)' : 'none' }}>
                <Headphones className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: lm ? '#1e293b' : '#ffffff', transition: 'color 0.4s ease' }}>Support Center</h1>
                <p className="text-sm" style={{ color: '#94a3b8' }}>We're here to help 24/7</p>
              </div>
            </div>

            <div className="space-y-6">

              {/* Contact cards */}
              <section>
                <h2 className="text-xl font-semibold mb-4" style={{ color: lm ? '#1e293b' : '#ffffff', transition: 'color 0.4s ease' }}>Get in Touch</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {CONTACT_CARDS.map(({ color, Icon, title, sub, action }, i) => {
                    const c = colorBg[color]
                    return (
                      <div
                        key={i}
                        className="rounded-xl p-6"
                        style={{
                          background: lm ? 'rgba(255,255,255,0.88)' : 'rgba(30,41,59,0.5)',
                          backdropFilter: 'blur(8px)',
                          border: lm ? `1px solid ${c.border}` : '1px solid rgba(71,85,105,0.5)',
                          boxShadow: lm ? '0 2px 12px rgba(59,130,246,0.06)' : 'none',
                          transition: 'background 0.4s ease, border-color 0.4s ease',
                        }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ background: c.bg, border: lm ? `1px solid ${c.border}` : 'none' }}>
                            <Icon className={`w-5 h-5 ${c.icon}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold" style={{ color: lm ? '#1e293b' : '#ffffff', transition: 'color 0.4s ease' }}>{title}</h3>
                            <p className="text-sm" style={{ color: '#94a3b8' }}>{sub}</p>
                          </div>
                        </div>
                        {action}
                      </div>
                    )
                  })}
                </div>
              </section>

              {/* FAQ */}
              <section
                className="rounded-xl p-6"
                style={{
                  background: lm ? 'rgba(255,255,255,0.88)' : 'rgba(30,41,59,0.5)',
                  backdropFilter: 'blur(8px)',
                  border: lm ? '1px solid rgba(59,130,246,0.12)' : '1px solid rgba(71,85,105,0.5)',
                  boxShadow: lm ? '0 2px 12px rgba(59,130,246,0.06)' : 'none',
                  transition: 'background 0.4s ease, border-color 0.4s ease',
                }}
              >
                <h2 className="text-lg font-semibold mb-4" style={{ color: lm ? '#1e293b' : '#ffffff', transition: 'color 0.4s ease' }}>Frequently Asked Questions</h2>
                <div className="space-y-4 text-sm">
                  {FAQS.map(({ q, a }, i) => (
                    <div key={i}>
                      <h3 className="font-medium mb-2" style={{ color: lm ? '#334155' : '#ffffff', transition: 'color 0.4s ease' }}>{q}</h3>
                      <p style={{ color: lm ? '#64748b' : '#94a3b8' }}>{a}</p>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Support
