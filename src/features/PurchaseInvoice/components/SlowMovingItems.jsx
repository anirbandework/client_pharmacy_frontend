import React, { useState, useEffect } from 'react'
import { invoiceAPI } from '../services/invoiceApi'
import { TrendingDown, Package } from 'lucide-react'

const SlowMovingItems = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const response = await invoiceAPI.getSlowMovingItems()
      setItems(response.data)
    } catch (error) {
      console.error('Error fetching slow moving items:', error)
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
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl shadow-lg p-4 md:p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
            <TrendingDown className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold">Slow Moving Items</h3>
            <p className="text-xs text-white/80">Items with low sales velocity</p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-12 text-center">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <div className="text-lg font-semibold text-gray-600">No slow moving items</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {items.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-soft border border-orange-200 p-4 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Package className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">{item.item_name}</div>
                    <div className="text-xs text-gray-600">Code: {item.item_code}</div>
                    <div className="text-xs text-gray-500 mt-1">Stock: {item.current_stock} • Days in stock: {item.days_in_stock}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-orange-600">{(item.sold_percentage || 0).toFixed(1)}%</div>
                  <div className="text-xs text-gray-500 uppercase">Sold</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SlowMovingItems
