import { useState, useEffect } from 'react'
import { Loader2, AlertTriangle, Package } from 'lucide-react'
import { adminStockAuditAPI } from '../../services/admin_stock_audit_apis'

export default function Discrepancies({ selectedShop }) {
  const [dashboardData, setDashboardData] = useState(null)
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
      {loading ? (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading discrepancies...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <p className="text-red-800">{error}</p>
        </div>
      ) : dashboardData ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
              <p className="text-sm text-orange-600 mb-1 font-medium">Total Discrepancies</p>
              <p className="text-2xl font-bold text-orange-700">{dashboardData.discrepancy_analysis.total_discrepancies}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
              <p className="text-sm text-green-600 mb-1 font-medium">Excess Stock</p>
              <p className="text-2xl font-bold text-green-700">{dashboardData.discrepancy_analysis.positive_discrepancies}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
              <p className="text-sm text-red-600 mb-1 font-medium">Missing Stock</p>
              <p className="text-2xl font-bold text-red-700">{dashboardData.discrepancy_analysis.negative_discrepancies}</p>
            </div>
          </div>

          {dashboardData.discrepancy_analysis.discrepancy_list.length > 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Discrepancy Details
              </h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {dashboardData.discrepancy_analysis.discrepancy_list.map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border-2 hover:shadow-lg transition-all ${
                    item.discrepancy > 0 ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-800">{item.product_name}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Batch:</span> <span className="font-mono bg-white px-2 py-0.5 rounded">{item.batch_number}</span></p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${item.discrepancy > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.discrepancy > 0 ? '+' : ''}{item.discrepancy}
                        </p>
                        <p className="text-xs text-gray-500">₹{item.value_impact.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500 font-medium">Software Qty</p>
                        <p className="font-bold text-blue-700">{item.software_qty}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Physical Qty</p>
                        <p className="font-bold text-green-700">{item.physical_qty}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-12 text-center">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">No Discrepancies Found</h3>
              <p className="text-gray-500">All stock items match between software and physical counts.</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
