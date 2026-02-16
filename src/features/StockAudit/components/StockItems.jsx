import React, { useState, useEffect } from 'react'
import { stockAuditAPI } from '../services/stockAudit'
import { Plus, Edit, Trash2, Download } from 'lucide-react'

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

  const handleExport = async () => {
    try {
      const response = await stockAuditAPI.exportStockItems()
      const url = window.URL.createObjectURL(response.data)
      const a = document.createElement('a')
      a.href = url
      a.download = `stock_items_${Date.now()}.xlsx`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert('Failed to export stock items')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Stock Items</h2>
        <div className="flex gap-2">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            <Download className="w-4 h-4" />Export Excel
          </button>
          <button onClick={() => { setShowForm(!showForm); setEditingItem(null); setFormData({ item_name: '', generic_name: '', brand_name: '', batch_number: '', unit_price: '', expiry_date: '', manufacturer: '', section_id: '', quantity_software: '' }); }} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
            <Plus className="w-4 h-4" />Add Item
          </button>
        </div>
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
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-primary-50 to-primary-100 border-b-2 border-primary-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Item</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Generic/Brand</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Batch</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Manufacturer</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Rack</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Section</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Qty (S/P)</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Unit Price</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Expiry</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Discrepancy</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Last Audit</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item, idx) => (
              <tr key={item.id} className={`transition-colors hover:bg-primary-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="px-4 py-3 font-semibold text-gray-900">{item.item_name}</td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900">{item.generic_name}</div>
                  {item.brand_name && <div className="text-xs text-gray-500 mt-0.5">{item.brand_name}</div>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 font-mono">{item.batch_number}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.manufacturer || <span className="text-gray-400">-</span>}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {item.rack_name || '-'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {item.section_name || sections.find(s => s.id === item.section_id)?.section_name}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900">{item.quantity_software}</span>
                    {item.quantity_physical !== null && <span className="text-gray-500"> / {item.quantity_physical}</span>}
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-green-700">₹{item.unit_price}</td>
                <td className="px-4 py-3 text-sm">
                  {item.expiry_date ? (
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      new Date(item.expiry_date) < new Date() 
                        ? 'bg-red-100 text-red-800' 
                        : new Date(item.expiry_date) < new Date(Date.now() + 30*24*60*60*1000)
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {new Date(item.expiry_date).toLocaleDateString()}
                    </span>
                  ) : <span className="text-gray-400">N/A</span>}
                </td>
                <td className="px-4 py-3">
                  {item.audit_discrepancy !== 0 && item.audit_discrepancy !== null ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                      {item.audit_discrepancy > 0 ? '+' : ''}{item.audit_discrepancy}
                    </span>
                  ) : <span className="text-gray-400">-</span>}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {item.last_audit_date ? (
                    <div>
                      <div>{new Date(item.last_audit_date).toLocaleDateString()}</div>
                      <div className="text-gray-400">{new Date(item.last_audit_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </div>
                  ) : <span className="text-gray-400 italic">Never</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
