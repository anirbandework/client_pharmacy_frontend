import { useState, useEffect } from 'react'
import useTabPermissions from '../../hooks/useTabPermissions'
import Layout from '../../components/Layout'
import Dashboard from './components/admin_components/Dashboard'
import AIInsights from './components/admin_components/AIInsights'
import MarginPlayground from './components/admin_components/MarginPlayground'
import MarginSimulator from './components/admin_components/MarginSimulator'
import ExcelVerification from './components/admin_components/ExcelVerification'
import ExpiryAlerts from './components/shared/ExpiryAlerts'
import SupplierPerformance from './components/shared/SupplierPerformance'
import ErrorBoundary from './components/shared/ErrorBoundary'
import HowToUseModal from './help/HowToUseModal'
import { LayoutDashboard, Brain, Calculator, CheckSquare, Receipt, AlertTriangle, Package, Zap, HelpCircle } from 'lucide-react'

const AdminPurchaseInvoicePage = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showHelp, setShowHelp] = useState(false)
  const { isTabEnabled, isLoaded } = useTabPermissions('invoice_analytics')

  const allTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-blue-600' },
    { id: 'verification', label: 'Verification', icon: CheckSquare, color: 'from-amber-500 to-orange-500' },
    { id: 'expiry-alerts', label: 'Expiry Alerts', icon: AlertTriangle, color: 'from-red-500 to-orange-600' },
    { id: 'suppliers', label: 'Suppliers', icon: Package, color: 'from-green-500 to-teal-600' },
    { id: 'margins', label: 'Margin Playground', icon: Calculator, color: 'from-pink-500 to-purple-600' },
    { id: 'simulator', label: 'Margin Simulator', icon: Zap, color: 'from-indigo-500 to-purple-600' },
    { id: 'ai-insights', label: 'AI Insights', icon: Brain, color: 'from-purple-600 to-indigo-600' }
  ]
  const tabs = allTabs.filter(t => isTabEnabled(t.id))

  useEffect(() => {
    if (isLoaded && tabs.length > 0 && !tabs.find(t => t.id === activeTab)) {
      setActiveTab(tabs[0].id)
    }
  }, [isLoaded, tabs.length])

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-between gap-2 md:gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Receipt className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Purchase Invoice Analytics</h1>
                <p className="text-white/90 text-xs md:text-sm">Admin dashboard & insights</p>
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
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'verification' && <ExcelVerification />}
            {activeTab === 'expiry-alerts' && <ExpiryAlerts />}
            {activeTab === 'suppliers' && <SupplierPerformance />}
            {activeTab === 'margins' && <MarginPlayground />}
            {activeTab === 'simulator' && <MarginSimulator />}
            {activeTab === 'ai-insights' && <AIInsights />}
          </ErrorBoundary>
        </div>
      </div>

      {showHelp && (
        <HowToUseModal role="admin" activeTab={activeTab} onClose={() => setShowHelp(false)} />
      )}
    </Layout>
  )
}

export default AdminPurchaseInvoicePage
