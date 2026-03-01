import React from 'react'
import { Link } from 'react-router-dom'
import { Building2, Shield, Headphones, Mail, Phone, MessageCircle, ArrowLeft } from 'lucide-react'

const Support = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Professional Header */}
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl">
          <div className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold text-white">LedgerX</h1>
                <p className="text-[10px] sm:text-xs text-slate-400">A Business Solution</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">powered by <span className="text-sm sm:text-base font-semibold text-white">Indus Infotech</span></p>
              <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-slate-400">
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
              <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Home</span>
              </Link>
              <span className="text-xs text-slate-500">Last updated: March 2026</span>
            </div>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <Headphones className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Support Center</h1>
                <p className="text-slate-400 text-sm">We're here to help 24/7</p>
              </div>
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Get in Touch</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Email Support</h3>
                        <p className="text-slate-400 text-sm">Response within 24 hours</p>
                      </div>
                    </div>
                    <a href="mailto:support@indusinfotech.com" className="text-blue-400 hover:text-blue-300 text-sm">
                      support@indusinfotech.com
                    </a>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Phone Support</h3>
                        <p className="text-slate-400 text-sm">Available 24/7</p>
                      </div>
                    </div>
                    <a href="tel:+911800123456" className="text-green-400 hover:text-green-300 text-sm">
                      +91 1800-123-456
                    </a>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Live Chat</h3>
                        <p className="text-slate-400 text-sm">Instant assistance</p>
                      </div>
                    </div>
                    <button className="text-purple-400 hover:text-purple-300 text-sm">
                      Start Chat
                    </button>
                  </div>

                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                        <Headphones className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Help Center</h3>
                        <p className="text-slate-400 text-sm">Browse FAQs & guides</p>
                      </div>
                    </div>
                    <button className="text-yellow-400 hover:text-yellow-300 text-sm">
                      Visit Help Center
                    </button>
                  </div>
                </div>
              </section>

              <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="text-white font-medium mb-2">How does WiFi-based attendance work?</h3>
                    <p className="text-slate-400">
                      When you connect to your shop's WiFi, the app automatically checks you in. It sends heartbeats every 30-60 seconds. You're automatically checked out after 5 minutes of no heartbeat or at the configured end-of-day time. GPS location is verified to ensure you're within 100 meters of the shop.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">How do I upload and process purchase invoices?</h3>
                    <p className="text-slate-400">
                      Simply upload your purchase invoice PDF. Our AI (Google Gemini 2.5 Flash) automatically extracts all data including supplier details, product information, quantities, prices, and taxes. Review the extracted data, make any corrections, and verify. The system then automatically syncs to your inventory.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">How do I manage staff salaries?</h3>
                    <p className="text-slate-400">
                      Admins can set monthly salaries for each staff member. The system can auto-generate salary records for all eligible staff each month. Staff can add their UPI/bank details through self-service. When paying salaries, view the staff's payment info, make the transfer, and mark as paid in the system.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">How does the stock audit system work?</h3>
                    <p className="text-slate-400">
                      The system randomly selects a rack section for audit (avoiding recently audited sections). Count the physical stock for all items in that section and enter the quantities. The system automatically compares with software quantities and identifies discrepancies. You can then investigate and create adjustments if needed.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Can I use split payments for billing?</h3>
                    <p className="text-slate-400">
                      Yes! LedgerX supports split payments. You can combine cash, card, and online payments in a single bill. For example, ₹500 cash + ₹300 card. The system tracks each payment method separately and calculates change automatically.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">How do I send notifications to staff?</h3>
                    <p className="text-slate-400">
                      Admins can send notifications to all staff in selected shops or to specific staff members. Choose the notification type (info, warning, urgent, announcement), write your message, and select recipients. Staff receive notifications in real-time with a notification bell showing unread count.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Is my data secure and private?</h3>
                    <p className="text-slate-400">
                      Yes! We use industry-standard security including bcrypt password hashing, JWT token authentication, encrypted storage for sensitive data, and role-based access control. Staff can only access their own shop's data. Organization data is completely isolated. GPS location is only used for geofencing validation and not stored permanently.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">How do I get started with LedgerX?</h3>
                    <p className="text-slate-400">
                      Contact your admin to get your phone number registered. On first login, set your password and verify OTP. Admins can create shops, add staff, configure WiFi networks, and start using features. Staff can immediately start with attendance, view notifications, upload invoices, manage inventory, and process bills.
                    </p>
                  </div>
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
