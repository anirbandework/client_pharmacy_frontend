import { useState, useEffect } from 'react'
import { Loader2, Info, Store, AlertTriangle, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminStockAuditAPI } from '../../services/admin_stock_audit_apis'
import { adminApi } from '../../../Admin&SuperAdmin/services/admin&superAminApi'

export default function Discrepancies() {
  const [dashboardData, setDashboardData] = useState(null)
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
      const { data } = await adminStockAuditAPI.getAdminDashboard(params)
      setDashboardData(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load discrepancies')
    } finally {
      setLoading(false)
    }
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

      {loading ? (
        <div className="bg-white rounded-xl shadow-md p-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      ) : dashboardData ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-sm text-orange-600 mb-1">Total Discrepancies</p>
              <p className="text-2xl font-bold text-orange-700">{dashboardData.discrepancy_analysis.total_discrepancies}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-600 mb-1">Excess Stock</p>
              <p className="text-2xl font-bold text-green-700">{dashboardData.discrepancy_analysis.positive_discrepancies}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-600 mb-1">Missing Stock</p>
              <p className="text-2xl font-bold text-red-700">{dashboardData.discrepancy_analysis.negative_discrepancies}</p>
            </div>
          </div>

          {dashboardData.discrepancy_analysis.discrepancy_list.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Discrepancy Details</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {dashboardData.discrepancy_analysis.discrepancy_list.map((item, idx) => (
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
      ) : null}
    </div>
  )
}
