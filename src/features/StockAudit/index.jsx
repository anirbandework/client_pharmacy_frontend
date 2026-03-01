import React, { useState } from 'react'
import Layout from '../../components/Layout'
import GeofenceGuard from '../../components/GeofenceGuard'
import Dashboard from './components/Dashboard'
import RackManagement from './components/RackManagement'
import StockItems from './components/StockItems'
import AuditSession from './components/AuditSession'
import StockAdjustments from './components/StockAdjustments'
import Reports from './components/Reports'
import AIAnalytics from './components/AIAnalytics'
import { LayoutDashboard, Package, Grid, Shuffle, Settings, FileText, Sparkles, Brain } from 'lucide-react'

const StockAudit = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [refresh, setRefresh] = useState(0)

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-blue-600' },
    { id: 'racks', label: 'Racks', icon: Package, color: 'from-green-500 to-green-600' },
    { id: 'items', label: 'Items', icon: Grid, color: 'from-purple-500 to-purple-600' },
    { id: 'audit', label: 'Audit', icon: Shuffle, color: 'from-orange-500 to-orange-600' },
    { id: 'adjustments', label: 'Adjustments', icon: Settings, color: 'from-pink-500 to-pink-600' },
    { id: 'reports', label: 'Reports', icon: FileText, color: 'from-red-500 to-red-600' },
    { id: 'ai-analytics', label: 'AI Analytics', icon: Brain, color: 'from-purple-600 to-indigo-600' }
  ]

  return (
    <Layout>
      <GeofenceGuard moduleName="stock audit">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Stock Audit</h1>
              <p className="text-white/90 text-xs md:text-sm">Inventory management & reconciliation</p>
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

        <div className="animate-fade-in space-y-4">
          {activeTab === 'dashboard' && <Dashboard key={refresh} />}
          {activeTab === 'racks' && <RackManagement />}
          {activeTab === 'items' && <StockItems />}
          {activeTab === 'audit' && <AuditSession />}
          {activeTab === 'adjustments' && <StockAdjustments />}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'ai-analytics' && <AIAnalytics />}
        </div>
      </div>
      </GeofenceGuard>
    </Layout>
  )
}

export default StockAudit
