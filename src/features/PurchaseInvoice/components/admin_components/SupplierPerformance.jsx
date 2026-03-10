import React, { useState, useEffect } from 'react'
import { Package, Store } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminPurchaseInvoiceAPI } from '../../services/admin_purchase_invoice_apis'
import { adminApi } from '../../../Admin&SuperAdmin/services/admin&superAminApi'

const SupplierPerformance = () => {
  const [supplierPerformance, setSupplierPerformance] = useState(null)
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)

  useEffect(() => {
    fetchShops()
  }, [])

  useEffect(() => {
    if (shops.length > 0) {
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
    try {
      const params = selectedShop ? { shop_id: selectedShop } : {}
      const response = await adminPurchaseInvoiceAPI.getSupplierPerformance(params)
      setSupplierPerformance(response.data)
    } catch (error) {
      toast.error('Failed to fetch supplier performance')
    }
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

      {supplierPerformance && (
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

export default SupplierPerformance
