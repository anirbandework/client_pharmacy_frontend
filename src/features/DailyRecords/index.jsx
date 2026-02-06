import React, { useState } from 'react'
import Layout from '../../components/Layout'
import DailyRecordForm from './components/DailyRecordForm'
import ExcelUpload from './components/ExcelUpload'
import Dashboard from './components/Dashboard'
import RecordsList from './components/RecordsList'
import MonthlyAnalytics from './components/MonthlyAnalytics'
import VarianceReport from './components/VarianceReport'
import AuditLogs from './components/AuditLogs'
import { FileText, Upload, LayoutDashboard, List, BarChart3, AlertTriangle, History, Sparkles } from 'lucide-react'

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
        <div className="bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 rounded-2xl shadow-2xl p-8 mb-6 animate-fade-in relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Daily Records</h1>
                <p className="text-white/90 text-base">Complete business tracking & analytics system</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
              <div className="text-white/80 text-xs uppercase tracking-wider mb-1">Active Records</div>
              <div className="text-3xl font-bold text-white">{refresh}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="inline-flex bg-white rounded-2xl shadow-lg p-2 border border-primary-100 gap-2 min-w-full md:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative py-3 px-5 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2.5 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-white shadow-xl scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {activeTab === tab.id && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-xl`}></div>
                )}
                <tab.icon className={`w-5 h-5 relative z-10 ${
                  activeTab === tab.id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'
                }`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="animate-fade-in space-y-6">
          {activeTab === 'dashboard' && <Dashboard key={refresh} />}
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