import { useState, useEffect } from 'react'
import { Store } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminPurchaseInvoiceAPI } from '../../services/admin_purchase_invoice_apis'
import { adminApi } from '../../../Admin&SuperAdmin/services/admin&superAminApi'

const ExpiryAlerts = ({ apiService = adminPurchaseInvoiceAPI, showShopFilter = true }) => {
  const [expiryAlerts, setExpiryAlerts] = useState(null)
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (showShopFilter) {
      fetchShops()
    } else {
      fetchExpiryAlerts()
    }
  }, [])

  useEffect(() => {
    if (showShopFilter && shops.length > 0) {
      fetchExpiryAlerts()
    }
  }, [selectedShop, shops])

  const fetchShops = async () => {
    try {
      const response = await adminApi.getShops()
      setShops(response)
    } catch (error) {
      toast.error('Failed to fetch shops')
    }
  }

  const fetchExpiryAlerts = async () => {
    setLoading(true)
    try {
      const params = selectedShop ? { shop_id: selectedShop } : {}
      const response = await apiService.getExpiryAlerts(params)
      setExpiryAlerts(response.data)
    } catch (error) {
      toast.error('Failed to fetch expiry alerts')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {showShopFilter && (
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
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && expiryAlerts && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-4">
              <p className="text-sm text-red-600 dark:text-red-400 mb-1">Expired Items</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">{expiryAlerts.summary.expired_count}</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">₹{expiryAlerts.summary.expired_value.toLocaleString()}</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/40 rounded-xl p-4">
              <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{expiryAlerts.summary.expiring_soon_count}</p>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">₹{expiryAlerts.summary.expiring_value.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/40 rounded-xl p-4">
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">Total at Risk</p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">₹{expiryAlerts.summary.total_at_risk.toLocaleString()}</p>
            </div>
          </div>

          {expiryAlerts.expired.length > 0 && (
            <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 p-6">
              <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-4">Expired Items</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {expiryAlerts.expired.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/40">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{item.product_name}</p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Batch: {item.batch_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-red-600 dark:text-red-400 font-semibold">{item.expired_days_ago} days ago</p>
                      <p className="text-xs text-gray-500 dark:text-slate-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {expiryAlerts.expiring_soon.length > 0 && (
            <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 p-6">
              <h3 className="text-lg font-bold text-orange-700 dark:text-orange-400 mb-4">Expiring Soon</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {expiryAlerts.expiring_soon.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800/40">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{item.product_name}</p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">Batch: {item.batch_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold">{item.days_to_expiry} days left</p>
                      <p className="text-xs text-gray-500 dark:text-slate-500">₹{item.value.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ExpiryAlerts
