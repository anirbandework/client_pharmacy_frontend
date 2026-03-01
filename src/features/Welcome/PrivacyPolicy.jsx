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
        <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">LedgerX</h1>
                <p className="text-xs text-slate-400">A Business Solution</p>
              </div>
            </Link>
            <p className="text-xs text-slate-400">by Indus Infotech</p>
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

            <div className="space-y-6 text-slate-300">
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
                <p className="leading-relaxed">
                  We collect information that you provide directly to us, including your name, phone number, email address, 
                  and other information you choose to provide when using LedgerX services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
                <p className="leading-relaxed">
                  We use the information we collect to provide, maintain, and improve our services, process transactions, 
                  send you technical notices and support messages, and respond to your comments and questions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">3. Data Security</h2>
                <p className="leading-relaxed">
                  We implement industry-standard security measures to protect your personal information. All data is encrypted 
                  in transit and at rest using bank-grade encryption protocols.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">4. Data Retention</h2>
                <p className="leading-relaxed">
                  We retain your information for as long as your account is active or as needed to provide you services. 
                  You may request deletion of your data at any time by contacting our support team.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">5. Contact Us</h2>
                <p className="leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at privacy@indusinfotech.com
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
