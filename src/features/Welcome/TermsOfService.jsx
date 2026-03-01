import React from 'react'
import { Link } from 'react-router-dom'
import { Building2, Shield, FileText, ArrowLeft } from 'lucide-react'

const TermsOfService = () => {
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
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
                <p className="text-slate-400 text-sm">Last updated: January 2024</p>
              </div>
            </div>

            <div className="space-y-6 text-slate-300 text-sm">
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">1. Acceptance of Terms</h2>
                <p className="leading-relaxed">
                  By accessing and using LedgerX services provided by Indus Infotech, you accept and agree to be bound by these terms. LedgerX is a comprehensive business management solution for pharmacy operations including attendance tracking, salary management, inventory control, billing, and AI-powered invoice processing. If you do not agree to these terms, please discontinue use immediately.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">2. User Accounts & Authentication</h2>
                <p className="leading-relaxed">
                  You are responsible for maintaining the confidentiality of your phone number and password. OTP-based authentication is required for all logins. Admins can manage multiple shops under one organization ID. Staff members are assigned to specific shops and have role-based access. You must notify us immediately of any unauthorized access to your account.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">3. Attendance & Location Services</h2>
                <p className="leading-relaxed">
                  By using the attendance feature, you consent to WiFi-based automatic check-in/out and GPS location verification for geofencing (within 100 meters of shop). The system sends heartbeats every 30-60 seconds when connected to shop WiFi. Automatic check-out occurs after 5 minutes of no heartbeat or at configured end-of-day time. Staff must be within the geofence radius to check in.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">4. Data Accuracy & Responsibility</h2>
                <p className="leading-relaxed">
                  You are responsible for the accuracy of all data entered including: purchase invoices, stock quantities, sales records, customer information, and salary details. While our AI-powered invoice processing provides automatic data extraction, you must verify all extracted data before saving. Indus Infotech is not liable for losses resulting from inaccurate data entry or failure to conduct regular stock audits.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">5. Payment Processing & Salary</h2>
                <p className="leading-relaxed">
                  Salary payment processing is facilitated through the system, but actual payments are made by admins via UPI or bank transfer. Indus Infotech does not process payments directly and is not responsible for payment delays or errors. Staff must provide accurate UPI/bank details. Admins are responsible for timely salary payments and compliance with labor laws.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">6. Inventory & Stock Management</h2>
                <p className="leading-relaxed">
                  The system provides tools for inventory management including AI-powered invoice processing, automatic stock sync, physical audits, and discrepancy tracking. You are responsible for conducting regular physical audits and resolving discrepancies. Indus Infotech is not liable for inventory losses, theft, or discrepancies between physical and software quantities.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">7. Service Modifications & Availability</h2>
                <p className="leading-relaxed">
                  We reserve the right to modify, suspend, or discontinue any feature of LedgerX with or without notice. We strive for 99.9% uptime but do not guarantee uninterrupted service. We are not liable for any service interruptions, data loss, or business losses resulting from system downtime. Regular backups are performed, but you should maintain your own records.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">8. Limitation of Liability</h2>
                <p className="leading-relaxed">
                  Indus Infotech and LedgerX shall not be liable for any indirect, incidental, special, consequential, or punitive damages including loss of profits, data, or business opportunities resulting from your use or inability to use the service. Our total liability shall not exceed the amount paid for the service in the past 12 months.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">9. Compliance & Legal</h2>
                <p className="leading-relaxed">
                  You agree to comply with all applicable laws including labor laws, tax regulations, and pharmacy regulations. You are responsible for maintaining proper licenses (drug license, GST registration) and compliance with local regulations. Indus Infotech provides software tools but does not provide legal or compliance advice.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">10. Contact Information</h2>
                <p className="leading-relaxed">
                  For questions about these Terms of Service, contact us at legal@indusinfotech.com or call +91 1800-123-456.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
