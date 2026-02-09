import React, { useState } from 'react'
import { invoiceAPI } from '../services/invoiceApi'
import { ShoppingCart } from 'lucide-react'

const RecordSale = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    item_id: '',
    quantity_sold: '',
    sale_price: '',
    customer_type: 'retail'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...formData,
        item_id: parseInt(formData.item_id),
        quantity_sold: parseFloat(formData.quantity_sold),
        sale_price: parseFloat(formData.sale_price)
      }
      await invoiceAPI.recordSale(payload)
      alert('Sale recorded successfully!')
      setFormData({ item_id: '', quantity_sold: '', sale_price: '', customer_type: 'retail' })
      onSuccess?.()
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl shadow-lg p-4 md:p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold">Record Sale</h3>
            <p className="text-xs text-white/80">Update inventory on item sale</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-soft border border-primary-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Item ID</label>
            <input type="number" value={formData.item_id} onChange={(e) => setFormData(prev => ({ ...prev, item_id: e.target.value }))} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Quantity Sold</label>
            <input type="number" step="0.01" value={formData.quantity_sold} onChange={(e) => setFormData(prev => ({ ...prev, quantity_sold: e.target.value }))} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Sale Price</label>
            <input type="number" step="0.01" value={formData.sale_price} onChange={(e) => setFormData(prev => ({ ...prev, sale_price: e.target.value }))} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Customer Type</label>
            <select value={formData.customer_type} onChange={(e) => setFormData(prev => ({ ...prev, customer_type: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all">
              <option value="retail">Retail</option>
              <option value="wholesale">Wholesale</option>
              <option value="online">Online</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white text-sm font-semibold py-2.5 px-6 rounded-lg shadow-glow hover:shadow-glow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95">
          {loading ? 'Recording...' : 'Record Sale'}
        </button>
      </form>
    </div>
  )
}

export default RecordSale
