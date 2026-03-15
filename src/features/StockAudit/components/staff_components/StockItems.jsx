import { useState, useEffect } from 'react'
import { staffStockAuditAPI } from '../../services/staff_stock_audit_apis'
import { Plus, Edit, Trash2, Download, Package, AlertCircle, CheckCircle, List, Settings, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { staffPurchaseInvoiceAPI } from '../../../PurchaseInvoice/services/staff_purchase_invoice_apis'
import ProductAutocomplete from '../../../PurchaseInvoice/components/shared/ProductAutocomplete'
import CompositionAutocomplete from '../../../PurchaseInvoice/components/shared/CompositionAutocomplete'
import Pagination from '../shared/Pagination'

const PER_PAGE = 50

const StockItems = () => {
  const [items, setItems] = useState([])
  const [unassignedItems, setUnassignedItems] = useState([])
  const [sections, setSections] = useState([])
  const [racks, setRacks] = useState([])
  const [loading, setLoading] = useState(true)
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
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [allTotal, setAllTotal] = useState(0)
  const [unassignedTotal, setUnassignedTotal] = useState(0)
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

  // Debounce filter/search/tab changes → reset to page 1 and fetch
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData(1)
    }, 500)
    return () => clearTimeout(delayDebounce)
  }, [activeTab, searchTerm, filters])

  // Immediate fetch when page changes (triggered by pagination controls)
  useEffect(() => {
    fetchData(currentPage)
  }, [currentPage])

  const fetchData = async (page = 1) => {
    try {
      setLoading(true)
      setCurrentPage(page)

      const [sectionsRes, racksRes] = await Promise.all([
        staffStockAuditAPI.getSections(),
        staffStockAuditAPI.getRacks()
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
          section_id: filters.section_id || undefined,
          page,
          per_page: PER_PAGE
        }
        const itemsRes = await staffStockAuditAPI.getItems(params)
        setItems(itemsRes.data.items)
        setAllTotal(itemsRes.data.total)
        setTotalPages(itemsRes.data.pages)

        // Lightweight count for the unassigned badge
        const unassignedCountRes = await staffStockAuditAPI.getUnassignedItems({ page: 1, per_page: 1 })
        setUnassignedTotal(unassignedCountRes.data.total)
      } else {
        const params = {
          item_name: searchTerm || undefined,
          composition: filters.composition || undefined,
          manufacturer: filters.manufacturer || undefined,
          batch_number: filters.batch_number || undefined,
          page,
          per_page: PER_PAGE
        }
        const unassignedRes = await staffStockAuditAPI.getUnassignedItems(params)
        setUnassignedItems(unassignedRes.data.items)
        setUnassignedTotal(unassignedRes.data.total)
        setTotalPages(unassignedRes.data.pages)

        // Lightweight count for the all-items badge
        const allCountRes = await staffStockAuditAPI.getItems({ page: 1, per_page: 1 })
        setAllTotal(allCountRes.data.total)
      }
    } catch (error) {
      toast.error('Failed to fetch data')
      console.error(error)
    } finally {
      setLoading(false)
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
          const response = await staffPurchaseInvoiceAPI.getPricingByComposition(composition, productName)
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
        unit_price: parseFloat(formData.unit_price) || null,
        manufacturing_date: formData.manufacturing_date || null,
        expiry_date: formData.expiry_date || null
      }

      if (editingItem) {
        await staffStockAuditAPI.updateItem(editingItem.id, submitData)
        toast.success('Item updated successfully')
      } else {
        await staffStockAuditAPI.addItem(submitData)
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
      await staffStockAuditAPI.deleteItem(id)
      toast.success('Item deleted')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete item')
    }
  }

  const handleAssignSection = async (itemId, sectionId) => {
    try {
      await staffStockAuditAPI.assignSection(itemId, sectionId)
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
        await staffStockAuditAPI.assignSection(itemId, bulkAssignSection)
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

  const handleExport = async () => {
    try {
      const response = await staffStockAuditAPI.exportStockItems()
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
          const response = await staffPurchaseInvoiceAPI.getPricingByComposition(composition, productName)
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
          await staffStockAuditAPI.addItem({
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

  // Server already returned the correct page — no client-side slicing needed
  const displayItems = activeTab === 'all' ? items : unassignedItems

  return (
    <div className="bg-white dark:bg-slate-800/80 rounded-lg shadow dark:border dark:border-slate-700/50 p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <div className="flex gap-2 border-b">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-primary-600 text-primary-600 font-semibold' : 'text-gray-600 dark:text-slate-400'}`}
            >
              All Items ({allTotal})
            </button>
            <button 
              onClick={() => setActiveTab('unassigned')}
              className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'unassigned' ? 'border-b-2 border-orange-600 text-orange-600 font-semibold' : 'text-gray-600 dark:text-slate-400'}`}
            >
              <AlertCircle className="w-4 h-4" />
              Unassigned ({unassignedTotal})
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExport} 
            className="group relative flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Download className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Export</span>
          </button>
          <button 
            onClick={() => setShowBulkForm(!showBulkForm)} 
            className="group relative flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <List className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Bulk Add</span>
          </button>
          <button 
            onClick={() => { 
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
            }} 
            className="group relative flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Plus className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Add Item</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-3 overflow-visible">
        <div className="flex gap-2 relative z-10 p-1">
          <div className="flex-1 relative overflow-visible">
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg p-0.5">
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-white rounded-lg focus:outline-none transition-all duration-300"
                style={{
                  boxShadow: searchTerm ? 
                    '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)' : 
                    'none',
                  animation: searchTerm ? 'ai-pulse 2s ease-in-out infinite' : 'none'
                }}
              />
            </div>
          </div>
          <style>{`
            @keyframes ai-pulse {
              0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1); }
              50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.2); }
            }
          `}</style>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/30 hover:border-gray-400 flex items-center gap-2 transition-all duration-200 dark:text-slate-300"
          >
            <Settings className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {showFilters && (
          <div className="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg border dark:border-slate-700/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Composition</label>
                <input
                  type="text"
                  placeholder="Filter by composition"
                  value={filters.composition}
                  onChange={(e) => setFilters({...filters, composition: e.target.value})}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Manufacturer</label>
                <input
                  type="text"
                  placeholder="Filter by manufacturer"
                  value={filters.manufacturer}
                  onChange={(e) => setFilters({...filters, manufacturer: e.target.value})}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Batch Number</label>
                <input
                  type="text"
                  placeholder="Filter by batch"
                  value={filters.batch_number}
                  onChange={(e) => setFilters({...filters, batch_number: e.target.value})}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Rack</label>
                <select
                  value={filters.rack_id}
                  onChange={(e) => setFilters({...filters, rack_id: e.target.value, section_id: ''})}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                >
                  <option value="">All Racks</option>
                  {racks.map(rack => (
                    <option key={rack.id} value={rack.id}>{rack.rack_number}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Section</label>
                <select
                  value={filters.section_id}
                  onChange={(e) => setFilters({...filters, section_id: e.target.value})}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
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
                <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Expiry After</label>
                <input
                  type="date"
                  value={filters.expiry_after}
                  onChange={(e) => setFilters({...filters, expiry_after: e.target.value})}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Expiry Before</label>
                <input
                  type="date"
                  value={filters.expiry_before}
                  onChange={(e) => setFilters({...filters, expiry_before: e.target.value})}
                  className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({ composition: '', manufacturer: '', batch_number: '', expiry_before: '', expiry_after: '', rack_id: '', section_id: '' })}
                  className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded hover:bg-gray-300 dark:hover:bg-slate-600 w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showBulkForm && (
        <div className="mb-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-purple-300 dark:border-purple-800/40 shadow-lg">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 rounded-t-xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <List className="w-6 h-6" />
              Bulk Add Items to Section
            </h3>
          </div>
          
          <form onSubmit={handleBulkSubmit} className="p-6">
            {/* Top Box - Section Selection */}
            <div className="mb-6 p-4 bg-white dark:bg-slate-800/60 rounded-lg border-2 border-purple-300 dark:border-purple-800/40 shadow-sm">
              <label className="block text-sm font-bold text-gray-800 dark:text-white mb-3">Select Rack & Section *</label>
              <select
                value={bulkSection}
                onChange={(e) => setBulkSection(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                required
              >
                <option value="">Choose Section</option>
                {sections.map((section) => {
                  const rack = racks.find(r => r.id === section.rack_id)
                  return <option key={section.id} value={section.id}>{rack?.rack_number} - {section.section_name}</option>
                })}
              </select>
            </div>
            
            {/* Items List */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {bulkItems.map((item, idx) => (
                <div key={idx} className="p-5 bg-white dark:bg-slate-800/60 rounded-lg border-2 border-gray-200 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-base text-purple-700 dark:text-purple-400">Item {idx + 1}</span>
                    {bulkItems.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeBulkRow(idx)} 
                        className="flex items-center gap-1 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium border border-red-300 hover:border-red-400 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    )}
                  </div>
                  
                  {/* Row 1: Required Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Product Name *</label>
                      <ProductAutocomplete
                        value={item.product_name}
                        onChange={(value) => updateBulkItem(idx, 'product_name', value)}
                        placeholder="DAPAGLIFLOZIN"
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Batch *</label>
                      <input 
                        type="text" 
                        placeholder="B12345" 
                        value={item.batch_number} 
                        onChange={(e) => updateBulkItem(idx, 'batch_number', e.target.value)} 
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Qty *</label>
                      <input 
                        type="number" 
                        placeholder="100" 
                        value={item.quantity_software} 
                        onChange={(e) => updateBulkItem(idx, 'quantity_software', e.target.value)} 
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Price *</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder="₹45.50" 
                        value={item.unit_price} 
                        onChange={(e) => updateBulkItem(idx, 'unit_price', e.target.value)} 
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                        required 
                      />
                    </div>
                  </div>
                  
                  {/* Row 2: Optional Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Composition</label>
                      <CompositionAutocomplete
                        value={item.composition}
                        onChange={(value) => updateBulkItem(idx, 'composition', value)}
                        placeholder="10mg Tablet"
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Manufacturer</label>
                      <input 
                        type="text" 
                        placeholder="Sun Pharma" 
                        value={item.manufacturer} 
                        onChange={(e) => updateBulkItem(idx, 'manufacturer', e.target.value)} 
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">HSN</label>
                      <input 
                        type="text" 
                        placeholder="30049" 
                        value={item.hsn_code} 
                        onChange={(e) => updateBulkItem(idx, 'hsn_code', e.target.value)} 
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Package</label>
                      <input 
                        type="text" 
                        placeholder="10x10" 
                        value={item.package} 
                        onChange={(e) => updateBulkItem(idx, 'package', e.target.value)} 
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                      />
                    </div>
                  </div>
                  
                  {/* Row 3: Dates and Unit */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Unit</label>
                      <input 
                        type="text" 
                        placeholder="TAB" 
                        value={item.unit} 
                        onChange={(e) => updateBulkItem(idx, 'unit', e.target.value)} 
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Mfg Date</label>
                      <input 
                        type="date" 
                        value={item.manufacturing_date} 
                        onChange={(e) => updateBulkItem(idx, 'manufacturing_date', e.target.value)} 
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Expiry Date *</label>
                      <input 
                        type="date" 
                        value={item.expiry_date} 
                        onChange={(e) => updateBulkItem(idx, 'expiry_date', e.target.value)} 
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                        required 
                      />
                    </div>
                  </div>
                  
                  {/* Row 4: Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">MRP</label>
                      <input 
                        type="text" 
                        placeholder="₹50.00" 
                        value={item.mrp} 
                        onChange={(e) => updateBulkItem(idx, 'mrp', e.target.value)} 
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Selling Price</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder="₹48.00" 
                        value={item.selling_price} 
                        onChange={(e) => updateBulkItem(idx, 'selling_price', e.target.value)} 
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1">Margin %</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        placeholder="5.5%" 
                        value={item.profit_margin} 
                        onChange={(e) => updateBulkItem(idx, 'profit_margin', e.target.value)} 
                        className="w-full px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button 
                type="button" 
                onClick={addBulkRow} 
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Row
              </button>
              <button 
                type="submit" 
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-medium shadow-md hover:shadow-lg transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                Save All Items
              </button>
              <button 
                type="button" 
                onClick={() => { 
                  setShowBulkForm(false); 
                  setBulkSection(''); 
                  setBulkItems([{ product_name: '', batch_number: '', quantity_software: '', unit_price: '', composition: '', manufacturer: '', hsn_code: '', package: '', unit: '', expiry_date: '', manufacturing_date: '', mrp: '', selling_price: '', profit_margin: '' }]) 
                }} 
                className="px-5 py-2.5 bg-gray-300 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-600 font-medium shadow-md hover:shadow-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'unassigned' && unassignedItems.length > 0 && (
        <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded border-2 border-orange-200 dark:border-orange-800/40">
          <h3 className="text-sm font-bold mb-3 text-orange-900 dark:text-orange-300">Bulk Assign Section</h3>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">
                Select Rack & Section ({selectedUnassignedItems.length} items selected)
              </label>
              <select 
                value={bulkAssignSection} 
                onChange={(e) => setBulkAssignSection(e.target.value)} 
                className="w-full px-3 py-2 border-2 border-orange-300 dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white"
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
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 dark:bg-slate-700/30 rounded dark:border dark:border-slate-700/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Product Name *</label>
              <ProductAutocomplete
                value={formData.product_name}
                onChange={(value) => handleFormFieldChange('product_name', value)}
                placeholder="e.g., Paracetamol 500mg"
                className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Composition</label>
              <CompositionAutocomplete
                value={formData.composition}
                onChange={(value) => handleFormFieldChange('composition', value)}
                placeholder="e.g., Paracetamol 500mg"
                className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Manufacturer</label>
              <input type="text" placeholder="e.g., ELEG" value={formData.manufacturer} onChange={(e) => handleFormFieldChange('manufacturer', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">HSN Code</label>
              <input type="text" placeholder="e.g., 30042064" value={formData.hsn_code} onChange={(e) => handleFormFieldChange('hsn_code', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Batch Number *</label>
              <input type="text" placeholder="e.g., 4D116" value={formData.batch_number} onChange={(e) => handleFormFieldChange('batch_number', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Package</label>
              <input type="text" placeholder="e.g., 10 X 6" value={formData.package} onChange={(e) => handleFormFieldChange('package', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Unit</label>
              <input type="text" placeholder="e.g., Strip, Box" value={formData.unit} onChange={(e) => handleFormFieldChange('unit', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Expiry Date *</label>
              <input type="date" value={formData.expiry_date} onChange={(e) => handleFormFieldChange('expiry_date', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Mfg Date</label>
              <input type="date" value={formData.manufacturing_date} onChange={(e) => handleFormFieldChange('manufacturing_date', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">MRP</label>
              <input type="text" placeholder="e.g., 69.00/STRIP" value={formData.mrp} onChange={(e) => handleFormFieldChange('mrp', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Purchase Price *</label>
              <input type="number" step="0.01" placeholder="e.g., 74.45" value={formData.unit_price} onChange={(e) => handleFormFieldChange('unit_price', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Selling Price</label>
              <input type="number" step="0.01" placeholder="e.g., 85.00" value={formData.selling_price} onChange={(e) => handleFormFieldChange('selling_price', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Profit Margin %</label>
              <input type="number" step="0.01" placeholder="e.g., 15.5" value={formData.profit_margin} onChange={(e) => handleFormFieldChange('profit_margin', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Quantity *</label>
              <input type="number" placeholder="e.g., 5" value={formData.quantity_software} onChange={(e) => handleFormFieldChange('quantity_software', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">Section (Optional)</label>
              <select value={formData.section_id} onChange={(e) => handleFormFieldChange('section_id', e.target.value)} className="w-full px-3 py-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white">
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
            <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-300 dark:bg-slate-700 dark:text-slate-300 rounded dark:hover:bg-slate-600">Cancel</button>
          </div>
        </form>
      )}

      <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800/40">
        <AlertCircle className="w-4 h-4 text-blue-600" />
        <span>Scroll right to see the full table</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700/50 shadow-lg mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-slate-400">Loading stock items...</p>
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100/80 via-sky-100/80 to-cyan-100/80 dark:from-slate-700/50 dark:via-slate-700/50 dark:to-slate-700/50 backdrop-blur-sm border-b border-blue-200/50 dark:border-slate-700/50">
                {activeTab === 'unassigned' && (
                  <th className="px-6 py-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedUnassignedItems.length === unassignedItems.length && unassignedItems.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </th>
                )}
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Composition</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Mfg</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Batch</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Qty (S/P)</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Purchase ₹</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Selling ₹</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Margin %</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Value</th>
                {activeTab === 'unassigned' && (
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Assign Section</th>
                )}
                {activeTab === 'all' && (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Rack/Section</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Discrepancy</th>
                  </>
                )}
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800/80 divide-y divide-gray-100 dark:divide-slate-700/50">
              {displayItems.map((item, idx) => (
                <tr key={item.id} className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 hover:shadow-sm ${idx % 2 === 0 ? 'bg-white dark:bg-slate-800/80' : 'bg-slate-50/50 dark:bg-slate-700/30'}`}>
                  {activeTab === 'unassigned' && (
                    <td className="px-6 py-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedUnassignedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">{item.product_name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{item.composition || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{item.manufacturer || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-300 font-mono">
                      {item.batch_number}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{item.unit || '-'}</td>
                  <td className="px-6 py-4">
                    {item.expiry_date ? (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        new Date(item.expiry_date) < new Date() 
                          ? 'bg-red-100 text-red-800 border border-red-200' 
                          : new Date(item.expiry_date) < new Date(Date.now() + 30*24*60*60*1000)
                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {formatExpiry(item.expiry_date)}
                      </span>
                    ) : <span className="text-gray-400 dark:text-slate-600">-</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <span className="font-bold text-gray-900 dark:text-white text-lg">{item.quantity_software}</span>
                      {item.quantity_physical !== null && <span className="text-gray-500 dark:text-slate-500 ml-1">/ {item.quantity_physical}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-red-600 text-sm">₹{item.unit_price || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-green-600 text-sm">₹{item.selling_price || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    {item.profit_margin ? (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                        item.profit_margin < 10 ? 'bg-red-50 text-red-700 border-red-200' :
                        item.profit_margin < 20 ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        item.profit_margin < 30 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        'bg-green-50 text-green-700 border-green-200'
                      }`}>
                        {item.profit_margin.toFixed(1)}%
                      </span>
                    ) : <span className="text-gray-400 dark:text-slate-600">-</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-blue-700 text-sm">
                      {item.total_value ? `₹${item.total_value.toLocaleString('en-IN')}` : '-'}
                    </span>
                  </td>
                  {activeTab === 'unassigned' ? (
                    <td className="px-6 py-4">
                      <select 
                        value={selectedUnassignedItems.includes(item.id) ? bulkAssignSection : ''}
                        onChange={(e) => {
                          const sectionId = e.target.value
                          if (sectionId) {
                            handleAssignSection(item.id, sectionId)
                          }
                        }}
                        className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
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
                      <td className="px-6 py-4">
                        {item.rack_name && item.section_name ? (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
                              {item.rack_name}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                              {item.section_name}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800/40">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {item.audit_discrepancy !== 0 && item.audit_discrepancy !== null ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800/40">
                            {item.audit_discrepancy > 0 ? '+' : ''}{item.audit_discrepancy}
                          </span>
                        ) : '-'}
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(item)} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && displayItems.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-800/80">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 dark:text-slate-500 text-lg">{activeTab === 'unassigned' ? 'No unassigned items' : 'No items found'}</p>
          </div>
        )}
      </div>
      
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        total={activeTab === 'all' ? allTotal : unassignedTotal}
        perPage={PER_PAGE}
        onPageChange={(p) => setCurrentPage(p)}
      />
    </div>
  )
}

export default StockItems
