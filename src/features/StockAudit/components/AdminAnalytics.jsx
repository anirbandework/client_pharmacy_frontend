import { useState, useEffect } from 'react'
import { Loader2, Info, Store, BarChart3, Brain, AlertTriangle, Package, TrendingUp, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import StockAnalyticsDashboard from './StockAnalyticsDashboard'
import { stockAnalyticsAPI } from '../services/analyticsApi'
import { adminApi } from '../../Admin&SuperAdmin/services/admin&superAminApi'

export default function AdminAnalytics() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [dashboardData, setDashboardData] = useState(null)
  const [aiInsights, setAIInsights] = useState(null)
  const [discrepancyDetails, setDiscrepancyDetails] = useState(null)
  const [loading, setLoading] = useState({})
  const [error, setError] = useState({})
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)

  useEffect(() => {
    fetchShops()
  }, [])

  useEffect(() => {
    if (selectedShop !== null) {
      setDashboardData(null)
      setAIInsights(null)
      setDiscrepancyDetails(null)
      setLoading({})
      setError({})
    }
  }, [selectedShop])

  const fetchShops = async () => {
    try {
      const response = await adminApi.getShops()
      setShops(response)
    } catch (error) {
      toast.error('Failed to fetch shops')
    }
  }

  const fetchDashboard = async () => {
    if (dashboardData) return
    setLoading(prev => ({ ...prev, dashboard: true }))
    setError(prev => ({ ...prev, dashboard: null }))
    try {
      const params = selectedShop ? { shop_id: selectedShop } : {}
      const { data } = await stockAnalyticsAPI.getAdminDashboard(params)
      setDashboardData(data)
    } catch (err) {
      setError(prev => ({ ...prev, dashboard: err.response?.data?.detail || 'Failed to load dashboard' }))
    } finally {
      setLoading(prev => ({ ...prev, dashboard: false }))
    }
  }

  const fetchAIInsights = async () => {
    if (aiInsights) return
    setLoading(prev => ({ ...prev, ai: true }))
    setError(prev => ({ ...prev, ai: null }))
    try {
      const params = selectedShop ? { shop_id: selectedShop } : {}
      const { data } = await stockAnalyticsAPI.getAIInsights(params)
      setAIInsights(data.insights || data)
    } catch (err) {
      setError(prev => ({ ...prev, ai: err.response?.data?.detail || 'Failed to load AI insights' }))
    } finally {
      setLoading(prev => ({ ...prev, ai: false }))
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'dashboard') fetchDashboard()
    else if (tab === 'discrepancies') {
      if (!discrepancyDetails && dashboardData) {
        setDiscrepancyDetails(dashboardData)
      } else if (!dashboardData) {
        fetchDashboard()
      }
    }
    else if (tab === 'ai') fetchAIInsights()
  }

  return (
    <div className="space-y-4">
      {/* Shop Filter */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center gap-3">
          <Store className="w-5 h-5 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Filter by Shop:</label>
          <select
            value={selectedShop || ''}
            onChange={(e) => {
              setSelectedShop(e.target.value ? parseInt(e.target.value) : null)
              setDashboardData(null)
              setAIInsights(null)
            }}
            className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Shops</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.shop_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
        <Info className="w-4 h-4 text-blue-600" />
        <p className="text-sm text-blue-800">
          Analytics based on stock audit data including discrepancies, expiry tracking, and audit performance
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => handleTabChange('dashboard')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'dashboard'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Dashboard
        </button>
        <button
          onClick={() => handleTabChange('discrepancies')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'discrepancies'
              ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Discrepancies
        </button>
        <button
          onClick={() => handleTabChange('ai')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'ai'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Brain className="w-4 h-4" />
          AI Insights
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        loading.dashboard ? (
          <div className="bg-white rounded-xl shadow-md p-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : error.dashboard ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error.dashboard}</p>
          </div>
        ) : dashboardData ? (
          <StockAnalyticsDashboard data={dashboardData} />
        ) : null
      )}

      {activeTab === 'discrepancies' && (
        loading.dashboard ? (
          <div className="bg-white rounded-xl shadow-md p-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          </div>
        ) : (dashboardData || discrepancyDetails) ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="text-sm text-orange-600 mb-1">Total Discrepancies</p>
                <p className="text-2xl font-bold text-orange-700">{(dashboardData || discrepancyDetails).discrepancy_analysis.total_discrepancies}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-green-600 mb-1">Excess Stock</p>
                <p className="text-2xl font-bold text-green-700">{(dashboardData || discrepancyDetails).discrepancy_analysis.positive_discrepancies}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600 mb-1">Missing Stock</p>
                <p className="text-2xl font-bold text-red-700">{(dashboardData || discrepancyDetails).discrepancy_analysis.negative_discrepancies}</p>
              </div>
            </div>

            {(dashboardData || discrepancyDetails).discrepancy_analysis.discrepancy_list.length > 0 ? (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Discrepancy Details</h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {(dashboardData || discrepancyDetails).discrepancy_analysis.discrepancy_list.map((item, idx) => (
                    <div key={idx} className={`p-4 rounded-lg border ${
                      item.discrepancy > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-gray-800">{item.product_name}</p>
                          <p className="text-sm text-gray-600">Batch: {item.batch_number}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            item.discrepancy > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.discrepancy > 0 ? '+' : ''}{item.discrepancy}
                          </p>
                          <p className="text-xs text-gray-500">₹{item.value_impact.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Software Qty</p>
                          <p className="font-semibold">{item.software_qty}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Physical Qty</p>
                          <p className="font-semibold">{item.physical_qty}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Discrepancies Found</h3>
                <p className="text-gray-500">All stock items match between software and physical counts.</p>
              </div>
            )}
          </div>
        ) : null
      )}

      {activeTab === 'ai' && (
        loading.ai ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Generating AI Insights...</h3>
            <p className="text-sm text-gray-500">This may take up to 2 minutes</p>
          </div>
        ) : error.ai ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error.ai}</p>
          </div>
        ) : aiInsights ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            {dashboardData && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Items</p>
                      <p className="text-xl font-bold text-gray-800">
                        {dashboardData.stock_overview?.total_items}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Audit Rate</p>
                      <p className="text-xl font-bold text-gray-800">
                        {dashboardData.stock_overview?.audit_completion_rate}%
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Discrepancies</p>
                      <p className="text-xl font-bold text-gray-800">
                        {dashboardData.discrepancy_analysis?.total_discrepancies}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Expired Items</p>
                      <p className="text-xl font-bold text-gray-800">
                        {dashboardData.expiry_analysis?.categories?.find(c => c.name === 'Expired')?.count || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">AI-Powered Stock Insights</h2>
                  </div>
                </div>
                <button
                  onClick={fetchAIInsights}
                  disabled={loading.ai}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-5 h-5 text-gray-600 ${loading.ai ? 'animate-spin' : ''}`} />
                </button>
              </div>
              
              {typeof aiInsights === 'string' ? (
                <div className="bg-white rounded-lg p-6 prose prose-sm max-w-none prose-headings:text-gray-800 prose-h2:text-lg prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-base prose-h3:font-semibold prose-h3:mt-4 prose-h3:mb-2 prose-p:text-gray-700 prose-p:leading-relaxed prose-ul:text-gray-700 prose-li:my-1 prose-strong:text-gray-900 prose-strong:font-semibold">
                  <ReactMarkdown>{aiInsights}</ReactMarkdown>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    {aiInsights?.error || 'AI insights unavailable. Please configure GEMINI_API_KEY.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null
      )}
    </div>
  )
}
