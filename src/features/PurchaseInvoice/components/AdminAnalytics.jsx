import React, { useState, useEffect } from 'react'
import { Brain, TrendingUp, AlertTriangle, Package, DollarSign, Calendar, Loader2, RefreshCw, Store, BarChart3, Clock, Calculator, CheckCircle, XCircle, Eye, Edit, FileText, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import { purchaseInvoiceAPI } from '../services/api'
import { adminApi } from '../../Admin&SuperAdmin/services/admin&superAminApi'
import DashboardCharts from './DashboardCharts'
import MarginPlayground from './MarginPlayground'
import InvoiceModal from './InvoiceModal'
import EditInvoice from './EditInvoice'

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(false)
  const [analytics, setAnalytics] = useState(null)
  const [expiryAlerts, setExpiryAlerts] = useState(null)
  const [supplierPerformance, setSupplierPerformance] = useState(null)
  const [dashboardData, setDashboardData] = useState(null)
  const [pendingInvoices, setPendingInvoices] = useState(null)
  const [staffPendingInvoices, setStaffPendingInvoices] = useState(null)
  const [approvedInvoices, setApprovedInvoices] = useState(null)
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
      const response = await purchaseInvoiceAPI.getPendingAdminVerification(params)
      setPendingInvoices(response.data)
      
      // Also fetch staff pending invoices
      const staffResponse = await purchaseInvoiceAPI.getPendingStaffVerification(params)
      setStaffPendingInvoices(staffResponse.data)
      
      // Fetch approved invoices
      const approvedResponse = await purchaseInvoiceAPI.getAdminInvoices({ ...params, limit: 50 })
      const approved = approvedResponse.data.filter(inv => inv.is_admin_verified)
      setApprovedInvoices(approved)
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
            onClick={() => setActiveView('margins')}
            className="px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-50"
          >
            <Calculator className="w-4 h-4" />
            Margin Playground
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
          onClick={() => setActiveView('margins')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 ${
            activeView === 'margins'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Calculator className="w-4 h-4" />
          Margin Playground
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
      {activeView !== 'pending' && activeView !== 'margins' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-600" />
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> All analytics are based on verified invoices only.
          </p>
        </div>
      )}

      {/* Dashboard View */}
      {activeView === 'dashboard' && <DashboardCharts data={dashboardData} />}

      {/* Margin Analysis View */}
      {activeView === 'margins' && <MarginPlayground selectedShop={selectedShop} />}

      {/* Pending Verification View */}
      {activeView === 'pending' && pendingInvoices && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-600 mb-1">Awaiting Admin Approval</p>
              <p className="text-2xl font-bold text-yellow-700">{pendingInvoices.total_pending}</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-sm text-orange-600 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-orange-700">₹{pendingInvoices.total_value.toLocaleString()}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-600 mb-1">Staff Verification Pending</p>
              <p className="text-2xl font-bold text-blue-700">{staffPendingInvoices?.total_pending || 0}</p>
            </div>
          </div>

          {/* Pending Invoices List */}
          {pendingInvoices.invoices.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Invoices Awaiting Admin Verification</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {pendingInvoices.invoices.map((invoice) => (
                  <PendingInvoiceCard key={invoice.id} invoice={invoice} onAction={fetchPendingInvoices} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">All Caught Up!</h3>
              <p className="text-gray-500">No invoices pending admin verification.</p>
            </div>
          )}

          {/* Staff Pending Invoices List */}
          {staffPendingInvoices?.invoices?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Invoices Awaiting Staff Verification</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {staffPendingInvoices.invoices.map((invoice) => (
                  <StaffPendingInvoiceCard key={invoice.id} invoice={invoice} />
                ))}
              </div>
            </div>
          )}

          {/* Approved Invoices List */}
          {approvedInvoices?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Approved Invoices ({approvedInvoices.length})
              </h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {approvedInvoices.map((invoice) => (
                  <ApprovedInvoiceCard key={invoice.id} invoice={invoice} onDelete={fetchPendingInvoices} />
                ))}
              </div>
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

const PendingInvoiceCard = ({ invoice, onAction }) => {
  const [processing, setProcessing] = useState(false)
  const [viewing, setViewing] = useState(false)
  const [editing, setEditing] = useState(false)
  const [invoiceDetails, setInvoiceDetails] = useState(null)
  const [showRejectConfirm, setShowRejectConfirm] = useState(false)

  const handleApprove = async () => {
    setProcessing(true)
    try {
      await purchaseInvoiceAPI.adminVerifyInvoice(invoice.id)
      toast.success('Invoice approved and synced to stock!')
      onAction()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to approve invoice')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    setProcessing(true)
    try {
      await purchaseInvoiceAPI.adminRejectInvoice(invoice.id)
      toast.success('Invoice rejected and sent back to staff')
      onAction()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to reject invoice')
    } finally {
      setProcessing(false)
      setShowRejectConfirm(false)
    }
  }

  const handleView = async () => {
    try {
      const response = await purchaseInvoiceAPI.getInvoice(invoice.id)
      setInvoiceDetails(response.data)
      setViewing(true)
    } catch (error) {
      toast.error('Failed to fetch invoice details')
    }
  }

  const handleEdit = async () => {
    try {
      const response = await purchaseInvoiceAPI.getInvoice(invoice.id)
      setInvoiceDetails(response.data)
      setEditing(true)
    } catch (error) {
      toast.error('Failed to fetch invoice details')
    }
  }

  return (
    <>
      <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200 hover:shadow-md transition-all">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-bold text-gray-800">{invoice.invoice_number}</p>
              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-semibold">
                Awaiting Admin Approval
              </span>
            </div>
            <p className="text-sm text-gray-700 font-medium">{invoice.supplier_name}</p>
            <p className="text-xs text-gray-500 mt-1">
              Shop: {invoice.shop_name}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Uploaded by: {invoice.staff_name}
            </p>
            {invoice.staff_verified_by_name && (
              <p className="text-xs text-green-600">
                Verified by: {invoice.staff_verified_by_name}
              </p>
            )}
          </div>
          <div className="text-right ml-4">
            <p className="text-lg font-bold text-green-600">₹{invoice.net_amount.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{invoice.total_items} items</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600 mt-2 pt-2 border-t border-orange-200">
          <span>Invoice Date: {new Date(invoice.invoice_date).toLocaleDateString()}</span>
          <span className="text-orange-600 font-semibold">
            Pending {invoice.days_pending} day{invoice.days_pending !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleEdit}
            className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={handleView}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={handleApprove}
            disabled={processing}
            className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            <CheckCircle className="w-4 h-4" />
            {processing ? 'Processing...' : 'Approve'}
          </button>
          <button
            onClick={() => setShowRejectConfirm(true)}
            disabled={processing}
            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
        </div>
      </div>

      {viewing && invoiceDetails && (
        <InvoiceModal invoice={invoiceDetails} onClose={() => setViewing(false)} />
      )}

      {editing && invoiceDetails && (
        <EditInvoice
          invoice={invoiceDetails}
          onClose={() => setEditing(false)}
          onSave={() => {
            setEditing(false)
            onAction()
          }}
          isAdmin={true}
        />
      )}

      {showRejectConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Reject Invoice?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              This invoice will be sent back to staff for corrections.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectConfirm(false)}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {processing ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const StaffPendingInvoiceCard = ({ invoice }) => {
  return (
    <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-bold text-gray-800">{invoice.invoice_number}</p>
            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-semibold">
              Awaiting Staff Verification
            </span>
          </div>
          <p className="text-sm text-gray-700 font-medium">{invoice.supplier_name}</p>
          <p className="text-xs text-gray-500 mt-1">
            Shop: {invoice.shop_name} • Uploaded by: {invoice.staff_name}
          </p>
        </div>
        <div className="text-right ml-4">
          <p className="text-lg font-bold text-green-600">₹{invoice.net_amount.toLocaleString()}</p>
          <p className="text-xs text-gray-500">{invoice.total_items} items</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-600 mt-2 pt-2 border-t border-blue-200">
        <span>Invoice Date: {new Date(invoice.invoice_date).toLocaleDateString()}</span>
        <span className="text-blue-600 font-semibold">
          Uploaded {invoice.days_pending} day{invoice.days_pending !== 1 ? 's' : ''} ago
        </span>
      </div>
    </div>
  )
}

const ApprovedInvoiceCard = ({ invoice, onDelete }) => {
  const [viewing, setViewing] = useState(false)
  const [editing, setEditing] = useState(false)
  const [invoiceDetails, setInvoiceDetails] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const handleView = async () => {
    try {
      const response = await purchaseInvoiceAPI.getInvoice(invoice.id)
      setInvoiceDetails(response.data)
      setViewing(true)
    } catch (error) {
      toast.error('Failed to fetch invoice details')
    }
  }

  const handleEdit = async () => {
    try {
      const response = await purchaseInvoiceAPI.getInvoice(invoice.id)
      setInvoiceDetails(response.data)
      setEditing(true)
    } catch (error) {
      toast.error('Failed to fetch invoice details')
    }
  }

  const handleDelete = async () => {
    const confirmMessage = invoice.is_admin_verified
      ? `⚠️ WARNING: This invoice is VERIFIED and synced to stock!\n\nDeleting will:\n• Remove ${invoice.total_items} items from stock\n• Reverse quantities in inventory\n• Cannot be undone\n\nAre you absolutely sure?`
      : 'Are you sure you want to delete this invoice?'
    
    if (!confirm(confirmMessage)) return
    
    setDeleting(true)
    try {
      await purchaseInvoiceAPI.adminDeleteInvoice(invoice.id)
      toast.success('Invoice deleted successfully')
      if (onDelete) onDelete()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete invoice')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 hover:shadow-xl transition-all">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
              <FileText className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
              <h3 className="font-bold text-base md:text-lg text-gray-800">{invoice.invoice_number}</h3>
              <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" />
                Admin Verified
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 text-xs md:text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                {new Date(invoice.invoice_date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Package className="w-3 h-3 md:w-4 md:h-4" />
                {invoice.total_items} items
              </div>
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
                ₹{invoice.net_amount.toFixed(2)}
              </div>
              <div className="text-gray-700 font-medium">
                {invoice.supplier_name}
              </div>
            </div>
            <div className="mt-2 text-[10px] md:text-xs text-gray-500">
              Uploaded by: {invoice.staff_name}
              {invoice.staff_verified_by_name && (
                <span className="ml-2 md:ml-3 text-green-600">
                  • Verified by: {invoice.staff_verified_by_name}
                </span>
              )}
              {invoice.admin_verified_by_name && (
                <span className="ml-2 md:ml-3 text-blue-600">
                  • Approved by: {invoice.admin_verified_by_name}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={handleView}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Delete"
            >
              <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>

      {viewing && invoiceDetails && (
        <InvoiceModal invoice={invoiceDetails} onClose={() => setViewing(false)} />
      )}

      {editing && invoiceDetails && (
        <EditInvoice
          invoice={invoiceDetails}
          onClose={() => setEditing(false)}
          onSave={() => {
            setEditing(false)
            if (onDelete) onDelete()
          }}
          isAdmin={true}
        />
      )}
    </>
  )
}

export default AdminAnalytics