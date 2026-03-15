import { Package, AlertTriangle, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import AIInsightsCharts from './AIInsightsCharts'
import { adminStockAuditAPI } from '../../services/admin_stock_audit_apis'

export default function Dashboard({ selectedShop }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboard()
  }, [selectedShop])

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = selectedShop ? { shop_id: selectedShop } : {}
      const { data: responseData } = await adminStockAuditAPI.getAdminDashboard(params)
      setData(responseData)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800/40 rounded-xl p-4">
        <p className="text-red-800 dark:text-red-400">{error}</p>
      </div>
    )
  }

  if (!data) return null

  const stock_overview = {
    total_items: data.stock_overview?.total_items || 0,
    total_quantity_software: data.stock_overview?.total_software_quantity || 0,
    total_quantity_physical: data.stock_overview?.total_physical_quantity || 0,
    audit_completion_rate: data.stock_overview?.audit_completion_rate || 0,
    audited_items: data.stock_overview?.items_audited || 0
  }

  const discrepancy_analysis = data.discrepancy_analysis || { total_discrepancies: 0, total_value_impact: 0 }

  const expiry_analysis = {
    expired: data.expiry_analysis?.categories?.find(c => c.name === 'Expired')?.count || 0,
    expiring_0_30: data.expiry_analysis?.categories?.find(c => c.name === '0-30 Days')?.count || 0
  }

  return (
    <div className="space-y-4">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Total Items</p>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">{stock_overview.total_items}</div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Software: {stock_overview.total_quantity_software} | Physical: {stock_overview.total_quantity_physical}</p>
          </div>

          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Discrepancies</p>
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-orange-600">{discrepancy_analysis.total_discrepancies}</div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Value Impact: ₹{(discrepancy_analysis.total_value_impact || 0).toFixed(2)}</p>
          </div>

          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Audit Rate</p>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600">{stock_overview.audit_completion_rate}%</div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Audited: {stock_overview.audited_items}/{stock_overview.total_items}</p>
          </div>

          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Expired Items</p>
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-red-600">{expiry_analysis.expired}</div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Expiring 0-30d: {expiry_analysis.expiring_0_30}</p>
          </div>
        </div>

        <AIInsightsCharts
          discrepancyData={data.discrepancy_analysis}
          expiryData={data.expiry_analysis}
          valueData={data.stock_value_analysis}
          auditData={data.audit_performance}
          movementData={data.stock_movement}
          adjustmentData={data.adjustment_analysis}
        />
      </div>
    </div>
  )
}
