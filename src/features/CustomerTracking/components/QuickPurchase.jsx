import React, { useState } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { Search, Plus, Trash2, ShoppingCart } from 'lucide-react'

const QuickPurchase = () => {
  const [phone, setPhone] = useState('')
  const [customer, setCustomer] = useState(null)
  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'Male', address: '',
    chronic_conditions: '', allergies: '',
    category: 'first_time_prescription'
  })
  const [items, setItems] = useState([{
    medicine_name: '', brand_name: '', generic_name: '',
    quantity: 1, unit_price: 0, is_generic: false,
    is_prescription: true, duration_days: 0
  }])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const searchCustomer = async () => {
    if (!phone) return
    try {
      const { data } = await customerTrackingAPI.getCustomerByPhone(phone)
      setCustomer(data)
      setFormData({ ...formData, name: data.name, age: data.age, gender: data.gender })
    } catch (error) {
      setCustomer(null)
    }
  }

  const addItem = () => {
    setItems([...items, {
      medicine_name: '', brand_name: '', generic_name: '',
      quantity: 1, unit_price: 0, is_generic: false,
      is_prescription: true, duration_days: 0
    }])
  }

  const removeItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx))
  }

  const updateItem = (idx, field, value) => {
    const updated = [...items]
    updated[idx][field] = value
    if (field === 'quantity' || field === 'unit_price') {
      updated[idx].total_amount = updated[idx].quantity * updated[idx].unit_price
    }
    setItems(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        phone,
        ...formData,
        items: items.map(item => ({ ...item, total_amount: item.quantity * item.unit_price }))
      }
      const { data } = await customerTrackingAPI.quickPurchase(payload)
      setMessage({ type: 'success', text: data.message })
      // Reset form
      setPhone('')
      setCustomer(null)
      setFormData({ name: '', age: '', gender: 'Male', address: '', chronic_conditions: '', allergies: '', category: 'first_time_prescription' })
      setItems([{ medicine_name: '', brand_name: '', generic_name: '', quantity: 1, unit_price: 0, is_generic: false, is_prescription: true, duration_days: 0 }])
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to record purchase' })
    } finally {
      setLoading(false)
    }
  }

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Quick Purchase Entry</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="tel"
          placeholder="Customer Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <button onClick={searchCustomer} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
          <Search className="w-4 h-4" /> Search
        </button>
      </div>

      {customer && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="font-semibold">Existing Customer: {customer.name}</p>
          <p className="text-sm text-gray-600">Total Visits: {customer.total_visits || 0}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="px-3 py-2 border rounded" required />
          <input type="number" placeholder="Age" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="px-3 py-2 border rounded" />
          <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="px-3 py-2 border rounded">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <input type="text" placeholder="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-3 py-2 border rounded" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input type="text" placeholder="Chronic Conditions" value={formData.chronic_conditions} onChange={(e) => setFormData({ ...formData, chronic_conditions: e.target.value })} className="px-3 py-2 border rounded" />
          <input type="text" placeholder="Allergies" value={formData.allergies} onChange={(e) => setFormData({ ...formData, allergies: e.target.value })} className="px-3 py-2 border rounded" />
        </div>

        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border rounded">
          <option value="first_time_prescription">First Time Prescription</option>
          <option value="regular_branded">Regular Branded</option>
          <option value="generic_informed">Generic Informed</option>
          <option value="contact_sheet">Contact Sheet</option>
        </select>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Items</h3>
            <button type="button" onClick={addItem} className="px-3 py-1 bg-green-600 text-white rounded text-sm flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-2 p-3 bg-gray-50 rounded">
              <input type="text" placeholder="Medicine" value={item.medicine_name} onChange={(e) => updateItem(idx, 'medicine_name', e.target.value)} className="px-2 py-1 border rounded text-sm" required />
              <input type="text" placeholder="Brand" value={item.brand_name} onChange={(e) => updateItem(idx, 'brand_name', e.target.value)} className="px-2 py-1 border rounded text-sm" />
              <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))} className="px-2 py-1 border rounded text-sm" required />
              <input type="number" placeholder="Price" value={item.unit_price} onChange={(e) => updateItem(idx, 'unit_price', Number(e.target.value))} className="px-2 py-1 border rounded text-sm" required />
              <input type="number" placeholder="Days" value={item.duration_days} onChange={(e) => updateItem(idx, 'duration_days', Number(e.target.value))} className="px-2 py-1 border rounded text-sm" />
              <label className="flex items-center gap-1 text-sm">
                <input type="checkbox" checked={item.is_generic} onChange={(e) => updateItem(idx, 'is_generic', e.target.checked)} />
                Generic
              </label>
              <button type="button" onClick={() => removeItem(idx)} className="text-red-600 hover:text-red-800">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-xl font-bold">Total: ₹{totalAmount.toFixed(2)}</div>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            {loading ? 'Processing...' : 'Record Purchase'}
          </button>
        </div>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}
    </div>
  )
}

export default QuickPurchase
