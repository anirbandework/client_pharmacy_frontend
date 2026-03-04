import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Layout from '../../components/Layout'
import GeofenceGuard from '../../components/GeofenceGuard'
import UploadInvoice from './components/UploadInvoice'
import InvoiceList from './components/InvoiceList'
import Dashboard from './components/Dashboard'
import { LayoutDashboard, Upload, FileText, Receipt } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const PurchaseInvoice = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [refresh, setRefresh] = useState(0)
  const { user } = useAuth()
  const isAdmin = user?.user_type === 'admin'

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-blue-600' },
    { id: 'upload', label: 'Upload Invoice', icon: Upload, color: 'from-green-500 to-green-600', staffOnly: true },
    { id: 'list', label: 'Invoice List', icon: FileText, color: 'from-purple-500 to-purple-600' }
  ]

  const visibleTabs = tabs.filter(tab => {
    if (tab.adminOnly && !isAdmin) return false
    if (tab.staffOnly && isAdmin) return false
    return true
  })

  return (
    <Layout>
      <Toaster position="top-right" />
      <GeofenceGuard moduleName="invoice analyzer">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Receipt className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Purchase Invoice Analyzer</h1>
              <p className="text-white/90 text-xs md:text-sm">AI-powered invoice extraction & management</p>
            </div>
          </div>
        </div>

        <div className="mb-4 md:mb-6 overflow-x-auto pb-2">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg p-1.5 inline-flex gap-1 min-w-full md:min-w-0">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 md:py-3 px-4 md:px-6 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
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
          {activeTab === 'upload' && <UploadInvoice onUploadSuccess={() => setRefresh(r => r + 1)} />}
          {activeTab === 'list' && <InvoiceList refresh={refresh} />}
        </div>
      </div>
      </GeofenceGuard>
    </Layout>
  )
}

export default PurchaseInvoice
