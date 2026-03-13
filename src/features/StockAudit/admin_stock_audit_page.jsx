import React, { useState } from 'react'
import Layout from '../../components/Layout'
import Dashboard from './components/admin_components/Dashboard'
import Discrepancies from './components/admin_components/Discrepancies'
import AIInsights from './components/admin_components/AIInsights'
import ExcelVerification from './components/admin_components/ExcelVerification'
import { LayoutDashboard, AlertTriangle, Brain, CheckSquare, Sparkles } from 'lucide-react'

const AdminStockAnalytics = () => {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-blue-600' },
    { id: 'discrepancies', label: 'Discrepancies', icon: AlertTriangle, color: 'from-red-500 to-red-600' },
    { id: 'ai-insights', label: 'AI Insights', icon: Brain, color: 'from-purple-600 to-indigo-600' },
    { id: 'excel-verification', label: 'Excel Verification', icon: CheckSquare, color: 'from-amber-500 to-orange-500' }
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Stock Analytics</h1>
              <p className="text-white/90 text-xs md:text-sm">Audit insights, discrepancies & expiry tracking</p>
            </div>
          </div>
        </div>

        <div className="mb-4 overflow-x-auto pb-2">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg p-1.5 inline-flex gap-1 min-w-full md:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="animate-fade-in space-y-4 pb-20">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'discrepancies' && <Discrepancies />}
          {activeTab === 'ai-insights' && <AIInsights />}
          {activeTab === 'excel-verification' && <ExcelVerification />}
        </div>
      </div>
    </Layout>
  )
}

export default AdminStockAnalytics