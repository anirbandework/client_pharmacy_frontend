import React, { useState } from 'react'
import Layout from '../../components/Layout'
import Dashboard from './components/Dashboard'
import InvoiceForm from './components/InvoiceForm'
import MonthlyInvoices from './components/MonthlyInvoices'
import ExpiryAlerts from './components/ExpiryAlerts'
import Analytics from './components/Analytics'
import SlowMovingItems from './components/SlowMovingItems'
import AIAnalytics from './components/AIAnalytics'
import RecordSale from './components/RecordSale'
import WingsIntegration from './components/WingsIntegration'
import ExpiringItems from './components/ExpiringItems'
import { LayoutDashboard, FileText, Calendar, AlertTriangle, BarChart3, TrendingDown, Brain, Package, ShoppingCart, Zap, Clock } from 'lucide-react'

const PurchaseInvoice = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [refresh, setRefresh] = useState(0)

  const handleSuccess = () => {
    setRefresh(prev => prev + 1)
    setActiveTab('invoices')
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-blue-600' },
    { id: 'create', label: 'Add Invoice', icon: FileText, color: 'from-green-500 to-green-600' },
    { id: 'invoices', label: 'Invoices', icon: Calendar, color: 'from-purple-500 to-purple-600' },
    { id: 'sale', label: 'Record Sale', icon: ShoppingCart, color: 'from-teal-500 to-teal-600' },
    { id: 'expiry', label: 'Expiry Alerts', icon: AlertTriangle, color: 'from-red-500 to-red-600' },
    { id: 'expiring', label: 'Expiring Items', icon: Clock, color: 'from-orange-500 to-orange-600' },
    { id: 'slow', label: 'Slow Moving', icon: TrendingDown, color: 'from-yellow-500 to-yellow-600' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'from-indigo-500 to-indigo-600' },
    { id: 'ai', label: 'AI Insights', icon: Brain, color: 'from-pink-500 to-pink-600' },
    { id: 'wings', label: 'WINGS Sync', icon: Zap, color: 'from-blue-500 to-indigo-600' }
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="hidden md:block bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Package className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Purchase Invoice Analyzer</h1>
                <p className="text-white/90 text-xs md:text-sm">Track, analyze & optimize inventory</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-3 md:mb-4 overflow-x-auto pb-2 -mx-4 px-4">
          <div className="inline-flex bg-white rounded-xl shadow-md p-1.5 border border-primary-100 gap-1 min-w-full md:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative py-2 px-3 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-1.5 md:gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {activeTab === tab.id && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-lg`}></div>
                )}
                <tab.icon className={`w-4 h-4 relative z-10 ${
                  activeTab === tab.id ? '' : 'group-hover:scale-110 transition-transform'
                }`} />
                <span className="relative z-10 hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="animate-fade-in space-y-4">
          {activeTab === 'dashboard' && <Dashboard key={refresh} />}
          {activeTab === 'create' && <InvoiceForm onSuccess={handleSuccess} />}
          {activeTab === 'invoices' && <MonthlyInvoices refresh={refresh} />}
          {activeTab === 'sale' && <RecordSale onSuccess={() => setRefresh(prev => prev + 1)} />}
          {activeTab === 'expiry' && <ExpiryAlerts />}
          {activeTab === 'expiring' && <ExpiringItems />}
          {activeTab === 'slow' && <SlowMovingItems />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'ai' && <AIAnalytics />}
          {activeTab === 'wings' && <WingsIntegration onSuccess={() => setRefresh(prev => prev + 1)} />}
        </div>
      </div>
    </Layout>
  )
}

export default PurchaseInvoice
