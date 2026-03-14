import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Layout from '../../components/Layout'
import AdminAnalytics from './components/admin_components/AdminAnalytics'
import Analytics from './components/admin_components/Analytics'
import AdminBillHistory from './components/admin_components/AdminBillHistory'
import AdminReports from './components/admin_components/AdminReports'
import AdminDashboard from './components/admin_components/AdminDashboard'
import AdminBillConfigManager from './components/admin_components/AdminBillConfigManager'
import AdminProfitAnalysis from './components/admin_components/AdminProfitAnalysis'
import { BarChart3, TrendingUp, Brain, FileText, BarChart, LayoutDashboard, Settings, Store, IndianRupee } from 'lucide-react'
import { adminApi } from '../Admin&SuperAdmin/services/admin&superAminApi'
import useTabPermissions from '../../hooks/useTabPermissions'
import toast from 'react-hot-toast'

const AdminBillingPage = () => {
  const [activeTab, setActiveTab] = useState('analytics')
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)
  const { isTabEnabled, isLoaded } = useTabPermissions('billing_analytics')

  const allTabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'from-blue-500 to-blue-600' },
    { id: 'insights', label: 'AI Insights', icon: Brain, color: 'from-purple-500 to-purple-600' },
    { id: 'history', label: 'Bill History', icon: FileText, color: 'from-green-500 to-green-600' },
    { id: 'reports', label: 'Reports', icon: BarChart, color: 'from-orange-500 to-orange-600' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-teal-500 to-teal-600' },
    { id: 'config', label: 'Bill Config', icon: Settings, color: 'from-gray-500 to-gray-600' },
    { id: 'profit', label: 'Profit Analysis', icon: IndianRupee, color: 'from-indigo-500 to-purple-600' },
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
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Billing Analytics</h1>
                <p className="text-white/90 text-xs md:text-sm">Revenue insights, expenses & AI-powered recommendations</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <TrendingUp className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Admin Only</span>
            </div>
          </div>
        </div>

        {/* Shared Shop Filter */}
        <div className="bg-white rounded-xl shadow border border-slate-200 p-3 mb-4 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Store className="w-4 h-4 text-indigo-600" />
          </div>
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by Shop:</label>
          <select
            value={selectedShop || ''}
            onChange={(e) => setSelectedShop(e.target.value ? parseInt(e.target.value) : null)}
            className="flex-1 max-w-xs px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="">All Shops</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>{shop.shop_name}</option>
            ))}
          </select>
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
          {activeTab === 'analytics' && <Analytics selectedShop={selectedShop} />}
          {activeTab === 'insights' && <AdminAnalytics selectedShop={selectedShop} />}
          {activeTab === 'history' && <AdminBillHistory selectedShop={selectedShop} />}
          {activeTab === 'reports' && <AdminReports selectedShop={selectedShop} />}
          {activeTab === 'dashboard' && <AdminDashboard selectedShop={selectedShop} />}
          {activeTab === 'config' && <AdminBillConfigManager selectedShop={selectedShop} />}
          {activeTab === 'profit' && <AdminProfitAnalysis selectedShop={selectedShop} />}
        </div>
      </div>
    </Layout>
  )
}

export default AdminBillingPage
