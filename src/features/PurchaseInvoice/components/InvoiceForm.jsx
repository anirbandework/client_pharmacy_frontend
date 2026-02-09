import React, { useState } from 'react'
import { invoiceAPI } from '../services/invoiceApi'
import { Plus, Trash2 } from 'lucide-react'

const InvoiceForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    invoice_number: '',
    invoice_date: new Date().toISOString().split('T')[0],
    received_date: new Date().toISOString().split('T')[0],
    supplier_name: '',
    items: []
  })
  const [loading, setLoading] = useState(false)

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { item_code: '', item_name: '', batch_number: '', purchased_quantity: '', unit_cost: '', selling_price: '', expiry_date: '' }]
    }))
  }

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const updateItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? { ...item, [field]: value } : item)
    }))  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...formData,
        items: formData.items.map(item => ({
          ...item,
          purchased_quantity: parseFloat(item.purchased_quantity),
          unit_cost: parseFloat(item.unit_cost),
          selling_price: parseFloat(item.selling_price)
        }))
      }
      await invoiceAPI.create(payload)
      alert('Invoice created successfully!')
      onSuccess?.()
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl shadow-soft border border-primary-100">
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Invoice Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Invoice Number</label>
            <input type="text" value={formData.invoice_number} onChange={(e) => setFormData(prev => ({ ...prev, invoice_number: e.target.value }))} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Supplier Name</label>
            <input type="text" value={formData.supplier_name} onChange={(e) => setFormData(prev => ({ ...prev, supplier_name: e.target.value }))} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Invoice Date</label>
            <input type="date" value={formData.invoice_date} onChange={(e) => setFormData(prev => ({ ...prev, invoice_date: e.target.value }))} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Received Date</label>
            <input type="date" value={formData.received_date} onChange={(e) => setFormData(prev => ({ ...prev, received_date: e.target.value }))} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all" />
          </div>
        </div>
      </div>

      <div className="pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">Items</h3>
          <button type="button" onClick={addItem} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all">
            <Plus className="w-3 h-3" /> Add Item
          </button>
        </div>
        <div className="space-y-3">
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <input type="text" placeholder="Item Code" value={item.item_code} onChange={(e) => updateItem(index, 'item_code', e.target.value)} required className="px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-primary-400" />
              <input type="text" placeholder="Item Name" value={item.item_name} onChange={(e) => updateItem(index, 'item_name', e.target.value)} required className="px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-primary-400" />
              <input type="text" placeholder="Batch" value={item.batch_number} onChange={(e) => updateItem(index, 'batch_number', e.target.value)} required className="px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-primary-400" />
              <input type="number" placeholder="Qty" value={item.purchased_quantity} onChange={(e) => updateItem(index, 'purchased_quantity', e.target.value)} required className="px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-primary-400" />
              <input type="number" step="0.01" placeholder="Cost" value={item.unit_cost} onChange={(e) => updateItem(index, 'unit_cost', e.target.value)} required className="px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-primary-400" />
              <input type="number" step="0.01" placeholder="Selling" value={item.selling_price} onChange={(e) => updateItem(index, 'selling_price', e.target.value)} required className="px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-primary-400" />
              <div className="flex gap-1">
                <input type="date" placeholder="Expiry" value={item.expiry_date} onChange={(e) => updateItem(index, 'expiry_date', e.target.value)} required className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-primary-400" />
                <button type="button" onClick={() => removeItem(index)} className="px-2 py-1.5 bg-red-500 text-white rounded hover:bg-red-600">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading || formData.items.length === 0} className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-semibold py-2.5 px-6 rounded-lg shadow-glow hover:shadow-glow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95">
        {loading ? 'Creating...' : 'Create Invoice'}
      </button>
    </form>
  )
}

export default InvoiceForm
