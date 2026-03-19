import React, { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import Layout from '../../components/Layout'
// import GeofenceGuard from '../../components/GeofenceGuard'
import CreateBill from './components/staff_components/CreateBill'
import BillHistory from './components/staff_components/BillHistory'
import Dashboard from './components/staff_components/Dashboard'
import Reports from './components/staff_components/Reports'
import DailyRecords from './components/staff_components/DailyRecords'
import BillConfigManager from './components/staff_components/BillConfigManager'
import StaffProfitAnalysis from './components/staff_components/StaffProfitAnalysis'
import { billingAPI } from './services/staff_billing_apis'
import useTabPermissions from '../../hooks/useTabPermissions'
import { LayoutDashboard, Plus, FileText, BarChart3, Receipt, Calendar, Settings, HelpCircle, X, TrendingUp } from 'lucide-react'

const StaffBillingPage = () => {
  const [activeTab, setActiveTab] = useState('create')
  const [refresh, setRefresh] = useState(0)
  const [showGuide, setShowGuide] = useState(false)
  const [userGuide, setUserGuide] = useState('')
  const [guideLoading, setGuideLoading] = useState(false)
  const { isTabEnabled, isLoaded } = useTabPermissions('billing')

  const fetchUserGuide = async () => {
    setGuideLoading(true)
    try {
      const { data } = await billingAPI.getUserGuide()
      setUserGuide(data.content)
    } catch (error) {
      console.error('Failed to load user guide:', error)
      setUserGuide('# User Guide\n\nFailed to load user guide. Please try again later.')
    } finally {
      setGuideLoading(false)
    }
  }

  const handleShowGuide = () => {
    setShowGuide(true)
    if (!userGuide) {
      fetchUserGuide()
    }
  }

  const allTabs = [
    { id: 'create', label: 'New Bill', icon: Plus, color: 'from-green-500 to-green-600' },
    { id: 'history', label: 'Bill History', icon: FileText, color: 'from-purple-500 to-purple-600' },
    { id: 'reports', label: 'Reports', icon: BarChart3, color: 'from-orange-500 to-orange-600' },
    { id: 'daily', label: 'Daily Records', icon: Calendar, color: 'from-pink-500 to-pink-600' },
    { id: 'config', label: 'Bill Config', icon: Settings, color: 'from-gray-500 to-gray-600' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-blue-600' },
    { id: 'profit', label: 'Profit Analysis', icon: TrendingUp, color: 'from-indigo-500 to-purple-600' }
  ]
  const tabs = allTabs.filter(t => isTabEnabled(t.id))

  useEffect(() => {
    if (isLoaded && tabs.length > 0 && !tabs.find(t => t.id === activeTab)) {
      setActiveTab(tabs[0].id)
    }
  }, [isLoaded, tabs.length])

  return (
    <Layout>
      <Toaster position="top-right" />
      {/* <GeofenceGuard moduleName="billing"> */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Receipt className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Billing System</h1>
                <p className="text-white/90 text-xs md:text-sm">Customer billing & invoice management</p>
              </div>
            </div>
            <button
              onClick={handleShowGuide}
              className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all"
              title="How to Use"
            >
              <HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="mb-4 md:mb-6 overflow-x-auto pb-2">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg p-1.5 inline-flex gap-1 min-w-full md:min-w-0">
            {tabs.map((tab) => (
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

        <div className="animate-fade-in space-y-4 pb-20">
          {activeTab === 'dashboard' && <Dashboard key={refresh} />}
          {activeTab === 'create' && <CreateBill onBillCreated={() => setRefresh(r => r + 1)} />}
          {activeTab === 'history' && <BillHistory />}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'daily' && <DailyRecords />}
          {activeTab === 'config' && <BillConfigManager />}
          {activeTab === 'profit' && <StaffProfitAnalysis />}
        </div>
      </div>
      
      {/* User Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-600 to-indigo-600">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-6 h-6" />
                How to Use - Billing System
              </h2>
              <button
                onClick={() => setShowGuide(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {guideLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-600">Loading user guide...</div>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({children}) => <h1 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b">{children}</h1>,
                      h2: ({children}) => <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">{children}</h2>,
                      h3: ({children}) => <h3 className="text-lg font-medium text-gray-700 mt-4 mb-2">{children}</h3>,
                      p: ({children}) => <p className="text-gray-600 mb-3 leading-relaxed">{children}</p>,
                      ul: ({children}) => <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-1">{children}</ol>,
                      li: ({children}) => <li className="ml-2">{children}</li>,
                      strong: ({children}) => <strong className="font-semibold text-gray-800">{children}</strong>,
                      hr: () => <hr className="my-6 border-gray-200" />,
                      code: ({children}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">{children}</code>
                    }}
                  >
                    {userGuide}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* </GeofenceGuard> */}
    </Layout>
  )
}

export default StaffBillingPage
