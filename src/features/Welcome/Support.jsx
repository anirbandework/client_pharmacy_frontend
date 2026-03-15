import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Headphones, Mail, Phone, MessageCircle, ArrowLeft } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import PublicPageShell from '../../components/PublicPageShell'
import { t } from '../../theme'

const colorPalette = {
  blue:   { bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.2)',  icon: 'text-blue-400'   },
  green:  { bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.2)',   icon: 'text-green-400'  },
  purple: { bg: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.2)',  icon: 'text-purple-400' },
  yellow: { bg: 'rgba(234,179,8,0.1)',   border: 'rgba(234,179,8,0.2)',   icon: 'text-yellow-400' },
}

const CONTACT_CARDS = [
  { color: 'blue',   Icon: Mail,          title: 'Email Support',  sub: 'Response within 24 hours', action: <a href="mailto:support@indusinfotech.com" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">support@indusinfotech.com</a> },
  { color: 'green',  Icon: Phone,         title: 'Phone Support',  sub: 'Available 24/7',           action: <a href="tel:+911800123456" className="text-green-400 hover:text-green-300 text-sm transition-colors">+91 1800-123-456</a> },
  { color: 'purple', Icon: MessageCircle, title: 'Live Chat',      sub: 'Instant assistance',       action: <button className="text-purple-400 hover:text-purple-300 text-sm transition-colors">Start Chat</button> },
  { color: 'yellow', Icon: Headphones,    title: 'Help Center',    sub: 'Browse FAQs & guides',     action: <button className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors">Visit Help Center</button> },
]

const FAQS = [
  { q: 'How does WiFi-based attendance work?',            a: "When you connect to your shop's WiFi, the app automatically checks you in. It sends heartbeats every 30-60 seconds. You're automatically checked out after 5 minutes of no heartbeat or at the configured end-of-day time. GPS location is verified to ensure you're within 100 meters of the shop." },
  { q: 'How do I upload and process purchase invoices?',  a: 'Simply upload your purchase invoice PDF. Our AI (Google Gemini 2.5 Flash) automatically extracts all data including supplier details, product information, quantities, prices, and taxes. Review the extracted data, make any corrections, and verify. The system then automatically syncs to your inventory.' },
  { q: 'How do I manage staff salaries?',                 a: "Admins can set monthly salaries for each staff member. The system can auto-generate salary records for all eligible staff each month. Staff can add their UPI/bank details through self-service. When paying salaries, view the staff's payment info, make the transfer, and mark as paid in the system." },
  { q: 'How does the stock audit system work?',           a: 'The system randomly selects a rack section for audit (avoiding recently audited sections). Count the physical stock for all items in that section and enter the quantities. The system automatically compares with software quantities and identifies discrepancies. You can then investigate and create adjustments if needed.' },
  { q: 'Can I use split payments for billing?',           a: 'Yes! LedgerX supports split payments. You can combine cash, card, and online payments in a single bill. For example, ₹500 cash + ₹300 card. The system tracks each payment method separately and calculates change automatically.' },
  { q: 'How do I send notifications to staff?',           a: 'Admins can send notifications to all staff in selected shops or to specific staff members. Choose the notification type (info, warning, urgent, announcement), write your message, and select recipients. Staff receive notifications in real-time with a notification bell showing unread count.' },
  { q: 'Is my data secure and private?',                  a: 'Yes! We use industry-standard security including bcrypt password hashing, JWT token authentication, encrypted storage for sensitive data, and role-based access control. Staff can only access their own shop\'s data. Organization data is completely isolated. GPS location is only used for geofencing validation and not stored permanently.' },
  { q: 'How do I get started with LedgerX?',             a: 'Contact your admin to get your phone number registered. On first login, set your password and verify OTP. Admins can create shops, add staff, configure WiFi networks, and start using features. Staff can immediately start with attendance, view notifications, upload invoices, manage inventory, and process bills.' },
]

const Support = () => {
  const { isDark } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setTimeout(() => setMounted(true), 60) }, [])

  return (
    <PublicPageShell>
      <main className="flex-1 px-4 sm:px-6 py-10 sm:py-14">
        <div className="max-w-3xl mx-auto">

          {/* Back + date row */}
          <div className={`flex items-center justify-between mb-8 ${mounted ? 'opacity-100' : 'opacity-0'}`} style={{ transition: 'opacity 0.4s ease' }}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 transition-colors"
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
            <span className="text-xs" style={{ color: t.text.muted(isDark) }}>Last updated: March 2026</span>
          </div>

          {/* Title */}
          <div
            className={`flex items-center gap-4 mb-10 ${mounted ? 'opacity-100' : 'opacity-0'}`}
            style={{ transition: 'opacity 0.4s ease 0.1s' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}
            >
              <Headphones className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: t.text.primary(isDark), transition: 'color 0.4s ease' }}>
                Support Center
              </h1>
              <p className="text-sm mt-1" style={{ color: t.text.muted(isDark) }}>We're here to help 24/7</p>
            </div>
          </div>

          <div className="space-y-6">

            {/* Contact cards */}
            <section>
              <h2 className="text-lg font-semibold mb-4" style={{ color: t.text.primary(isDark), transition: 'color 0.4s ease' }}>
                Get in Touch
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {CONTACT_CARDS.map(({ color, Icon, title, sub, action }, i) => {
                  const c = colorPalette[color]
                  return (
                    <div
                      key={i}
                      className="rounded-2xl p-5"
                      style={{
                        ...t.card(isDark),
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                        transition: `opacity 0.5s ease ${0.15 + i * 0.07}s, transform 0.5s ease ${0.15 + i * 0.07}s, background 0.4s ease, border-color 0.4s ease`,
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: c.bg, border: `1px solid ${c.border}` }}
                        >
                          <Icon className={`w-5 h-5 ${c.icon}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm" style={{ color: t.text.primary(isDark), transition: 'color 0.4s ease' }}>{title}</h3>
                          <p className="text-xs" style={{ color: t.text.muted(isDark) }}>{sub}</p>
                        </div>
                      </div>
                      {action}
                    </div>
                  )
                })}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-lg font-semibold mb-4" style={{ color: t.text.primary(isDark), transition: 'color 0.4s ease' }}>
                Frequently Asked Questions
              </h2>
              <div
                className="rounded-2xl p-6 sm:p-8 space-y-6"
                style={{
                  ...t.card(isDark),
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'opacity 0.5s ease 0.45s, transform 0.5s ease 0.45s, background 0.4s ease, border-color 0.4s ease',
                }}
              >
                {FAQS.map(({ q, a }, i) => (
                  <div key={i}>
                    <h3 className="text-sm font-semibold mb-1.5" style={{ color: t.text.primary(isDark), transition: 'color 0.4s ease' }}>
                      {q}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: t.text.secondary(isDark) }}>{a}</p>
                    {i < FAQS.length - 1 && (
                      <div className="mt-6" style={{ borderBottom: `1px solid ${t.divider(isDark)}` }} />
                    )}
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>
    </PublicPageShell>
  )
}

export default Support
