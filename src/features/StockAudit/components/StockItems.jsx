import React, { useState, useEffect } from 'react'
import { stockAuditAPI } from '../services/stockAudit'
import { Plus, Edit, Trash2 } from 'lucide-react'

const StockItems = () => {
  const [items, setItems] = useState([])
  const [sections, setSections] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({ 
    item_name: '', 
    generic_name: '', 
    brand_name: '', 
    batch_number: '', 
    unit_price: '', 
    expiry_date: '', 
    manufacturer: '', 
    section_id: '', 
    quantity_software: '' 
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [itemsRes, sectionsRes] = await Promise.all([stockAuditAPI.getItems(), stockAuditAPI.getSections()])
      setItems(itemsRes.data)
      setSections(sectionsRes.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await stockAuditAPI.updateItem(editingItem.id, formData)
      } else {
        await stockAuditAPI.addItem(formData)
      }
      setFormData({ item_name: '', generic_name: '', brand_name: '', batch_number: '', unit_price: '', expiry_date: '', manufacturer: '', section_id: '', quantity_software: '' })
      setShowForm(false)
      setEditingItem(null)
      fetchData()
    } catch (error) {
      console.error('Failed to save item:', error)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      item_name: item.item_name,
      generic_name: item.generic_name,
      brand_name: item.brand_name,
      batch_number: item.batch_number,
      unit_price: item.unit_price,
      expiry_date: item.expiry_date,
      manufacturer: item.manufacturer,
      section_id: item.section_id,
      quantity_software: item.quantity_software
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return
    try {
      await stockAuditAPI.deleteItem(id)
      fetchData()
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to delete item')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Stock Items</h2>
        <button onClick={() => { setShowForm(!showForm); setEditingItem(null); setFormData({ item_name: '', generic_name: '', brand_name: '', batch_number: '', unit_price: '', expiry_date: '', manufacturer: '', section_id: '', quantity_software: '' }); }} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
          <Plus className="w-4 h-4" />Add Item
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Item Name" value={formData.item_name} onChange={(e) => setFormData({ ...formData, item_name: e.target.value })} className="px-3 py-2 border rounded" required />
            <input type="text" placeholder="Generic Name" value={formData.generic_name} onChange={(e) => setFormData({ ...formData, generic_name: e.target.value })} className="px-3 py-2 border rounded" />
            <input type="text" placeholder="Brand Name" value={formData.brand_name} onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })} className="px-3 py-2 border rounded" />
            <input type="text" placeholder="Batch Number" value={formData.batch_number} onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })} className="px-3 py-2 border rounded" required />
            <input type="number" step="0.01" placeholder="Unit Price" value={formData.unit_price} onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })} className="px-3 py-2 border rounded" required />
            <input type="date" placeholder="Expiry Date" value={formData.expiry_date} onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })} className="px-3 py-2 border rounded" />
            <input type="text" placeholder="Manufacturer" value={formData.manufacturer} onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })} className="px-3 py-2 border rounded" />
            <select value={formData.section_id} onChange={(e) => setFormData({ ...formData, section_id: e.target.value })} className="px-3 py-2 border rounded" required>
              <option value="">Select Section</option>
              {sections.map((section) => (<option key={section.id} value={section.id}>{section.section_name}</option>))}
            </select>
            <input type="number" placeholder="Quantity" value={formData.quantity_software} onChange={(e) => setFormData({ ...formData, quantity_software: e.target.value })} className="px-3 py-2 border rounded" required />
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{editingItem ? 'Update' : 'Save'}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditingItem(null); }} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          </div>
        </form>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Item</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Generic</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Batch</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Section</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Qty</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Expiry</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{item.item_name}</td>
                <td className="px-4 py-3">{item.generic_name}</td>
                <td className="px-4 py-3">{item.batch_number}</td>
                <td className="px-4 py-3">{sections.find(s => s.id === item.section_id)?.section_name}</td>
                <td className="px-4 py-3">{item.quantity_software}</td>
                <td className="px-4 py-3">₹{item.unit_price}</td>
                <td className="px-4 py-3">{item.expiry_date || 'N/A'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StockItems
