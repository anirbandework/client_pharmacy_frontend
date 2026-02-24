import React, { useState, useEffect } from 'react'
import { stockAuditAPI } from '../services/stockAudit'
import { Plus, Edit, Trash2, Download, Package, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const StockItems = () => {
  const [items, setItems] = useState([])
  const [unassignedItems, setUnassignedItems] = useState([])
  const [sections, setSections] = useState([])
  const [racks, setRacks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [activeTab, setActiveTab] = useState('all') // 'all' or 'unassigned'
  const [formData, setFormData] = useState({ 
    manufacturer: '',
    hsn_code: '',
    product_name: '', 
    batch_number: '', 
    package: '',
    expiry_date: '', 
    mrp: '',
    unit_price: '', 
    section_id: '', 
    quantity_software: '' 
  })

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    try {
      const [sectionsRes, racksRes] = await Promise.all([
        stockAuditAPI.getSections(),
        stockAuditAPI.getRacks()
      ])
      setSections(sectionsRes.data)
      setRacks(racksRes.data)

      if (activeTab === 'all') {
        const itemsRes = await stockAuditAPI.getItems()
        setItems(itemsRes.data)
      } else {
        const unassignedRes = await stockAuditAPI.getUnassignedItems()
        setUnassignedItems(unassignedRes.data)
      }
    } catch (error) {
      toast.error('Failed to fetch data')
      console.error(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const submitData = {
        ...formData,
        section_id: formData.section_id || null,
        quantity_software: parseInt(formData.quantity_software) || 0,
        unit_price: parseFloat(formData.unit_price) || null
      }

      if (editingItem) {
        await stockAuditAPI.updateItem(editingItem.id, submitData)
        toast.success('Item updated successfully')
      } else {
        await stockAuditAPI.addItem(submitData)
        toast.success('Item added successfully')
      }
      
      resetForm()
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save item')
    }
  }

  const resetForm = () => {
    setFormData({ 
      manufacturer: '',
      hsn_code: '',
      product_name: '', 
      batch_number: '', 
      package: '',
      expiry_date: '', 
      mrp: '',
      unit_price: '', 
      section_id: '', 
      quantity_software: '' 
    })
    setShowForm(false)
    setEditingItem(null)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      manufacturer: item.manufacturer || '',
      hsn_code: item.hsn_code || '',
      product_name: item.product_name,
      batch_number: item.batch_number,
      package: item.package || '',
      expiry_date: item.expiry_date || '',
      mrp: item.mrp || '',
      unit_price: item.unit_price || '',
      section_id: item.section_id || '',
      quantity_software: item.quantity_software
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return
    try {
      await stockAuditAPI.deleteItem(id)
      toast.success('Item deleted')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete item')
    }
  }

  const handleAssignSection = async (itemId, sectionId) => {
    try {
      await stockAuditAPI.assignSection(itemId, sectionId)
      toast.success('Section assigned successfully')
      fetchData()
    } catch (error) {
      toast.error('Failed to assign section')
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
      toast.success('Export successful')
    } catch (error) {
      toast.error('Failed to export')
    }
  }

  const formatExpiry = (expiryDate) => {
    if (!expiryDate) return null
    const date = new Date(expiryDate)
    // If day is 1st, show as MM/YYYY
    if (date.getDate() === 1) {
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${month}/${year}`
    }
    return date.toLocaleDateString()
  }

  const displayItems = activeTab === 'all' ? items : unassignedItems

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <h2 className="text-xl font-bold">Stock Items</h2>
          <div className="flex gap-2 border-b">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-primary-600 text-primary-600 font-semibold' : 'text-gray-600'}`}
            >
              All Items ({items.length})
            </button>
            <button 
              onClick={() => setActiveTab('unassigned')}
              className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'unassigned' ? 'border-b-2 border-orange-600 text-orange-600 font-semibold' : 'text-gray-600'}`}
            >
              <AlertCircle className="w-4 h-4" />
              Unassigned ({unassignedItems.length})
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            <Download className="w-4 h-4" />Export
          </button>
          <button onClick={() => { 
            if (showForm) {
              setShowForm(false);
            } else {
              setEditingItem(null);
              setFormData({ 
                manufacturer: '',
                hsn_code: '',
                product_name: '', 
                batch_number: '', 
                package: '',
                expiry_date: '', 
                mrp: '',
                unit_price: '', 
                section_id: '', 
                quantity_software: '' 
              });
              setShowForm(true);
            }
          }} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
            <Plus className="w-4 h-4" />Add Item
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Product Name *</label>
              <input type="text" placeholder="e.g., Paracetamol 500mg" value={formData.product_name} onChange={(e) => setFormData({ ...formData, product_name: e.target.value })} className="w-full px-3 py-2 border rounded" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Manufacturer</label>
              <input type="text" placeholder="e.g., ELEG" value={formData.manufacturer} onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">HSN Code</label>
              <input type="text" placeholder="e.g., 30042064" value={formData.hsn_code} onChange={(e) => setFormData({ ...formData, hsn_code: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Batch Number *</label>
              <input type="text" placeholder="e.g., 4D116" value={formData.batch_number} onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })} className="w-full px-3 py-2 border rounded" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Package</label>
              <input type="text" placeholder="e.g., 10 X 6" value={formData.package} onChange={(e) => setFormData({ ...formData, package: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date</label>
              <input type="text" placeholder="e.g., 11/2026" value={formData.expiry_date} onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">MRP</label>
              <input type="text" placeholder="e.g., 69.00/STRIP" value={formData.mrp} onChange={(e) => setFormData({ ...formData, mrp: e.target.value })} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Unit Price *</label>
              <input type="number" step="0.01" placeholder="e.g., 74.45" value={formData.unit_price} onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })} className="w-full px-3 py-2 border rounded" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Quantity *</label>
              <input type="number" placeholder="e.g., 5" value={formData.quantity_software} onChange={(e) => setFormData({ ...formData, quantity_software: e.target.value })} className="w-full px-3 py-2 border rounded" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Section (Optional)</label>
              <select value={formData.section_id} onChange={(e) => setFormData({ ...formData, section_id: e.target.value })} className="w-full px-3 py-2 border rounded">
                <option value="">Select Section</option>
                {sections.map((section) => {
                  const rack = racks.find(r => r.id === section.rack_id)
                  return <option key={section.id} value={section.id}>{rack?.rack_number} - {section.section_name}</option>
                })}
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{editingItem ? 'Update' : 'Save'}</button>
            <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-primary-50 to-primary-100 border-b-2 border-primary-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Product</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Mfg</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">HSN</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Batch</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Pkg</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Expiry</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Qty (S/P)</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">MRP</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Price</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Value</th>
              {activeTab === 'unassigned' && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Assign Section</th>
              )}
              {activeTab === 'all' && (
                <>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Rack/Section</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Discrepancy</th>
                </>
              )}
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayItems.map((item, idx) => (
              <tr key={item.id} className={`transition-colors hover:bg-primary-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="px-4 py-3 font-semibold text-gray-900">{item.product_name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.manufacturer || '-'}</td>
                <td className="px-4 py-3 text-sm font-mono text-gray-700">{item.hsn_code || '-'}</td>
                <td className="px-4 py-3 text-sm font-mono text-gray-700">{item.batch_number}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.package || '-'}</td>
                <td className="px-4 py-3 text-sm">
                  {item.expiry_date ? (
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      new Date(item.expiry_date) < new Date() 
                        ? 'bg-red-100 text-red-800' 
                        : new Date(item.expiry_date) < new Date(Date.now() + 30*24*60*60*1000)
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {formatExpiry(item.expiry_date)}
                    </span>
                  ) : <span className="text-gray-400">-</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900">{item.quantity_software}</span>
                    {item.quantity_physical !== null && <span className="text-gray-500"> / {item.quantity_physical}</span>}
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-purple-700">{item.mrp || '-'}</td>
                <td className="px-4 py-3 font-semibold text-green-700">₹{item.unit_price}</td>
                <td className="px-4 py-3 font-semibold text-blue-700">
                  {item.total_value ? `₹${item.total_value.toLocaleString('en-IN')}` : '-'}
                </td>
                {activeTab === 'unassigned' ? (
                  <td className="px-4 py-3">
                    <select 
                      onChange={(e) => handleAssignSection(item.id, e.target.value)}
                      className="px-2 py-1 border rounded text-sm"
                      defaultValue=""
                    >
                      <option value="">Select Section</option>
                      {sections.map((section) => {
                        const rack = racks.find(r => r.id === section.rack_id)
                        return <option key={section.id} value={section.id}>{rack?.rack_number} - {section.section_name}</option>
                      })}
                    </select>
                  </td>
                ) : (
                  <>
                    <td className="px-4 py-3">
                      {item.rack_name && item.section_name ? (
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            {item.rack_name}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {item.section_name}
                          </span>
                        </div>
                      ) : <span className="text-orange-500 text-xs">Unassigned</span>}
                    </td>
                    <td className="px-4 py-3">
                      {item.audit_discrepancy !== 0 && item.audit_discrepancy !== null ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                          {item.audit_discrepancy > 0 ? '+' : ''}{item.audit_discrepancy}
                        </span>
                      ) : '-'}
                    </td>
                  </>
                )}
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {displayItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>{activeTab === 'unassigned' ? 'No unassigned items' : 'No items found'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StockItems
