import React, { useState, useEffect } from 'react'
import { invoiceAPI } from '../services/invoiceApi'
import { Clock, Package } from 'lucide-react'

const ExpiringItems = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(45)

  useEffect(() => {
    fetchItems()
  }, [days])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const response = await invoiceAPI.getExpiringItems(days)
      setItems(typeof response.data === 'string' ? [] : response.data)
    } catch (error) {
      console.error('Error fetching expiring items:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl shadow-lg p-4 md:p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <Clock className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold">Expiring Items</h3>
              <p className="text-xs text-white/80">Items expiring within {days} days</p>
            </div>
          </div>
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="px-3 py-1.5 text-xs md:text-sm bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white font-medium">
            <option value={15} className="text-gray-900">15 Days</option>
            <option value={30} className="text-gray-900">30 Days</option>
            <option value={45} className="text-gray-900">45 Days</option>
            <option value={60} className="text-gray-900">60 Days</option>
            <option value={90} className="text-gray-900">90 Days</option>
          </select>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-12 text-center">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <div className="text-lg font-semibold text-gray-600">No expiring items</div>
          <div className="text-sm text-gray-500">No items expiring within {days} days</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {items.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-soft border border-orange-200 p-4 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">{item.item_name || 'Unknown Item'}</div>
                    <div className="text-xs text-gray-600">Code: {item.item_code || 'N/A'}</div>
                    <div className="text-xs text-gray-500 mt-1">Batch: {item.batch_number || 'N/A'} • Qty: {item.remaining_quantity || 0}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-orange-600">{item.days_to_expiry || 0}</div>
                  <div className="text-xs text-gray-500 uppercase">Days Left</div>
                  <div className="text-[10px] text-gray-400 mt-1">{item.expiry_date ? new Date(item.expiry_date).toLocaleDateString('en-IN') : 'N/A'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExpiringItems
