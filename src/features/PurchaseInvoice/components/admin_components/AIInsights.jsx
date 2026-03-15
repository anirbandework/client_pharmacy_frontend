import { useState, useEffect } from 'react'
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
        <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 p-4">
          <div className="flex items-center gap-3">
            <Store className="w-5 h-5 text-gray-600 dark:text-slate-400" />
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Filter by Shop:</label>
            <select
              value={selectedShop || ''}
              onChange={(e) => setSelectedShop(e.target.value ? parseInt(e.target.value) : null)}
              className="flex-1 max-w-xs px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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

        <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 p-12 text-center">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-300 mb-2">Generating AI Insights...</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">This may take up to 2 minutes</p>
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
        <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 p-8 text-center">
          <Brain className="w-16 h-16 mx-auto text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Generate AI Insights</h3>
          <p className="text-gray-600 dark:text-slate-400 mb-6">Click below to analyze your invoice data with AI</p>
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
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <IndianRupee className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Total Spend</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  ₹{analytics.data_summary.overview?.total_spend?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Total Invoices</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  {analytics.data_summary.overview?.total_invoices}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Avg Invoice</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  ₹{analytics.data_summary.overview?.avg_invoice_value?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400">Expiring Soon</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  {analytics.data_summary.expiry_alerts?.expiring_soon_count || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {analytics && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl shadow-lg border border-purple-100 dark:border-purple-800/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">AI-Powered Insights</h2>
              </div>
            </div>
            <button
              onClick={fetchAIAnalytics}
              disabled={loading}
              className="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-slate-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {analytics.ai_insights ? (
            <div className="bg-white dark:bg-slate-800/80 rounded-lg p-6 prose prose-sm max-w-none prose-headings:text-gray-800 dark:prose-headings:text-white prose-h2:text-lg prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-base prose-h3:font-semibold prose-h3:mt-4 prose-h3:mb-2 prose-p:text-gray-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-ul:text-gray-700 dark:prose-ul:text-slate-300 prose-li:my-1 prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold">
              <ReactMarkdown>{analytics.ai_insights}</ReactMarkdown>
            </div>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/40 rounded-lg p-4">
              <p className="text-yellow-800 dark:text-yellow-300">
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
