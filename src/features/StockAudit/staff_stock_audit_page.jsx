import React, { useState } from 'react'
import useTabPermissions from '../../hooks/useTabPermissions'
import Layout from '../../components/Layout'
import GeofenceGuard from '../../components/GeofenceGuard'
import Dashboard from './components/staff_components/Dashboard'
import RackManagement from './components/staff_components/RackManagement'
import StockItems from './components/staff_components/StockItems'
import AuditSession from './components/staff_components/AuditSession'
import StockAdjustments from './components/staff_components/StockAdjustments'
import Reports from './components/staff_components/Reports'
import AIAnalytics from './components/staff_components/AIAnalytics'
import ExcelUpload from './components/staff_components/ExcelUpload'
import ExcelUploadVerification from './components/staff_components/ExcelUploadVerification'
import ErrorBoundary from './components/shared/ErrorBoundary'
import { LayoutDashboard, Package, Grid, Shuffle, Settings, FileText, Sparkles, Brain, Upload, CheckSquare, HelpCircle } from 'lucide-react'

const StockAudit = () => {
  const [activeTab, setActiveTab] = useState('items')
  const [refresh, setRefresh] = useState(0)
  const [showHelp, setShowHelp] = useState(false)
  const { isTabEnabled } = useTabPermissions('stock_audit')

  const allTabs = [
    { id: 'items', label: 'Items', icon: Grid, color: 'from-purple-500 to-purple-600' },
    { id: 'racks', label: 'Racks', icon: Package, color: 'from-green-500 to-green-600' },
    { id: 'upload', label: 'Excel Upload', icon: Upload, color: 'from-blue-500 to-cyan-500' },
    { id: 'verification', label: 'Upload Verification', icon: CheckSquare, color: 'from-amber-500 to-orange-500' },
    { id: 'audit', label: 'Audit', icon: Shuffle, color: 'from-orange-500 to-orange-600' },
    { id: 'adjustments', label: 'Adjustments', icon: Settings, color: 'from-pink-500 to-pink-600' },
    { id: 'reports', label: 'Reports', icon: FileText, color: 'from-red-500 to-red-600' },
    { id: 'ai-analytics', label: 'AI Analytics', icon: Brain, color: 'from-purple-600 to-indigo-600' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-blue-600' }
  ]
  const tabs = allTabs.filter(t => isTabEnabled(t.id))

  return (
    <Layout>
      <GeofenceGuard moduleName="stock audit">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-between gap-2 md:gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Stock Audit</h1>
                <p className="text-white/90 text-xs md:text-sm">Inventory management & reconciliation</p>
              </div>
            </div>
            <button
              onClick={() => setShowHelp(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white text-xs md:text-sm font-medium transition-colors flex-shrink-0"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">How to Use</span>
            </button>
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
          <ErrorBoundary key={activeTab}>
            {activeTab === 'dashboard' && <Dashboard key={refresh} />}
            {activeTab === 'racks' && <RackManagement />}
            {activeTab === 'items' && <StockItems />}
            {activeTab === 'upload' && <ExcelUpload />}
            {activeTab === 'verification' && <ExcelUploadVerification />}
            {activeTab === 'audit' && <AuditSession />}
            {activeTab === 'adjustments' && <StockAdjustments />}
            {activeTab === 'reports' && <Reports />}
            {activeTab === 'ai-analytics' && <AIAnalytics />}
          </ErrorBoundary>
        </div>
      </div>
      </GeofenceGuard>
    </Layout>
  )
}

export default StockAudit
