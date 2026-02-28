import React, { useState, useEffect } from 'react'
import { Brain, TrendingUp, AlertTriangle, Package, DollarSign, Calendar, Loader2, RefreshCw, Store, BarChart3, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import { purchaseInvoiceAPI } from '../services/api'
import { adminApi } from '../../Admin&SuperAdmin/services/admin&superAminApi'
import DashboardCharts from './DashboardCharts'

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(false)
  const [analytics, setAnalytics] = useState(null)
  const [expiryAlerts, setExpiryAlerts] = useState(null)
  const [supplierPerformance, setSupplierPerformance] = useState(null)
  const [dashboardData, setDashboardData] = useState(null)
  const [pendingInvoices, setPendingInvoices] = useState(null)
  const [activeView, setActiveView] = useState('dashboard')
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)

  useEffect(() => {
    fetchShops()
  }, [])

  useEffect(() => {
    if (shops.length > 0) {
      // Clear all data when shop changes
      setAnalytics(null)
      setExpiryAlerts(null)
      setSupplierPerformance(null)
      setDashboardData(null)
      setPendingInvoices(null)
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
      const response = await purchaseInvoiceAPI.getAdminAIAnalytics(params)
      setAnalytics(response.data)
    } catch (error) {
      console.error('AI Analytics Error:', error)
      toast.error(error.response?.data?.detail || 'Failed to fetch AI analytics')
      setAnalytics({ error: 'Failed to load analytics. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const fetchExpiryAlerts = async () => {
    try {
      const params = selectedShop ? { shop_id: selectedShop } : {}
      const response = await purchaseInvoiceAPI.getExpiryAlerts(params)
      setExpiryAlerts(response.data)
    } catch (error) {
      toast.error('Failed to fetch expiry alerts')
    }
  }

  const fetchSupplierPerformance = async () => {
    try {
      const params = selectedShop ? { shop_id: selectedShop } : {}
      const response = await purchaseInvoiceAPI.getSupplierPerformance(params)
      setSupplierPerformance(response.data)
    } catch (error) {
      toast.error('Failed to fetch supplier performance')
    }
  }

  const fetchDashboardData = async () => {
    try {
      const params = selectedShop ? { shop_id: selectedShop } : {}
      const response = await purchaseInvoiceAPI.getDashboardAnalytics(params)
      setDashboardData(response.data)
    } catch (error) {
      toast.error('Failed to fetch dashboard data')
    }
  }

  const fetchPendingInvoices = async () => {
    try {
      const params = selectedShop ? { shop_id: selectedShop } : {}
      const response = await purchaseInvoiceAPI.getPendingVerification(params)
      setPendingInvoices(response.data)
    } catch (error) {
      toast.error('Failed to fetch pending invoices')
    }
  }

  useEffect(() => {
    if (activeView === 'dashboard' && !dashboardData) {
      fetchDashboardData()
    } else if (activeView === 'expiry-alerts' && !expiryAlerts) {
      fetchExpiryAlerts()
    } else if (activeView === 'suppliers' && !supplierPerformance) {
      fetchSupplierPerformance()
    } else if (activeView === 'ai-insights' && !analytics) {
      fetchAIAnalytics()
    } else if (activeView === 'pending' && !pendingInvoices) {
      fetchPendingInvoices()
    }
  }, [activeView, selectedShop])

  if (loading && activeView === 'ai-insights' && !analytics) {
    return (
      <div className="space-y-6">
        {/* Shop Filter */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <Store className="w-5 h-5 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">Filter by Shop:</label>
            <select
              value={selectedShop || ''}
              onChange={(e) => {
                setSelectedShop(e.target.value ? parseInt(e.target.value) : null)
                setAnalytics(null)
                setExpiryAlerts(null)
                setSupplierPerformance(null)
                setDashboardData(null)
                setPendingInvoices(null)
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

        {/* View Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveView('dashboard')}
            className="px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-50"
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('pending')}
            className="px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-50"
          >
            <Clock className="w-4 h-4" />
            Pending Verification
          </button>
          <button
            onClick={() => setActiveView('expiry-alerts')}
            className="px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-50"
          >
            <AlertTriangle className="w-4 h-4" />
            Expiry Alerts
          </button>
          <button
            onClick={() => setActiveView('suppliers')}
            className="px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-50"
          >
            <Package className="w-4 h-4" />
            Suppliers
          </button>
          <button
            disabled
            className="px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
          >
            <Brain className="w-4 h-4" />
            AI Insights
          </button>
        </div>

        {/* Loading State */}
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
      {/* Shop Filter */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center gap-3">
          <Store className="w-5 h-5 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Filter by Shop:</label>
          <select
            value={selectedShop || ''}
            onChange={(e) => {
              setSelectedShop(e.target.value ? parseInt(e.target.value) : null)
              setAnalytics(null)
              setExpiryAlerts(null)
              setSupplierPerformance(null)
              setDashboardData(null)
              setPendingInvoices(null)
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

      {/* View Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 ${
            activeView === 'dashboard'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Dashboard
        </button>
        <button
          onClick={() => setActiveView('pending')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 ${
            activeView === 'pending'
              ? 'bg-gradient-to-r from-yellow-600 to-amber-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          Pending Verification
          {pendingInvoices?.total_pending > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {pendingInvoices.total_pending}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveView('expiry-alerts')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 ${
            activeView === 'expiry-alerts'
              ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Expiry Alerts
        </button>
        <button
          onClick={() => setActiveView('suppliers')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 ${
            activeView === 'suppliers'
              ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Package className="w-4 h-4" />
          Suppliers
        </button>
        <button
          onClick={() => setActiveView('ai-insights')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 ${
            activeView === 'ai-insights'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Brain className="w-4 h-4" />
          AI Insights
        </button>
      </div>

      {/* Verified Data Notice */}
      {activeView !== 'pending' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-600" />
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> All analytics are based on verified invoices only.
          </p>
        </div>
      )}

      {/* Dashboard View */}
      {activeView === 'dashboard' && <DashboardCharts data={dashboardData} />}

      {/* Pending Verification View */}
      {activeView === 'pending' && pendingInvoices && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-600 mb-1">Pending Invoices</p>
              <p className="text-2xl font-bold text-yellow-700">{pendingInvoices.total_pending}</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-sm text-orange-600 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-orange-700">₹{pendingInvoices.total_value.toLocaleString()}</p>
            </div>
          </div>

          {/* Pending Invoices List */}
          {pendingInvoices.invoices.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Invoices Awaiting Verification</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {pendingInvoices.invoices.map((invoice) => (
                  <div key={invoice.id} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-800">{invoice.invoice_number}</p>
                        <p className="text-sm text-gray-600">{invoice.supplier_name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Shop: {invoice.shop_name} • Uploaded by: {invoice.staff_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">₹{invoice.net_amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{invoice.total_items} items</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600 mt-2 pt-2 border-t border-yellow-200">
                      <span>Invoice Date: {new Date(invoice.invoice_date).toLocaleDateString()}</span>
                      <span className="text-orange-600 font-semibold">
                        Pending for {invoice.days_pending} day{invoice.days_pending !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">All Caught Up!</h3>
              <p className="text-gray-500">No invoices pending verification.</p>
            </div>
          )}
        </div>
      )}

      {/* AI Insights View */}
      {activeView === 'ai-insights' && (
        loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Generating AI Insights...</h3>
            <p className="text-sm text-gray-500">This may take up to 2 minutes</p>
          </div>
        ) : analytics ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          {analytics.data_summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600" />
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

          {/* AI Insights */}
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

          {/* Top Suppliers */}
          {analytics.data_summary?.suppliers?.top_suppliers && false && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Top Suppliers</h3>
              <div className="space-y-3">
                {analytics.data_summary.suppliers.top_suppliers.slice(0, 5).map((supplier, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{supplier.name}</p>
                      <p className="text-sm text-gray-600">{supplier.invoice_count} invoices</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">₹{supplier.total_spend.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{supplier.items_purchased} items</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        ) : null
      )}

      {/* Expiry Alerts View */}
      {activeView === 'expiry-alerts' && expiryAlerts && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-600 mb-1">Expired Items</p>
              <p className="text-2xl font-bold text-red-700">{expiryAlerts.summary.expired_count}</p>
              <p className="text-sm text-red-600 mt-1">₹{expiryAlerts.summary.expired_value.toLocaleString()}</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-sm text-orange-600 mb-1">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-700">{expiryAlerts.summary.expiring_soon_count}</p>
              <p className="text-sm text-orange-600 mt-1">₹{expiryAlerts.summary.expiring_value.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-600 mb-1">Total at Risk</p>
              <p className="text-2xl font-bold text-yellow-700">₹{expiryAlerts.summary.total_at_risk.toLocaleString()}</p>
            </div>
          </div>

          {/* Expired Items */}
          {expiryAlerts.expired.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-red-700 mb-4">Expired Items</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {expiryAlerts.expired.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="font-semibold text-gray-800">{item.product_name}</p>
                      <p className="text-sm text-gray-600">Batch: {item.batch_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-red-600 font-semibold">{item.expired_days_ago} days ago</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expiring Soon */}
          {expiryAlerts.expiring_soon.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-orange-700 mb-4">Expiring Soon</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {expiryAlerts.expiring_soon.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div>
                      <p className="font-semibold text-gray-800">{item.product_name}</p>
                      <p className="text-sm text-gray-600">Batch: {item.batch_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-orange-600 font-semibold">{item.days_to_expiry} days left</p>
                      <p className="text-xs text-gray-500">₹{item.value.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Suppliers View */}
      {activeView === 'suppliers' && supplierPerformance && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Supplier Performance ({supplierPerformance.total_suppliers} suppliers)
          </h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {supplierPerformance.suppliers.map((supplier, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-gray-800">{supplier.name}</p>
                    <p className="text-sm text-gray-600">{supplier.invoice_count} invoices</p>
                  </div>
                  <p className="text-xl font-bold text-green-600">₹{supplier.total_spend.toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Avg Invoice</p>
                    <p className="font-semibold">₹{supplier.avg_invoice_value.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Items</p>
                    <p className="font-semibold">{supplier.total_items}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">First Purchase</p>
                    <p className="font-semibold">{new Date(supplier.first_purchase).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Purchase</p>
                    <p className="font-semibold">{new Date(supplier.last_purchase).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAnalytics
