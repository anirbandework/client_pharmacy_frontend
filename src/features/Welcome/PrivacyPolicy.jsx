import React from 'react'
import { Link } from 'react-router-dom'
import { Building2, Shield, ArrowLeft } from 'lucide-react'

const PrivacyPolicy = () => {
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
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Home</span>
            </Link>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
                <p className="text-slate-400 text-sm">Last updated: January 2024</p>
              </div>
            </div>

            <div className="space-y-6 text-slate-300 text-sm">
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">1. Information We Collect</h2>
                <p className="leading-relaxed">
                  We collect information necessary to provide LedgerX services including: staff names, phone numbers, email addresses, attendance data (WiFi connection, GPS location for geofencing), salary information, payment details (UPI/bank account), purchase invoices, inventory data, sales records, and customer information (name, phone for billing purposes).
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">2. How We Use Your Information</h2>
                <p className="leading-relaxed">
                  Your data is used to: manage staff attendance through WiFi-based automatic check-in/out, process salary payments, send OTP for authentication, track inventory and sales, generate bills and invoices, provide AI-powered invoice processing, send notifications to staff, generate analytics and reports, and improve our services.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">3. Data Security & Encryption</h2>
                <p className="leading-relaxed">
                  We implement industry-standard security measures including: bcrypt password hashing (72-byte limit), JWT token-based authentication with 24-hour expiry, encrypted storage of sensitive payment information, secure file storage for invoice PDFs, role-based access control ensuring staff can only access their shop's data, and organization-level data isolation.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">4. Location Data & Privacy</h2>
                <p className="leading-relaxed">
                  GPS location is collected only for attendance geofencing validation (within 100 meters of shop). Location data is not stored permanently—only distance calculations are performed. Staff are notified when location is being checked, and location tracking only occurs during work hours when connected to shop WiFi.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">5. AI Processing & Third-Party Services</h2>
                <p className="leading-relaxed">
                  We use Google Gemini 2.5 Flash AI for automatic invoice data extraction from PDFs. Invoice data is processed securely and used only for extracting structured information. We also use SMS services for OTP delivery. No data is shared with third parties for marketing purposes.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">6. Data Retention & Access</h2>
                <p className="leading-relaxed">
                  We retain your data as long as your account is active or as needed to provide services. Complete audit trails and transaction history are maintained indefinitely for compliance. Staff can view their own attendance, salary, and notification history. Admins can access all data within their organization. You may request data deletion by contacting support.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">7. Your Rights</h2>
                <p className="leading-relaxed">
                  You have the right to: access your personal data, update your payment information, view your attendance and salary records, request data correction, request account deletion, and opt-out of non-essential notifications. Staff can manage their own payment details (UPI/bank account) through self-service portal.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">8. Contact Us</h2>
                <p className="leading-relaxed">
                  For privacy concerns or data requests, contact us at privacy@indusinfotech.com or call +91 1800-123-456.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
