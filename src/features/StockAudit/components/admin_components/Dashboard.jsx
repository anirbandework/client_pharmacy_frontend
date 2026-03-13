import { Package, AlertTriangle, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Loader2, Store } from 'lucide-react'
import toast from 'react-hot-toast'
import AIInsights from './AIInsights'
import { adminStockAuditAPI } from '../../services/admin_stock_audit_apis'
import { adminApi } from '../../../Admin&SuperAdmin/services/admin&superAminApi'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)

  useEffect(() => {
    fetchShops()
    fetchDashboard()
  }, [])

  useEffect(() => {
    if (selectedShop !== null) {
      fetchDashboard()
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
      <div className="bg-white rounded-xl shadow-md p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
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
      {/* Shop Filter */}
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

      <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Total Items</p>
            <Package className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{stock_overview.total_items}</div>
          <p className="text-xs text-gray-500">Software: {stock_overview.total_quantity_software} | Physical: {stock_overview.total_quantity_physical}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Discrepancies</p>
            <AlertTriangle className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{discrepancy_analysis.total_discrepancies}</div>
          <p className="text-xs text-gray-500">Value Impact: ₹{discrepancy_analysis.total_value_impact.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Audit Rate</p>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{stock_overview.audit_completion_rate}%</div>
          <p className="text-xs text-gray-500">Audited: {stock_overview.audited_items}/{stock_overview.total_items}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Expired Items</p>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600">{expiry_analysis.expired}</div>
          <p className="text-xs text-gray-500">Expiring 0-30d: {expiry_analysis.expiring_0_30}</p>
        </div>
      </div>

      <AIInsights 
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
