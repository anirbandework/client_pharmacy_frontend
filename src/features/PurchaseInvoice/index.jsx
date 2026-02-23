import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Layout from '../../components/Layout'
import UploadInvoice from './components/UploadInvoice'
import InvoiceList from './components/InvoiceList'
import Dashboard from './components/Dashboard'
import { LayoutDashboard, Upload, FileText, Receipt } from 'lucide-react'

const PurchaseInvoice = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [refresh, setRefresh] = useState(0)

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-blue-600' },
    { id: 'upload', label: 'Upload Invoice', icon: Upload, color: 'from-green-500 to-green-600' },
    { id: 'list', label: 'Invoice List', icon: FileText, color: 'from-purple-500 to-purple-600' }
  ]

  return (
    <Layout>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <div className="hidden md:block bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Receipt className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Purchase Invoice Analyzer</h1>
                <p className="text-white/90 text-xs md:text-sm">AI-powered invoice extraction & management</p>
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
                  activeTab === tab.id ? 'text-white shadow-lg scale-105' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {activeTab === tab.id && <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-lg`}></div>}
                <tab.icon className={`w-4 h-4 relative z-10 ${activeTab === tab.id ? '' : 'group-hover:scale-110 transition-transform'}`} />
                <span className="relative z-10 hidden sm:inline">{tab.label}</span>
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
    </Layout>
  )
}

export default PurchaseInvoice
