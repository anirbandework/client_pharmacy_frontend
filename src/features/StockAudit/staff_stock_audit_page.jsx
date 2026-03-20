import { useState, useEffect } from 'react'
import useTabPermissions from '../../hooks/useTabPermissions'
import Layout from '../../components/Layout'
import LockedModuleGuard from '../../components/LockedModuleGuard'
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
import ConsolidatedStockView from './components/shared/ConsolidatedStockView'
import ErrorBoundary from './components/shared/ErrorBoundary'
import { LayoutDashboard, Package, Grid, Shuffle, Settings, FileText, Sparkles, Brain, Upload, CheckSquare, HelpCircle, Layers, Lock, Crown, Star } from 'lucide-react'

// ─── Locked Tab Overlay ───────────────────────────────────────────────────────

const LockedTabOverlay = ({ tab }) => (
  <div className="absolute inset-0 z-10 flex items-start justify-center px-4 pt-10" style={{ backdropFilter: 'blur(2px)', background: 'rgba(255,255,255,0.45)' }}>
    <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-2xl p-8 text-center w-full max-w-md">
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
            <Lock className="w-7 h-7 text-indigo-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
            <Crown className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">Premium Feature</h3>
      <p className="text-sm font-semibold text-indigo-600 mb-3 flex items-center justify-center gap-1.5">
        <tab.icon className="w-4 h-4" />
        {tab.label}
      </p>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        This tab is not included in your current plan. Upgrade to unlock{' '}
        <strong className="text-gray-700">{tab.label}</strong> and get access to powerful analytics & tools.
      </p>
      <div className="bg-indigo-50 rounded-xl p-4 mb-6 text-left space-y-2">
        {['Full access to all premium tabs', 'Priority support & updates', 'Advanced analytics & insights'].map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-indigo-700">
            <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" fill="currentColor" />
            {f}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400">
        Contact your administrator or reach out to us to upgrade your plan.
      </p>
    </div>
  </div>
)

// ─── Page ─────────────────────────────────────────────────────────────────────

const StockAudit = () => {
  const [activeTab, setActiveTab] = useState('items')
  const [refresh, setRefresh] = useState(0)
  const [showHelp, setShowHelp] = useState(false)
  const { isTabEnabled, isTabLocked, isLoaded } = useTabPermissions('stock_audit')

  const allTabs = [
    { id: 'items', label: 'Items', icon: Grid, color: 'from-purple-500 to-purple-600' },
    { id: 'racks', label: 'Racks', icon: Package, color: 'from-green-500 to-green-600' },
    { id: 'upload', label: 'Excel Upload', icon: Upload, color: 'from-blue-500 to-cyan-500' },
    { id: 'verification', label: 'Upload Verification', icon: CheckSquare, color: 'from-amber-500 to-orange-500' },
    { id: 'audit', label: 'Audit', icon: Shuffle, color: 'from-orange-500 to-orange-600' },
    { id: 'adjustments', label: 'Adjustments', icon: Settings, color: 'from-pink-500 to-pink-600' },
    { id: 'reports', label: 'Reports', icon: FileText, color: 'from-red-500 to-red-600' },
    { id: 'ai-analytics', label: 'AI Analytics', icon: Brain, color: 'from-purple-600 to-indigo-600' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-blue-600' },
    { id: 'consolidated', label: 'Stock View', icon: Layers, color: 'from-teal-500 to-teal-600' }
  ]

  useEffect(() => {
    if (isLoaded && !isTabEnabled(activeTab) && !isTabLocked(activeTab)) {
      const firstUnlocked = allTabs.find(t => !isTabLocked(t.id))
      if (firstUnlocked) setActiveTab(firstUnlocked.id)
    }
  }, [isLoaded])

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

        <LockedModuleGuard moduleKey="stock_audit" moduleName="Stock Audit" moduleIcon={Sparkles}>

        <div className="mb-4 overflow-x-auto pb-2">
          <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-lg p-1.5 inline-flex gap-1 min-w-full md:min-w-0">
            {allTabs.map((tab) => {
              const locked = isTabLocked(tab.id)
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                    active
                      ? locked
                        ? 'text-white bg-gradient-to-r from-gray-500 to-gray-600 shadow-lg'
                        : 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20'
                      : locked
                        ? 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/30'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {locked && (
                    <span className="ml-0.5 inline-flex items-center justify-center w-4 h-4 bg-amber-400 rounded-full flex-shrink-0">
                      <Lock className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="animate-fade-in space-y-4 pb-20">
          <div className="relative">
            <div className={isTabLocked(activeTab) ? 'pointer-events-none select-none blur-sm' : ''}>
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
                {activeTab === 'consolidated' && <ConsolidatedStockView mode="staff" />}
              </ErrorBoundary>
            </div>
            {isTabLocked(activeTab) && (
              <LockedTabOverlay tab={allTabs.find(t => t.id === activeTab)} />
            )}
          </div>
        </div>

        </LockedModuleGuard>
      </div>
      </GeofenceGuard>
    </Layout>
  )
}

export default StockAudit
