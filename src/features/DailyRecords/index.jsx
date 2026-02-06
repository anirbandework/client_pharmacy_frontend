import React, { useState } from 'react'
import Layout from '../../components/Layout'
import DailyRecordForm from './components/DailyRecordForm'
import ExcelUpload from './components/ExcelUpload'
import Dashboard from './components/Dashboard'
import RecordsList from './components/RecordsList'
import MonthlyAnalytics from './components/MonthlyAnalytics'
import VarianceReport from './components/VarianceReport'
import AuditLogs from './components/AuditLogs'
import AIAnalytics from './components/AIAnalytics'
import { FileText, Upload, LayoutDashboard, List, BarChart3, AlertTriangle, History, Sparkles, Brain } from 'lucide-react'

const DailyRecords = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [refresh, setRefresh] = useState(0)
  const [editRecord, setEditRecord] = useState(null)

  const handleSuccess = () => {
    setRefresh(prev => prev + 1)
    setEditRecord(null)
    setActiveTab('list')
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-blue-600' },
    { id: 'ai', label: 'AI Analytics', icon: Brain, color: 'from-purple-500 to-pink-600' },
    { id: 'form', label: 'Add Record', icon: FileText, color: 'from-green-500 to-green-600' },
    { id: 'list', label: 'Records', icon: List, color: 'from-purple-500 to-purple-600' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'from-pink-500 to-pink-600' },
    { id: 'variances', label: 'Variances', icon: AlertTriangle, color: 'from-red-500 to-red-600' },
    { id: 'audit', label: 'Audit', icon: History, color: 'from-indigo-500 to-indigo-600' },
    { id: 'upload', label: 'Import', icon: Upload, color: 'from-yellow-500 to-yellow-600' }
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Daily Records</h1>
                <p className="text-white/90 text-xs md:text-sm">Business tracking & analytics</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/30">
              <div className="text-white/80 text-[10px] uppercase tracking-wider">Records</div>
              <div className="text-xl md:text-2xl font-bold text-white">{refresh}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-4 overflow-x-auto pb-2 -mx-4 px-4">
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

        {/* Content */}
        <div className="animate-fade-in space-y-4">
          {activeTab === 'dashboard' && <Dashboard key={refresh} />}
          {activeTab === 'ai' && <AIAnalytics />}
          {activeTab === 'form' && <DailyRecordForm onSuccess={handleSuccess} editData={editRecord} />}
          {activeTab === 'list' && <RecordsList onEdit={(record) => { setEditRecord(record); setActiveTab('form'); }} refresh={refresh} />}
          {activeTab === 'analytics' && <MonthlyAnalytics />}
          {activeTab === 'variances' && <VarianceReport />}
          {activeTab === 'audit' && <AuditLogs />}
          {activeTab === 'upload' && <ExcelUpload onSuccess={handleSuccess} />}
        </div>
      </div>
    </Layout>
  )
}

export default DailyRecords