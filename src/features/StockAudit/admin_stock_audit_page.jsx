import { useState, useEffect } from 'react'
import useTabPermissions from '../../hooks/useTabPermissions'
import Layout from '../../components/Layout'
import Dashboard from './components/admin_components/Dashboard'
import Discrepancies from './components/admin_components/Discrepancies'
import AIInsights from './components/admin_components/AIInsights'
import ExcelVerification from './components/admin_components/ExcelVerification'
import AdminStockItems from './components/admin_components/AdminStockItems'
import AdminRacks from './components/admin_components/AdminRacks'
import AdminReports from './components/admin_components/AdminReports'
import ConsolidatedStockView from './components/shared/ConsolidatedStockView'
import ErrorBoundary from './components/shared/ErrorBoundary'
import { LayoutDashboard, AlertTriangle, Brain, CheckSquare, Sparkles, Store, Package, Grid, FileBarChart, Layers } from 'lucide-react'
import { adminApi } from '../Admin&SuperAdmin/services/admin&superAminApi'
import toast from 'react-hot-toast'

const AdminStockAnalytics = () => {
  const [activeTab, setActiveTab] = useState('items')
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)
  const { isTabEnabled, isLoaded } = useTabPermissions('stock_analytics')

  const allTabs = [
    { id: 'items', label: 'Items', icon: Package, color: 'from-blue-500 to-blue-600' },
    { id: 'racks', label: 'Racks', icon: Grid, color: 'from-purple-500 to-purple-600' },
    { id: 'reports', label: 'Reports', icon: FileBarChart, color: 'from-teal-500 to-teal-600' },
    { id: 'ai-analytics', label: 'AI Analytics', icon: Brain, color: 'from-purple-600 to-indigo-600' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-blue-600' },
    { id: 'discrepancies', label: 'Discrepancies', icon: AlertTriangle, color: 'from-red-500 to-red-600' },
    { id: 'excel-verification', label: 'Excel Verification', icon: CheckSquare, color: 'from-amber-500 to-orange-500' },
    { id: 'consolidated', label: 'Stock View', icon: Layers, color: 'from-teal-500 to-teal-600' }
  ]
  const tabs = allTabs.filter(t => isTabEnabled(t.id))

  useEffect(() => {
    if (isLoaded && tabs.length > 0 && !tabs.find(t => t.id === activeTab)) {
      setActiveTab(tabs[0].id)
    }
  }, [isLoaded, tabs.length])

  useEffect(() => {
    fetchShops()
  }, [])

  const fetchShops = async () => {
    try {
      const response = await adminApi.getShops()
      setShops(response)
    } catch {
      toast.error('Failed to fetch shops')
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-between gap-2 md:gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Stock Analytics</h1>
                <p className="text-white/90 text-xs md:text-sm">Audit insights, discrepancies & expiry tracking</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shared Shop Filter */}
        <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow border border-slate-200 dark:border-slate-700/50 p-3 mb-4 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <Store className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300 whitespace-nowrap">Filter by Shop:</label>
          <select
            value={selectedShop || ''}
            onChange={(e) => setSelectedShop(e.target.value ? parseInt(e.target.value) : null)}
            className="flex-1 max-w-xs px-3 py-2 border-2 border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="">All Shops</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>{shop.shop_name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4 overflow-x-auto pb-2">
          <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-lg p-1.5 inline-flex gap-1 min-w-full md:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50'
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
            {activeTab === 'items' && <AdminStockItems selectedShop={selectedShop} />}
            {activeTab === 'racks' && <AdminRacks selectedShop={selectedShop} />}
            {activeTab === 'reports' && <AdminReports selectedShop={selectedShop} />}
            {activeTab === 'ai-analytics' && <AIInsights selectedShop={selectedShop} />}
            {activeTab === 'dashboard' && <Dashboard selectedShop={selectedShop} />}
            {activeTab === 'discrepancies' && <Discrepancies selectedShop={selectedShop} />}
            {activeTab === 'excel-verification' && <ExcelVerification selectedShop={selectedShop} />}
            {activeTab === 'consolidated' && <ConsolidatedStockView mode="admin" selectedShop={selectedShop} />}
          </ErrorBoundary>
        </div>
      </div>
    </Layout>
  )
}

export default AdminStockAnalytics
