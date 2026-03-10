import React, { useState, useEffect } from 'react'
import { stockAuditAPI } from '../services/stockAudit'
import { Plus, Edit, Trash2, Download, Package, AlertCircle, CheckCircle, List, Settings, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { purchaseInvoiceAPI } from '../../PurchaseInvoice/services/api'
import ProductAutocomplete from '../../PurchaseInvoice/components/ProductAutocomplete'
import CompositionAutocomplete from '../../PurchaseInvoice/components/CompositionAutocomplete'

const StockItems = () => {
  const [items, setItems] = useState([])
  const [unassignedItems, setUnassignedItems] = useState([])
  const [sections, setSections] = useState([])
  const [racks, setRacks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showBulkForm, setShowBulkForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [activeTab, setActiveTab] = useState('all') // 'all' or 'unassigned'
  const [bulkSection, setBulkSection] = useState('')
  const [bulkItems, setBulkItems] = useState([{ product_name: '', batch_number: '', quantity_software: '', unit_price: '', composition: '', manufacturer: '', hsn_code: '', package: '', unit: '', expiry_date: '', manufacturing_date: '', mrp: '', selling_price: '', profit_margin: '' }])
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    composition: '',
    manufacturer: '',
    batch_number: '',
    expiry_before: '',
    expiry_after: '',
    rack_id: '',
    section_id: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedUnassignedItems, setSelectedUnassignedItems] = useState([])
  const [bulkAssignSection, setBulkAssignSection] = useState('')
  const [uploadingExcel, setUploadingExcel] = useState(false)
  const [showUploadCard, setShowUploadCard] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(50)
  const [formData, setFormData] = useState({ 
    manufacturer: '',
    hsn_code: '',
    product_name: '',
    composition: '',
    batch_number: '', 
    package: '',
    unit: '',
    expiry_date: '',
    manufacturing_date: '',
    mrp: '',
    unit_price: '',
    selling_price: '',
    profit_margin: '',
    section_id: '', 
    quantity_software: '' 
  })

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setCurrentPage(1) // Reset to page 1 when filters change
      fetchData()
    }, 500)
    return () => clearTimeout(delayDebounce)
  }, [activeTab, searchTerm, filters])

  const fetchData = async () => {
    try {
      const [sectionsRes, racksRes] = await Promise.all([
        stockAuditAPI.getSections(),
        stockAuditAPI.getRacks()
      ])
      setSections(sectionsRes.data)
      setRacks(racksRes.data)

      if (activeTab === 'all') {
        const params = {
          item_name: searchTerm || undefined,
          composition: filters.composition || undefined,
          manufacturer: filters.manufacturer || undefined,
          batch_number: filters.batch_number || undefined,
          expiry_before: filters.expiry_before || undefined,
          expiry_after: filters.expiry_after || undefined,
          rack_id: filters.rack_id || undefined,
          section_id: filters.section_id || undefined
        }
        const itemsRes = await stockAuditAPI.getItems(params)
        setItems(itemsRes.data)
        
        // Fetch unassigned count even when on 'all' tab
        const unassignedRes = await stockAuditAPI.getUnassignedItems()
        setUnassignedItems(unassignedRes.data)
      } else {
        const params = {
          item_name: searchTerm || undefined,
          composition: filters.composition || undefined,
          manufacturer: filters.manufacturer || undefined,
          batch_number: filters.batch_number || undefined
        }
        const unassignedRes = await stockAuditAPI.getUnassignedItems(params)
        setUnassignedItems(unassignedRes.data)
        
        // Fetch all items count even when on 'unassigned' tab
        const itemsRes = await stockAuditAPI.getItems()
        setItems(itemsRes.data)
      }
    } catch (error) {
      toast.error('Failed to fetch data')
      console.error(error)
    }
  }

  const handleFormFieldChange = async (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-fetch pricing when composition or product_name changes
    if ((field === 'composition' || field === 'product_name') && value && value.trim() !== '') {
      try {
        const composition = field === 'composition' ? value : formData.composition
        const productName = field === 'product_name' ? value : formData.product_name
        
        if (composition || productName) {
          const response = await purchaseInvoiceAPI.getPricingByComposition(composition, productName)
          if (response.found && response.selling_price && response.profit_margin) {
            setFormData(prev => ({
              ...prev,
              selling_price: response.selling_price,
              profit_margin: response.profit_margin
            }))
            toast.success(`✨ Auto-filled: Selling ₹${response.selling_price}, Margin ${response.profit_margin.toFixed(1)}%`, {
              duration: 2000
            })
          }
        }
      } catch (error) {
        console.log('Could not fetch pricing data:', error)
      }
    }
    
    // Auto-calculate selling_price and profit_margin when unit_price changes
    if (field === 'unit_price') {
      const unitPrice = parseFloat(value) || 0
      const mrpValue = parseFloat(formData.mrp?.toString().match(/[0-9.]+/)?.[0]) || 0
      
      if (unitPrice > 0) {
        const suggestedSellingPrice = unitPrice * 1.35
        
        if (mrpValue > 0 && suggestedSellingPrice > mrpValue) {
          setFormData(prev => ({
            ...prev,
            selling_price: mrpValue.toFixed(2),
            profit_margin: (((mrpValue - unitPrice) / unitPrice) * 100).toFixed(2)
          }))
        } else {
          setFormData(prev => ({
            ...prev,
            selling_price: suggestedSellingPrice.toFixed(2),
            profit_margin: '35.00'
          }))
        }
      }
    }
    
    // If MRP changes, recalculate if selling price exceeds MRP
    if (field === 'mrp') {
      const unitPrice = parseFloat(formData.unit_price) || 0
      const mrpValue = parseFloat(value?.toString().match(/[0-9.]+/)?.[0]) || 0
      const currentSellingPrice = parseFloat(formData.selling_price) || 0
      
      if (mrpValue > 0 && currentSellingPrice > mrpValue && unitPrice > 0) {
        setFormData(prev => ({
          ...prev,
          selling_price: mrpValue.toFixed(2),
          profit_margin: (((mrpValue - unitPrice) / unitPrice) * 100).toFixed(2)
        }))
      }
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
      composition: '',
      batch_number: '', 
      package: '',
      unit: '',
      expiry_date: '',
      manufacturing_date: '',
      mrp: '',
      unit_price: '',
      selling_price: '',
      profit_margin: '',
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
      composition: item.composition || '',
      batch_number: item.batch_number,
      package: item.package || '',
      unit: item.unit || '',
      expiry_date: item.expiry_date || '',
      manufacturing_date: item.manufacturing_date || '',
      mrp: item.mrp || '',
      unit_price: item.unit_price || '',
      selling_price: item.selling_price || '',
      profit_margin: item.profit_margin || '',
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

  const handleBulkAssign = async () => {
    if (!bulkAssignSection) {
      toast.error('Please select a section')
      return
    }
    if (selectedUnassignedItems.length === 0) {
      toast.error('Please select items to assign')
      return
    }
    
    try {
      for (const itemId of selectedUnassignedItems) {
        await stockAuditAPI.assignSection(itemId, bulkAssignSection)
      }
      toast.success(`${selectedUnassignedItems.length} items assigned successfully`)
      setSelectedUnassignedItems([])
      setBulkAssignSection('')
      fetchData()
    } catch (error) {
      toast.error('Failed to assign sections')
    }
  }

  const toggleSelectItem = (itemId) => {
    setSelectedUnassignedItems(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedUnassignedItems.length === unassignedItems.length) {
      setSelectedUnassignedItems([])
    } else {
      setSelectedUnassignedItems(unassignedItems.map(item => item.id))
    }
  }

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    setUploadingExcel(true)
    setUploadResult(null)
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await stockAuditAPI.uploadExcel(formData)
      setUploadResult({ success: true, data: response.data })
      fetchData()
    } catch (error) {
      setUploadResult({ success: false, error: error.response?.data?.detail || 'Failed to upload Excel file' })
    } finally {
      setUploadingExcel(false)
      e.target.value = ''
    }
  }

  // const toggleSelectAllItems = () => {
  //   if (selectedItems.length === items.length) {
  //     setSelectedItems([])
  //   } else {
  //     setSelectedItems(items.map(item => item.id))
  //   }
  // }

  // const toggleSelectItemInAll = (itemId) => {
  //   setSelectedItems(prev => 
  //     prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
  //   )
  // }

  // const handleBulkDelete = async () => {
  //   const itemsToDelete = activeTab === 'all' ? selectedItems : selectedUnassignedItems
  //   if (itemsToDelete.length === 0) {
  //     toast.error('Please select items to delete')
  //     return
  //   }
    
  //   if (!confirm(`Delete ${itemsToDelete.length} selected items? This action cannot be undone.`)) return
    
  //   try {
  //     await stockAuditAPI.bulkDeleteItems(itemsToDelete)
  //     toast.success(`${itemsToDelete.length} items deleted successfully`)
  //     setSelectedItems([])
  //     setSelectedUnassignedItems([])
  //     fetchData()
  //   } catch (error) {
  //     toast.error('Failed to delete items')
  //   }
  // }

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

  const addBulkRow = () => {
    setBulkItems([...bulkItems, { product_name: '', batch_number: '', quantity_software: '', unit_price: '', composition: '', manufacturer: '', hsn_code: '', package: '', unit: '', expiry_date: '', manufacturing_date: '', mrp: '', selling_price: '', profit_margin: '' }])
  }

  const removeBulkRow = (index) => {
    if (bulkItems.length > 1) {
      setBulkItems(bulkItems.filter((_, i) => i !== index))
    }
  }

  const updateBulkItem = async (index, field, value) => {
    const updated = [...bulkItems]
    updated[index][field] = value
    
    // Auto-fetch pricing when composition or product_name changes
    if ((field === 'composition' || field === 'product_name') && value && value.trim() !== '') {
      try {
        const composition = field === 'composition' ? value : updated[index].composition
        const productName = field === 'product_name' ? value : updated[index].product_name
        
        if (composition || productName) {
          const response = await purchaseInvoiceAPI.getPricingByComposition(composition, productName)
          if (response.found && response.selling_price && response.profit_margin) {
            updated[index].selling_price = response.selling_price
            updated[index].profit_margin = response.profit_margin
            toast.success(`✨ Auto-filled: Selling ₹${response.selling_price}, Margin ${response.profit_margin.toFixed(1)}%`, {
              duration: 2000
            })
          }
        }
      } catch (error) {
        console.log('Could not fetch pricing data:', error)
      }
    }
    
    // Auto-calculate selling_price and profit_margin when unit_price or MRP changes
    if (field === 'unit_price') {
      const unitPrice = parseFloat(value) || 0
      const mrpValue = parseFloat(updated[index].mrp?.toString().match(/[0-9.]+/)?.[0]) || 0
      
      if (unitPrice > 0) {
        // Calculate selling price with 35% profit margin
        const suggestedSellingPrice = unitPrice * 1.35
        
        // Cap at MRP if MRP exists and suggested price exceeds it
        if (mrpValue > 0 && suggestedSellingPrice > mrpValue) {
          updated[index].selling_price = mrpValue.toFixed(2)
        } else {
          updated[index].selling_price = suggestedSellingPrice.toFixed(2)
        }
        
        // Calculate profit margin: ((selling - cost) / cost) * 100
        const sellingPrice = parseFloat(updated[index].selling_price)
        updated[index].profit_margin = (((sellingPrice - unitPrice) / unitPrice) * 100).toFixed(2)
      }
    }
    
    // If MRP changes, recalculate if selling price exceeds MRP
    if (field === 'mrp') {
      const unitPrice = parseFloat(updated[index].unit_price) || 0
      const mrpValue = parseFloat(value?.toString().match(/[0-9.]+/)?.[0]) || 0
      const currentSellingPrice = parseFloat(updated[index].selling_price) || 0
      
      if (mrpValue > 0 && currentSellingPrice > mrpValue) {
        updated[index].selling_price = mrpValue.toFixed(2)
        if (unitPrice > 0) {
          updated[index].profit_margin = (((mrpValue - unitPrice) / unitPrice) * 100).toFixed(2)
        }
      }
    }
    
    setBulkItems(updated)
  }

  const handleBulkSubmit = async (e) => {
    e.preventDefault()
    if (!bulkSection) {
      toast.error('Please select a section')
      return
    }
    
    try {
      let successCount = 0
      for (const item of bulkItems) {
        if (item.product_name && item.batch_number && item.quantity_software && item.unit_price && item.expiry_date) {
          await stockAuditAPI.addItem({
            ...item,
            section_id: bulkSection,
            quantity_software: parseInt(item.quantity_software) || 0,
            unit_price: parseFloat(item.unit_price) || null,
            manufacturing_date: item.manufacturing_date || null
          })
          successCount++
        }
      }
      toast.success(`${successCount} items added successfully`)
      setShowBulkForm(false)
      setBulkSection('')
      setBulkItems([{ product_name: '', batch_number: '', quantity_software: '', unit_price: '', composition: '', manufacturer: '', hsn_code: '', package: '', unit: '', expiry_date: '', manufacturing_date: '', mrp: '', selling_price: '', profit_margin: '' }])
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add items')
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
  
  // Pagination
  const totalPages = Math.ceil(displayItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = displayItems.slice(startIndex, endIndex)

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
          <button onClick={() => setShowUploadCard(!showUploadCard)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            <Upload className="w-4 h-4" />Upload Excel
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            <Download className="w-4 h-4" />Export
          </button>
          <button onClick={() => setShowBulkForm(!showBulkForm)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            <List className="w-4 h-4" />Bulk Add
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
                composition: '',
                batch_number: '', 
                package: '',
                unit: '',
                expiry_date: '',
                manufacturing_date: '',
                mrp: '',
                unit_price: '',
                selling_price: '',
                profit_margin: '',
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

      {/* Search and Filters */}
      <div className="mb-4 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Composition</label>
                <input
                  type="text"
                  placeholder="Filter by composition"
                  value={filters.composition}
                  onChange={(e) => setFilters({...filters, composition: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Manufacturer</label>
                <input
                  type="text"
                  placeholder="Filter by manufacturer"
                  value={filters.manufacturer}
                  onChange={(e) => setFilters({...filters, manufacturer: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Batch Number</label>
                <input
                  type="text"
                  placeholder="Filter by batch"
                  value={filters.batch_number}
                  onChange={(e) => setFilters({...filters, batch_number: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Rack</label>
                <select
                  value={filters.rack_id}
                  onChange={(e) => setFilters({...filters, rack_id: e.target.value, section_id: ''})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">All Racks</option>
                  {racks.map(rack => (
                    <option key={rack.id} value={rack.id}>{rack.rack_number}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Section</label>
                <select
                  value={filters.section_id}
                  onChange={(e) => setFilters({...filters, section_id: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">All Sections</option>
                  {sections
                    .filter(s => !filters.rack_id || s.rack_id === parseInt(filters.rack_id))
                    .map(section => {
                      const rack = racks.find(r => r.id === section.rack_id)
                      return <option key={section.id} value={section.id}>{rack?.rack_number} - {section.section_name}</option>
                    })}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Expiry After</label>
                <input
                  type="date"
                  value={filters.expiry_after}
                  onChange={(e) => setFilters({...filters, expiry_after: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Before</label>
                <input
                  type="date"
                  value={filters.expiry_before}
                  onChange={(e) => setFilters({...filters, expiry_before: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({ composition: '', manufacturer: '', batch_number: '', expiry_before: '', expiry_after: '', rack_id: '', section_id: '' })}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showUploadCard && (
        <div className="mb-6 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-blue-900">Upload Stock Items from Excel</h3>
            <button onClick={() => { setShowUploadCard(false); setUploadResult(null); }} className="text-blue-600 hover:text-blue-800">
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-300 text-blue-700 rounded hover:bg-blue-50">
                <Download className="w-4 h-4" />Download Format
              </button>
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
                <Upload className="w-4 h-4" />
                {uploadingExcel ? 'Uploading...' : 'Select & Upload File'}
                <input type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} className="hidden" disabled={uploadingExcel} />
              </label>
            </div>
            
            {uploadResult && (
              <div className={`p-4 rounded-lg ${uploadResult.success ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                {uploadResult.success ? (
                  <div>
                    <div className="flex items-center gap-2 text-green-800 font-semibold mb-2">
                      <CheckCircle className="w-5 h-5" />
                      {uploadResult.data.message}
                    </div>
                    <div className="text-sm text-green-700">
                      ✓ {uploadResult.data.success_count} items added successfully
                      {uploadResult.data.error_count > 0 && (
                        <div className="mt-1">⚠ {uploadResult.data.error_count} items failed</div>
                      )}
                    </div>
                    {uploadResult.data.errors && uploadResult.data.errors.length > 0 && (
                      <div className="mt-2 text-xs text-green-700">
                        <div className="font-semibold">Errors:</div>
                        {uploadResult.data.errors.map((err, idx) => (
                          <div key={idx}>• {err}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    <span>{uploadResult.error}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="text-sm text-blue-700 bg-white p-3 rounded border border-blue-200">
              <div className="font-semibold mb-1">Instructions:</div>
              <ol className="list-decimal list-inside space-y-1">
                <li>Click "Download Format" to get the Excel template</li>
                <li>Fill in your stock data (Product Name and Batch Number are mandatory)</li>
                <li>Click "Select & Upload File" to import your data</li>
                <li>Items will be added to "Unassigned" - assign sections later</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {showBulkForm && (
        <div className="mb-6 p-4 bg-purple-50 rounded border-2 border-purple-200">
          <h3 className="text-lg font-bold mb-4 text-purple-900">Bulk Add Items to Section</h3>
          <form onSubmit={handleBulkSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Rack & Section *</label>
              <select value={bulkSection} onChange={(e) => setBulkSection(e.target.value)} className="w-full px-3 py-2 border-2 border-purple-300 rounded" required>
                <option value="">Choose Section</option>
                {sections.map((section) => {
                  const rack = racks.find(r => r.id === section.rack_id)
                  return <option key={section.id} value={section.id}>{rack?.rack_number} - {section.section_name}</option>
                })}
              </select>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {bulkItems.map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm">Item {idx + 1}</span>
                    {bulkItems.length > 1 && (
                      <button type="button" onClick={() => removeBulkRow(idx)} className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-xs">
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <ProductAutocomplete
                      value={item.product_name}
                      onChange={(value) => updateBulkItem(idx, 'product_name', value)}
                      placeholder="Product Name *"
                      className="px-2 py-1 border rounded text-sm"
                    />
                    <input type="text" placeholder="Batch *" value={item.batch_number} onChange={(e) => updateBulkItem(idx, 'batch_number', e.target.value)} className="px-2 py-1 border rounded text-sm" required />
                    <input type="number" placeholder="Qty *" value={item.quantity_software} onChange={(e) => updateBulkItem(idx, 'quantity_software', e.target.value)} className="px-2 py-1 border rounded text-sm" required />
                    <input type="number" step="0.01" placeholder="Price *" value={item.unit_price} onChange={(e) => updateBulkItem(idx, 'unit_price', e.target.value)} className="px-2 py-1 border rounded text-sm" required />
                    <CompositionAutocomplete
                      value={item.composition}
                      onChange={(value) => updateBulkItem(idx, 'composition', value)}
                      placeholder="Composition"
                      className="px-2 py-1 border rounded text-sm"
                    />
                    <input type="text" placeholder="Manufacturer" value={item.manufacturer} onChange={(e) => updateBulkItem(idx, 'manufacturer', e.target.value)} className="px-2 py-1 border rounded text-sm" />
                    <input type="text" placeholder="HSN" value={item.hsn_code} onChange={(e) => updateBulkItem(idx, 'hsn_code', e.target.value)} className="px-2 py-1 border rounded text-sm" />
                    <input type="text" placeholder="Package" value={item.package} onChange={(e) => updateBulkItem(idx, 'package', e.target.value)} className="px-2 py-1 border rounded text-sm" />
                    <input type="text" placeholder="Unit" value={item.unit} onChange={(e) => updateBulkItem(idx, 'unit', e.target.value)} className="px-2 py-1 border rounded text-sm" />
                    <input type="date" placeholder="Expiry *" value={item.expiry_date} onChange={(e) => updateBulkItem(idx, 'expiry_date', e.target.value)} className="px-2 py-1 border rounded text-sm" required />
                    <input type="date" placeholder="Mfg Date" value={item.manufacturing_date} onChange={(e) => updateBulkItem(idx, 'manufacturing_date', e.target.value)} className="px-2 py-1 border rounded text-sm" />
                    <input type="text" placeholder="MRP" value={item.mrp} onChange={(e) => updateBulkItem(idx, 'mrp', e.target.value)} className="px-2 py-1 border rounded text-sm" />
                    <input type="number" step="0.01" placeholder="Selling Price" value={item.selling_price} onChange={(e) => updateBulkItem(idx, 'selling_price', e.target.value)} className="px-2 py-1 border rounded text-sm" />
                    <input type="number" step="0.01" placeholder="Margin %" value={item.profit_margin} onChange={(e) => updateBulkItem(idx, 'profit_margin', e.target.value)} className="px-2 py-1 border rounded text-sm" />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={addBulkRow} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Add Row</button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save All Items</button>
              <button type="button" onClick={() => { setShowBulkForm(false); setBulkSection(''); setBulkItems([{ product_name: '', batch_number: '', quantity_software: '', unit_price: '', composition: '', manufacturer: '', hsn_code: '', package: '', unit: '', expiry_date: '', manufacturing_date: '', mrp: '', selling_price: '', profit_margin: '' }]) }} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'unassigned' && unassignedItems.length > 0 && (
        <div className="mb-4 p-4 bg-orange-50 rounded border-2 border-orange-200">
          <h3 className="text-sm font-bold mb-3 text-orange-900">Bulk Assign Section</h3>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Select Rack & Section ({selectedUnassignedItems.length} items selected)
              </label>
              <select 
                value={bulkAssignSection} 
                onChange={(e) => setBulkAssignSection(e.target.value)} 
                className="w-full px-3 py-2 border-2 border-orange-300 rounded"
              >
                <option value="">Choose Section</option>
                {sections.map((section) => {
                  const rack = racks.find(r => r.id === section.rack_id)
                  return <option key={section.id} value={section.id}>{rack?.rack_number} - {section.section_name}</option>
                })}
              </select>
            </div>
            <button 
              onClick={handleBulkAssign}
              disabled={!bulkAssignSection || selectedUnassignedItems.length === 0}
              className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              Assign Selected
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Product Name *</label>
              <ProductAutocomplete
                value={formData.product_name}
                onChange={(value) => handleFormFieldChange('product_name', value)}
                placeholder="e.g., Paracetamol 500mg"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Composition</label>
              <CompositionAutocomplete
                value={formData.composition}
                onChange={(value) => handleFormFieldChange('composition', value)}
                placeholder="e.g., Paracetamol 500mg"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Manufacturer</label>
              <input type="text" placeholder="e.g., ELEG" value={formData.manufacturer} onChange={(e) => handleFormFieldChange('manufacturer', e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">HSN Code</label>
              <input type="text" placeholder="e.g., 30042064" value={formData.hsn_code} onChange={(e) => handleFormFieldChange('hsn_code', e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Batch Number *</label>
              <input type="text" placeholder="e.g., 4D116" value={formData.batch_number} onChange={(e) => handleFormFieldChange('batch_number', e.target.value)} className="w-full px-3 py-2 border rounded" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Package</label>
              <input type="text" placeholder="e.g., 10 X 6" value={formData.package} onChange={(e) => handleFormFieldChange('package', e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Unit</label>
              <input type="text" placeholder="e.g., Strip, Box" value={formData.unit} onChange={(e) => handleFormFieldChange('unit', e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date *</label>
              <input type="date" value={formData.expiry_date} onChange={(e) => handleFormFieldChange('expiry_date', e.target.value)} className="w-full px-3 py-2 border rounded" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Mfg Date</label>
              <input type="date" value={formData.manufacturing_date} onChange={(e) => handleFormFieldChange('manufacturing_date', e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">MRP</label>
              <input type="text" placeholder="e.g., 69.00/STRIP" value={formData.mrp} onChange={(e) => handleFormFieldChange('mrp', e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Purchase Price *</label>
              <input type="number" step="0.01" placeholder="e.g., 74.45" value={formData.unit_price} onChange={(e) => handleFormFieldChange('unit_price', e.target.value)} className="w-full px-3 py-2 border rounded" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Selling Price</label>
              <input type="number" step="0.01" placeholder="e.g., 85.00" value={formData.selling_price} onChange={(e) => handleFormFieldChange('selling_price', e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Profit Margin %</label>
              <input type="number" step="0.01" placeholder="e.g., 15.5" value={formData.profit_margin} onChange={(e) => handleFormFieldChange('profit_margin', e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Quantity *</label>
              <input type="number" placeholder="e.g., 5" value={formData.quantity_software} onChange={(e) => handleFormFieldChange('quantity_software', e.target.value)} className="w-full px-3 py-2 border rounded" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Section (Optional)</label>
              <select value={formData.section_id} onChange={(e) => handleFormFieldChange('section_id', e.target.value)} className="w-full px-3 py-2 border rounded">
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
              {activeTab === 'unassigned' && (
                <th className="px-4 py-3 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedUnassignedItems.length === unassignedItems.length && unassignedItems.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 cursor-pointer"
                  />
                </th>
              )}
              {/* {activeTab === 'all' && (
                <th className="px-4 py-3 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedItems.length === items.length && items.length > 0}
                    onChange={toggleSelectAllItems}
                    className="w-4 h-4 cursor-pointer"
                  />
                </th>
              )} */}
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Product</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Composition</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Mfg</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Batch</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Unit</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Expiry</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Qty (S/P)</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Purchase ₹</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Selling ₹</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-900 uppercase">Margin %</th>
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
            {paginatedItems.map((item, idx) => (
              <tr key={item.id} className={`transition-colors hover:bg-primary-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                {activeTab === 'unassigned' && (
                  <td className="px-4 py-3 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedUnassignedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                )}
                {/* {activeTab === 'all' && (
                  <td className="px-4 py-3 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItemInAll(item.id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                )} */}
                <td className="px-4 py-3 font-semibold text-gray-900">{item.product_name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.composition || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.manufacturer || '-'}</td>
                <td className="px-4 py-3 text-sm font-mono text-gray-700">{item.batch_number}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.unit || '-'}</td>
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
                <td className="px-4 py-3 font-semibold text-red-600">₹{item.unit_price || '-'}</td>
                <td className="px-4 py-3 font-semibold text-green-600">₹{item.selling_price || '-'}</td>
                <td className="px-4 py-3">
                  {item.profit_margin ? (
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                      item.profit_margin < 10 ? 'bg-red-100 text-red-800' :
                      item.profit_margin < 20 ? 'bg-orange-100 text-orange-800' :
                      item.profit_margin < 30 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.profit_margin.toFixed(1)}%
                    </span>
                  ) : <span className="text-gray-400">-</span>}
                </td>
                <td className="px-4 py-3 font-semibold text-blue-700">
                  {item.total_value ? `₹${item.total_value.toLocaleString('en-IN')}` : '-'}
                </td>
                {activeTab === 'unassigned' ? (
                  <td className="px-4 py-3">
                    <select 
                      value={selectedUnassignedItems.includes(item.id) ? bulkAssignSection : ''}
                      onChange={(e) => {
                        const sectionId = e.target.value
                        if (sectionId) {
                          handleAssignSection(item.id, sectionId)
                        }
                      }}
                      className="px-2 py-1 border rounded text-sm"
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
      
      {displayItems.length > 0 && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, displayItems.length)} of {displayItems.length} items
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1
              if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === page ? 'bg-primary-600 text-white' : 'hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2">...</span>
              }
              return null
            })}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default StockItems
