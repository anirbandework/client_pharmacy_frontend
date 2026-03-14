import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Layout from '../../components/Layout'
import AdminAnalytics from './components/admin_components/AdminAnalytics'
import Analytics from './components/admin_components/Analytics'
import AdminBillHistory from './components/admin_components/AdminBillHistory'
import AdminReports from './components/admin_components/AdminReports'
import AdminDashboard from './components/admin_components/AdminDashboard'
import AdminBillConfigManager from './components/admin_components/AdminBillConfigManager'
import { BarChart3, TrendingUp, Brain, FileText, BarChart, LayoutDashboard, Settings } from 'lucide-react'

const AdminBillingPage = () => {
  const [activeTab, setActiveTab] = useState('analytics')

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'from-blue-500 to-blue-600' },
    { id: 'insights', label: 'AI Insights', icon: Brain, color: 'from-purple-500 to-purple-600' },
    { id: 'history', label: 'Bill History', icon: FileText, color: 'from-green-500 to-green-600' },
    { id: 'reports', label: 'Reports', icon: BarChart, color: 'from-orange-500 to-orange-600' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-teal-500 to-teal-600' },
    { id: 'config', label: 'Bill Config', icon: Settings, color: 'from-gray-500 to-gray-600' },
  ]

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
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'insights' && <AdminAnalytics />}
          {activeTab === 'history' && <AdminBillHistory />}
          {activeTab === 'reports' && <AdminReports />}
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'config' && <AdminBillConfigManager />}
        </div>
      </div>
    </Layout>
  )
}

export default AdminBillingPage
