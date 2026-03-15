import { useState, useEffect } from 'react'
import { Store } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminPurchaseInvoiceAPI } from '../../services/admin_purchase_invoice_apis'
import { adminApi } from '../../../Admin&SuperAdmin/services/admin&superAminApi'

const SupplierPerformance = ({ apiService = adminPurchaseInvoiceAPI, showShopFilter = true }) => {
  const [supplierPerformance, setSupplierPerformance] = useState(null)
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (showShopFilter) {
      fetchShops()
    } else {
      fetchSupplierPerformance()
    }
  }, [])

  useEffect(() => {
    if (showShopFilter && shops.length > 0) {
      fetchSupplierPerformance()
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

  const fetchSupplierPerformance = async () => {
    setLoading(true)
    try {
      const params = selectedShop ? { shop_id: selectedShop } : {}
      const response = await apiService.getSupplierPerformance(params)
      setSupplierPerformance(response.data)
    } catch (error) {
      toast.error('Failed to fetch supplier performance')
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
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && supplierPerformance && (
        <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            Supplier Performance ({supplierPerformance.total_suppliers} suppliers)
          </h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {supplierPerformance.suppliers.map((supplier, idx) => (
              <div key={idx} className="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg border border-gray-200 dark:border-slate-600/50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white">{supplier.name}</p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{supplier.invoice_count} invoices</p>
                  </div>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">₹{supplier.total_spend.toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-slate-500">Avg Invoice</p>
                    <p className="font-semibold dark:text-slate-200">₹{supplier.avg_invoice_value.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-slate-500">Total Items</p>
                    <p className="font-semibold dark:text-slate-200">{supplier.total_items}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-slate-500">First Purchase</p>
                    <p className="font-semibold dark:text-slate-200">{new Date(supplier.first_purchase).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-slate-500">Last Purchase</p>
                    <p className="font-semibold dark:text-slate-200">{new Date(supplier.last_purchase).toLocaleDateString()}</p>
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

export default SupplierPerformance
