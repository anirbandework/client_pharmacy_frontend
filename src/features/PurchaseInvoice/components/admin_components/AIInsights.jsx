import React, { useState, useEffect } from 'react'
import { Brain, TrendingUp, AlertTriangle, Package, IndianRupee, Loader2, RefreshCw, Store } from 'lucide-react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import { adminPurchaseInvoiceAPI } from '../../services/admin_purchase_invoice_apis'
import { adminApi } from '../../../Admin&SuperAdmin/services/admin&superAminApi'

const AIInsights = () => {
  const [loading, setLoading] = useState(false)
  const [analytics, setAnalytics] = useState(null)
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)

  useEffect(() => {
    fetchShops()
  }, [])

  useEffect(() => {
    if (shops.length > 0) {
      setAnalytics(null)
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

  const fetchAIAnalytics = async () => {
    setLoading(true)
    try {
      const params = selectedShop ? { shop_id: selectedShop } : {}
      const response = await adminPurchaseInvoiceAPI.getAdminAIAnalytics(params)
      setAnalytics(response.data)
    } catch (error) {
      console.error('AI Analytics Error:', error)
      toast.error(error.response?.data?.detail || 'Failed to fetch AI analytics')
      setAnalytics({ error: 'Failed to load analytics. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (loading && !analytics) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <Store className="w-5 h-5 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">Filter by Shop:</label>
            <select
              value={selectedShop || ''}
              onChange={(e) => setSelectedShop(e.target.value ? parseInt(e.target.value) : null)}
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

        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Generating AI Insights...</h3>
          <p className="text-sm text-gray-500">This may take up to 2 minutes</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center gap-3">
          <Store className="w-5 h-5 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Filter by Shop:</label>
          <select
            value={selectedShop || ''}
            onChange={(e) => setSelectedShop(e.target.value ? parseInt(e.target.value) : null)}
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

      {!analytics && (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Brain className="w-16 h-16 mx-auto text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Generate AI Insights</h3>
          <p className="text-gray-600 mb-6">Click below to analyze your invoice data with AI</p>
          <button
            onClick={fetchAIAnalytics}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 flex items-center gap-2 mx-auto"
          >
            <Brain className="w-5 h-5" />
            Generate Insights
          </button>
        </div>
      )}

      {analytics?.data_summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <IndianRupee className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spend</p>
                <p className="text-xl font-bold text-gray-800">
                  ₹{analytics.data_summary.overview?.total_spend?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-xl font-bold text-gray-800">
                  {analytics.data_summary.overview?.total_invoices}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Invoice</p>
                <p className="text-xl font-bold text-gray-800">
                  ₹{analytics.data_summary.overview?.avg_invoice_value?.toLocaleString()}
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
                <p className="text-sm text-gray-600">Expiring Soon</p>
                <p className="text-xl font-bold text-gray-800">
                  {analytics.data_summary.expiry_alerts?.expiring_soon_count || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {analytics && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">AI-Powered Insights</h2>
              </div>
            </div>
            <button
              onClick={fetchAIAnalytics}
              disabled={loading}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          {analytics.ai_insights ? (
            <div className="bg-white rounded-lg p-6 prose prose-sm max-w-none prose-headings:text-gray-800 prose-h2:text-lg prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-base prose-h3:font-semibold prose-h3:mt-4 prose-h3:mb-2 prose-p:text-gray-700 prose-p:leading-relaxed prose-ul:text-gray-700 prose-li:my-1 prose-strong:text-gray-900 prose-strong:font-semibold">
              <ReactMarkdown>{analytics.ai_insights}</ReactMarkdown>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                {analytics.error || 'AI insights unavailable. Please configure GEMINI_API_KEY.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AIInsights
