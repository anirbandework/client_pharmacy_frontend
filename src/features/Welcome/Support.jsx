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
                <h2 className="text-xl font-semibold text-white mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-medium mb-2">How do I reset my password?</h3>
                    <p className="text-slate-400 text-sm">
                      Contact your admin or use the "Forgot Password" option on the login page.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">How do I add new staff members?</h3>
                    <p className="text-slate-400 text-sm">
                      Admins can add staff members from the Staff Management section in the dashboard.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Is my data secure?</h3>
                    <p className="text-slate-400 text-sm">
                      Yes, we use industry-standard encryption and security measures to protect your data.
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
