import { useState, useEffect } from 'react'
import { Save, X, Plus, Trash2, AlertCircle, Package, IndianRupee, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import { staffPurchaseInvoiceAPI } from '../../services/staff_purchase_invoice_apis'
import { adminPurchaseInvoiceAPI } from '../../services/admin_purchase_invoice_apis'
import ProductAutocomplete from '../shared/ProductAutocomplete'
import CompositionAutocomplete from '../shared/CompositionAutocomplete'
import UnitAutocomplete from '../shared/UnitAutocomplete'

const EditInvoice = ({ invoice, onClose, onSave, isAdmin = false }) => {
  const [isDistributorInvoice, setIsDistributorInvoice] = useState(invoice?.is_distributor_invoice || false)
  const [formData, setFormData] = useState({
    invoice_number: '',
    invoice_date: '',
    due_date: '',
    supplier_name: '',
    supplier_address: '',
    supplier_gstin: '',
    supplier_dl_numbers: '',
    supplier_phone: '',
    gross_amount: 0,
    discount_amount: 0,
    taxable_amount: 0,
    total_gst: 0,
    round_off: 0,
    net_amount: 0,
    custom_fields: {},
    items: []
  })
  const [customFieldKey, setCustomFieldKey] = useState('')
  const [customFieldValue, setCustomFieldValue] = useState('')
  const [customItemColumns, setCustomItemColumns] = useState([])
  const [newColumnName, setNewColumnName] = useState('')
  const [saving, setSaving] = useState(false)
  const [priceErrors, setPriceErrors] = useState({})

  useEffect(() => {
    if (invoice) {
      // Update isDistributorInvoice flag
      setIsDistributorInvoice(invoice.is_distributor_invoice || false)
      
      // For distributor invoices, use distributor info as supplier
      const isDistInv = invoice.is_distributor_invoice || false
      const supplierName = isDistInv ? (invoice.distributor?.company_name || '') : (invoice.supplier_name || '')
      const supplierAddress = isDistInv ? (invoice.distributor?.address || '') : (invoice.supplier_address || '')
      const supplierGstin = isDistInv ? (invoice.distributor?.gstin || '') : (invoice.supplier_gstin || '')
      const supplierPhone = isDistInv ? (invoice.distributor?.phone || '') : (invoice.supplier_phone || '')
      const supplierDl = isDistInv ? (invoice.distributor?.dl_number || '') : (invoice.supplier_dl_numbers || '')
      
      console.log('Setting supplier_name to:', supplierName)
      console.log('Setting invoice_number:', invoice.invoice_number)
      
      setFormData({
        invoice_number: invoice.invoice_number || '',
        invoice_date: invoice.invoice_date ? new Date(invoice.invoice_date).toISOString().split('T')[0] : '',
        due_date: invoice.due_date ? new Date(invoice.due_date).toISOString().split('T')[0] : '',
        supplier_name: supplierName,
        supplier_address: supplierAddress,
        supplier_gstin: supplierGstin,
        supplier_dl_numbers: supplierDl,
        supplier_phone: supplierPhone,
        gross_amount: invoice.gross_amount || 0,
        discount_amount: invoice.discount_amount || 0,
        taxable_amount: invoice.taxable_amount || 0,
        total_gst: invoice.total_gst || 0,
        round_off: invoice.round_off || 0,
        net_amount: invoice.net_amount || 0,
        custom_fields: invoice.custom_fields || {},
        items: invoice.items.map(item => ({
          id: item.id,
          composition: item.composition || '',
          manufacturer: item.manufacturer || '',
          hsn_code: item.hsn_code || '',
          product_name: item.product_name || '',
          batch_number: item.batch_number || '',
          quantity: item.quantity || 0,
          free_quantity: item.free_quantity || 0,
          package: item.package || '',
          unit: item.unit || '',
          manufacturing_date: item.manufacturing_date || '',
          expiry_date: item.expiry_date || '',
          mrp: item.mrp || '',
          unit_price: item.unit_price || 0,
          selling_price: item.selling_price || 0,
          profit_margin: item.profit_margin || 0,
          discount_on_purchase: item.discount_on_purchase || 0,
          discount_on_sales: item.discount_on_sales || 0,
          discount_percent: item.discount_percent || 0,
          discount_amount: item.discount_amount || 0,
          before_discount: item.before_discount || 0,
          taxable_amount: item.taxable_amount || 0,
          cgst_percent: item.cgst_percent || 0,
          cgst_amount: item.cgst_amount || 0,
          sgst_percent: item.sgst_percent || 0,
          sgst_amount: item.sgst_amount || 0,
          igst_percent: item.igst_percent || 0,
          igst_amount: item.igst_amount || 0,
          total_amount: item.total_amount || 0,
          custom_fields: item.custom_fields || {}
        }))
      })
      
      // Extract custom column names from items
      const customCols = new Set()
      invoice.items.forEach(item => {
        if (item.custom_fields) {
          Object.keys(item.custom_fields).forEach(key => customCols.add(key))
        }
      })
      setCustomItemColumns(Array.from(customCols))
    }
  }, [invoice])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleItemChange = async (index, field, value) => {
    const newItems = [...formData.items]
    const item = newItems[index]
    
    // Handle custom fields separately
    if (field.startsWith('custom_')) {
      const customFieldName = field.replace('custom_', '')
      item.custom_fields = {
        ...item.custom_fields,
        [customFieldName]: value
      }
      setFormData(prev => ({ ...prev, items: newItems }))
      return
    }
    
    // Update the changed field
    item[field] = value
    
    // Auto-fetch pricing when composition or product_name changes
    if ((field === 'composition' || field === 'product_name') && value && value.trim() !== '') {
      try {
        const composition = field === 'composition' ? value : item.composition
        const productName = field === 'product_name' ? value : item.product_name
        
        const response = await staffPurchaseInvoiceAPI.getPricingByComposition(composition, productName)
        if (response.found && response.selling_price && response.profit_margin) {
          item.selling_price = response.selling_price
          item.profit_margin = response.profit_margin
          toast.success(`Auto-populated: Selling Price ₹${response.selling_price}, Margin ${response.profit_margin.toFixed(1)}%`, {
            duration: 3000,
            icon: '✨'
          })
        }
      } catch (error) {
        // Silently fail - don't show error to user
        console.log('Could not fetch pricing data:', error)
      }
    }
    
    // === DISCOUNT CALCULATIONS ===
    // If before_discount or discount_percent changes, calculate discount_amount and unit_price
    if (field === 'before_discount' || field === 'discount_percent') {
      const beforeDiscount = parseFloat(item.before_discount) || 0
      const discountPercent = parseFloat(item.discount_percent) || 0
      item.discount_amount = (beforeDiscount * discountPercent) / 100
      item.unit_price = beforeDiscount - item.discount_amount
    }
    
    // If discount_amount changes, calculate unit_price
    if (field === 'discount_amount') {
      const beforeDiscount = parseFloat(item.before_discount) || 0
      const discountAmount = parseFloat(item.discount_amount) || 0
      item.unit_price = beforeDiscount - discountAmount
      // Recalculate discount_percent
      if (beforeDiscount > 0) {
        item.discount_percent = (discountAmount / beforeDiscount) * 100
      }
    }
    
    // If unit_price changes and before_discount exists, calculate discount
    if (field === 'unit_price') {
      const unitPrice = parseFloat(item.unit_price) || 0
      const beforeDiscount = parseFloat(item.before_discount) || 0
      
      if (beforeDiscount > 0) {
        item.discount_amount = beforeDiscount - unitPrice
        item.discount_percent = (item.discount_amount / beforeDiscount) * 100
      }
      
      // Admin only: Auto-calculate selling price with 35% profit margin
      if (isAdmin) {
        const suggestedSellingPrice = unitPrice * 1.35
        const mrpValue = parseFloat(item.mrp) || 0
        
        if (mrpValue > 0 && suggestedSellingPrice > mrpValue) {
          item.selling_price = mrpValue
        } else {
          item.selling_price = suggestedSellingPrice
        }
        
        // Calculate profit margin
        if (unitPrice > 0) {
          item.profit_margin = ((item.selling_price - unitPrice) / unitPrice) * 100
        }
      }
    }
    
    // === SELLING PRICE & PROFIT MARGIN (Admin only) ===
    if (field === 'selling_price' && isAdmin) {
      const sellingPrice = parseFloat(item.selling_price) || 0
      const mrpValue = parseFloat(item.mrp) || 0
      const unitPrice = parseFloat(item.unit_price) || 0
      
      // Validate against MRP
      if (mrpValue > 0 && sellingPrice > mrpValue) {
        setPriceErrors(prev => ({ ...prev, [index]: true }))
        item.selling_price = mrpValue
      } else {
        setPriceErrors(prev => ({ ...prev, [index]: false }))
      }
      
      // Calculate profit margin
      if (unitPrice > 0) {
        item.profit_margin = ((item.selling_price - unitPrice) / unitPrice) * 100
      }
    }
    
    if (field === 'profit_margin' && isAdmin) {
      const profitMargin = parseFloat(item.profit_margin) || 0
      const unitPrice = parseFloat(item.unit_price) || 0
      const mrpValue = parseFloat(item.mrp) || 0
      
      if (unitPrice > 0) {
        const calculatedSellingPrice = unitPrice * (1 + profitMargin / 100)
        
        // Cap at MRP if exists
        if (mrpValue > 0 && calculatedSellingPrice > mrpValue) {
          setPriceErrors(prev => ({ ...prev, [index]: true }))
          item.selling_price = mrpValue
          item.profit_margin = ((mrpValue - unitPrice) / unitPrice) * 100
        } else {
          setPriceErrors(prev => ({ ...prev, [index]: false }))
          item.selling_price = calculatedSellingPrice
        }
      }
    }
    
    // If discount_on_sales changes, it's just stored (informational field)
    // This represents the discount % offered to customers on the selling price
    // Final Customer Price = Selling Price - (Selling Price × Discount On Sales %)
    
    // === TAX CALCULATIONS ===
    // Recalculate taxable amount when quantity or unit_price changes
    if (['quantity', 'unit_price', 'before_discount', 'discount_percent', 'discount_amount'].includes(field)) {
      const quantity = parseFloat(item.quantity) || 0
      const unitPrice = parseFloat(item.unit_price) || 0
      item.taxable_amount = quantity * unitPrice
    }
    
    // If taxable_amount is manually edited, recalculate unit_price
    if (field === 'taxable_amount') {
      const taxable = parseFloat(item.taxable_amount) || 0
      const quantity = parseFloat(item.quantity) || 0
      if (quantity > 0) {
        item.unit_price = taxable / quantity
      }
    }
    
    // If CGST amount is manually edited, recalculate CGST percent
    if (field === 'cgst_amount') {
      const cgstAmount = parseFloat(item.cgst_amount) || 0
      const taxable = parseFloat(item.taxable_amount) || 0
      if (taxable > 0) {
        item.cgst_percent = (cgstAmount / taxable) * 100
      }
    }
    
    // If SGST amount is manually edited, recalculate SGST percent
    if (field === 'sgst_amount') {
      const sgstAmount = parseFloat(item.sgst_amount) || 0
      const taxable = parseFloat(item.taxable_amount) || 0
      if (taxable > 0) {
        item.sgst_percent = (sgstAmount / taxable) * 100
      }
    }
    
    // If IGST amount is manually edited, recalculate IGST percent
    if (field === 'igst_amount') {
      const igstAmount = parseFloat(item.igst_amount) || 0
      const taxable = parseFloat(item.taxable_amount) || 0
      if (taxable > 0) {
        item.igst_percent = (igstAmount / taxable) * 100
      }
    }
    
    // Calculate GST amounts when taxable_amount or tax percentages change
    if (['quantity', 'unit_price', 'before_discount', 'discount_percent', 'discount_amount', 'cgst_percent', 'sgst_percent', 'igst_percent', 'taxable_amount'].includes(field)) {
      const taxable = parseFloat(item.taxable_amount) || 0
      const cgstPercent = parseFloat(item.cgst_percent) || 0
      const sgstPercent = parseFloat(item.sgst_percent) || 0
      const igstPercent = parseFloat(item.igst_percent) || 0
      
      item.cgst_amount = (taxable * cgstPercent) / 100
      item.sgst_amount = (taxable * sgstPercent) / 100
      item.igst_amount = (taxable * igstPercent) / 100
      item.total_amount = taxable + item.cgst_amount + item.sgst_amount + item.igst_amount
    }
    
    // If total_amount is manually edited, distribute back to taxable_amount
    if (field === 'total_amount') {
      const total = parseFloat(item.total_amount) || 0
      const cgstPercent = parseFloat(item.cgst_percent) || 0
      const sgstPercent = parseFloat(item.sgst_percent) || 0
      const igstPercent = parseFloat(item.igst_percent) || 0
      const totalTaxPercent = cgstPercent + sgstPercent + igstPercent
      
      // Reverse calculate: total = taxable * (1 + totalTaxPercent/100)
      if (totalTaxPercent > 0) {
        item.taxable_amount = total / (1 + totalTaxPercent / 100)
      } else {
        item.taxable_amount = total
      }
      
      // Recalculate GST amounts
      item.cgst_amount = (item.taxable_amount * cgstPercent) / 100
      item.sgst_amount = (item.taxable_amount * sgstPercent) / 100
      item.igst_amount = (item.taxable_amount * igstPercent) / 100
      
      // Recalculate unit_price from taxable_amount
      const quantity = parseFloat(item.quantity) || 0
      if (quantity > 0) {
        item.unit_price = item.taxable_amount / quantity
      }
    }
    
    setFormData(prev => ({ ...prev, items: newItems }))
    recalculateTotals(newItems)
  }

  const recalculateTotals = (items) => {
    const gross = items.reduce((sum, item) => sum + item.taxable_amount, 0)
    const gst = items.reduce((sum, item) => sum + item.cgst_amount + item.sgst_amount + item.igst_amount, 0)
    const net = gross + gst + formData.round_off
    
    setFormData(prev => ({
      ...prev,
      gross_amount: gross,
      taxable_amount: gross,
      total_gst: gst,
      net_amount: net
    }))
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        composition: '',
        manufacturer: '',
        hsn_code: '',
        product_name: '',
        batch_number: '',
        quantity: 1,
        free_quantity: 0,
        package: '',
        unit: '',
        manufacturing_date: '',
        expiry_date: '',
        mrp: '',
        unit_price: 0,
        selling_price: 0,
        profit_margin: 0,
        discount_on_purchase: 0,
        discount_on_sales: 0,
        discount_percent: 0,
        discount_amount: 0,
        before_discount: 0,
        taxable_amount: 0,
        cgst_percent: 6,
        cgst_amount: 0,
        sgst_percent: 6,
        sgst_amount: 0,
        igst_percent: 0,
        igst_amount: 0,
        total_amount: 0,
        custom_fields: {}
      }]
    }))
  }

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, items: newItems }))
    recalculateTotals(newItems)
  }

  const addCustomField = () => {
    if (customFieldKey && customFieldValue) {
      setFormData(prev => ({
        ...prev,
        custom_fields: { ...prev.custom_fields, [customFieldKey]: customFieldValue }
      }))
      setCustomFieldKey('')
      setCustomFieldValue('')
    }
  }

  const removeCustomField = (key) => {
    const newFields = { ...formData.custom_fields }
    delete newFields[key]
    setFormData(prev => ({ ...prev, custom_fields: newFields }))
  }

  const addCustomItemColumn = () => {
    if (newColumnName && !customItemColumns.includes(newColumnName)) {
      setCustomItemColumns(prev => [...prev, newColumnName])
      // Add the column to all existing items
      const newItems = formData.items.map(item => ({
        ...item,
        custom_fields: { ...item.custom_fields, [newColumnName]: '' }
      }))
      setFormData(prev => ({ ...prev, items: newItems }))
      setNewColumnName('')
      toast.success(`Column "${newColumnName}" added to all items`)
    }
  }

  const removeCustomItemColumn = (columnName) => {
    setCustomItemColumns(prev => prev.filter(col => col !== columnName))
    // Remove the column from all items
    const newItems = formData.items.map(item => {
      const newCustomFields = { ...item.custom_fields }
      delete newCustomFields[columnName]
      return { ...item, custom_fields: newCustomFields }
    })
    setFormData(prev => ({ ...prev, items: newItems }))
    toast.success(`Column "${columnName}" removed`)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (isDistributorInvoice && !isAdmin) {
        // Staff verifies distributor invoice
        await staffPurchaseInvoiceAPI.staffVerifyDistributorInvoice(invoice.id)
        toast.success('Invoice verified successfully!')
      } else if (invoice.id) {
        if (isAdmin) {
          if (isDistributorInvoice) {
            await adminPurchaseInvoiceAPI.adminUpdateDistributorInvoice(invoice.id, formData)
          } else {
            await adminPurchaseInvoiceAPI.adminUpdateInvoice(invoice.id, formData)
          }
        } else {
          await staffPurchaseInvoiceAPI.updateInvoice(invoice.id, formData)
        }
        toast.success('Invoice updated successfully!')
      } else {
        await staffPurchaseInvoiceAPI.createInvoice(formData)
        toast.success('Invoice created successfully!')
      }
      if (onSave) onSave()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save invoice')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-7xl w-full my-8" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b dark:border-slate-700/50 p-4 flex justify-between items-center rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              {isDistributorInvoice ? 'Review & Verify Distributor Invoice' : invoice.id ? 'Edit & Verify Invoice' : 'Create New Invoice'}
            </h2>
            {isDistributorInvoice && (
              <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                <Package className="w-4 h-4" /> Imported from {invoice.distributor?.company_name || 'Distributor'} - Review and verify to add to stock
              </p>
            )}
            {invoice.admin_rejected_by_name && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Rejected by {invoice.admin_rejected_by_name} - Please review and correct
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 text-2xl">✕</button>
        </div>
        
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Supplier & Invoice Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 dark:text-slate-300">{isDistributorInvoice ? 'Distributor Information' : 'Supplier Information'}</h3>
              <input
                type="text"
                placeholder={isDistributorInvoice ? "Distributor Name" : "Supplier Name"}
                value={formData.supplier_name}
                onChange={(e) => handleChange('supplier_name', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                readOnly={isDistributorInvoice}
              />
              <input
                type="text"
                placeholder="GSTIN"
                value={formData.supplier_gstin}
                onChange={(e) => handleChange('supplier_gstin', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                readOnly={isDistributorInvoice}
              />
              <input
                type="text"
                placeholder="Phone"
                value={formData.supplier_phone}
                onChange={(e) => handleChange('supplier_phone', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                readOnly={isDistributorInvoice}
              />
              <input
                type="text"
                placeholder="DL Numbers"
                value={formData.supplier_dl_numbers}
                onChange={(e) => handleChange('supplier_dl_numbers', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                readOnly={isDistributorInvoice}
              />
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 dark:text-slate-300">Invoice Information</h3>
              <div>
                <label className="text-sm text-gray-600 dark:text-slate-400">
                  Invoice Number
                  {formData.invoice_number?.startsWith('PI-') && (
                    <span className="ml-2 text-xs text-blue-500">(auto-generated)</span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Invoice Number"
                  value={formData.invoice_number}
                  onChange={(e) => handleChange('invoice_number', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                  readOnly={!invoice.id && formData.invoice_number?.startsWith('PI-')}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-slate-400">Invoice Date</label>
                <input
                  type="date"
                  value={formData.invoice_date}
                  onChange={(e) => handleChange('invoice_date', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-slate-400">Due Date</label>
                <input
                  type="date"
                  placeholder="Due Date"
                  value={formData.due_date}
                  onChange={(e) => handleChange('due_date', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Custom Fields */}
          <div className="border-t dark:border-slate-700/50 pt-4">
            <h3 className="font-semibold text-gray-700 dark:text-slate-300 mb-3">Custom Fields (Shop-Specific)</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Field Name"
                value={customFieldKey}
                onChange={(e) => setCustomFieldKey(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Value"
                value={customFieldValue}
                onChange={(e) => setCustomFieldValue(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <button onClick={addCustomField} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(formData.custom_fields).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700/50 px-3 py-1 rounded-lg">
                  <span className="text-sm dark:text-slate-300"><strong>{key}:</strong> {value}</span>
                  <button onClick={() => removeCustomField(key)} className="text-red-600 hover:text-red-800">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="border-t dark:border-slate-700/50 pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700 dark:text-slate-300">Items</h3>
              <div className="flex gap-2">
                <button onClick={addItem} className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1 text-sm">
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>
            </div>
            
            {/* Add Custom Column */}
            <div className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/40 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Add Custom Column (applies to all items)</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Column Name (e.g., MRP, Discount, Notes)"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                />
                <button onClick={addCustomItemColumn} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {customItemColumns.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-xs text-gray-600 dark:text-slate-400">Custom Columns:</span>
                  {customItemColumns.map(col => (
                    <div key={col} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded text-xs">
                      <span className="dark:text-slate-300">{col}</span>
                      <button onClick={() => removeCustomItemColumn(col)} className="text-red-600 hover:text-red-800">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {formData.items.map((item, idx) => (
                <div key={idx} className="border dark:border-slate-700/50 rounded-lg p-3 bg-gray-50 dark:bg-slate-700/30">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-semibold text-gray-600 dark:text-slate-400">Item {idx + 1}</span>
                    <button onClick={() => removeItem(idx)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* VENDOR/PURCHASE SECTION */}
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-purple-700 dark:text-purple-300 mb-2 uppercase border-b border-purple-200 dark:border-purple-800/40 pb-1 flex items-center gap-1">
                      <Package className="w-3 h-3" /> Purchase from Vendor
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-slate-500">Composition</label>
                      <CompositionAutocomplete
                        value={item.composition}
                        onChange={(value) => handleItemChange(idx, 'composition', value)}
                        placeholder="Generic/Salt"
                        className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-slate-500">Product Name</label>
                      <ProductAutocomplete
                        value={item.product_name}
                        onChange={(value) => handleItemChange(idx, 'product_name', value)}
                        placeholder="Brand Name"
                        className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-slate-500">Manufacturer</label>
                      <input type="text" placeholder="Manufacturer" value={item.manufacturer} onChange={(e) => handleItemChange(idx, 'manufacturer', e.target.value)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-slate-500">HSN Code</label>
                      <input type="text" placeholder="HSN" value={item.hsn_code} onChange={(e) => handleItemChange(idx, 'hsn_code', e.target.value)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-slate-500">Batch Number</label>
                      <input type="text" placeholder="Batch" value={item.batch_number} onChange={(e) => handleItemChange(idx, 'batch_number', e.target.value)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-slate-500">Quantity</label>
                      <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-slate-500">Complementary Quantity (if any)</label>
                      <input type="number" placeholder="Free" value={item.free_quantity} onChange={(e) => handleItemChange(idx, 'free_quantity', parseFloat(e.target.value) || 0)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-slate-500">Package</label>
                      <input type="text" placeholder="10 X 10" value={item.package} onChange={(e) => handleItemChange(idx, 'package', e.target.value)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-slate-500">Unit</label>
                      <UnitAutocomplete
                        value={item.unit}
                        onChange={(value) => handleItemChange(idx, 'unit', value)}
                        placeholder="Select or type unit"
                        className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-slate-500">Manufacturing Date</label>
                      <input type="text" placeholder="MM/YYYY" value={item.manufacturing_date} onChange={(e) => handleItemChange(idx, 'manufacturing_date', e.target.value)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-slate-500">Expiry Date</label>
                      <input type="text" placeholder="MM/YYYY" value={item.expiry_date} onChange={(e) => handleItemChange(idx, 'expiry_date', e.target.value)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                    </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-slate-500">MRP</label>
                        <div className="relative group">
                          <input type="text" placeholder="169.00/STRIP" value={item.mrp || ''} onChange={(e) => handleItemChange(idx, 'mrp', e.target.value)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                          {item.mrp && item.unit_price > 0 && (
                            <div className="absolute hidden group-hover:block z-10 bg-gray-800 text-white text-xs rounded px-2 py-1 -top-8 left-0 whitespace-nowrap">
                              Profit at MRP: {(((parseFloat(item.mrp) - item.unit_price) / item.unit_price) * 100).toFixed(1)}%
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-slate-500">Before Discount</label>
                        <input type="number" placeholder="Before Disc" value={item.before_discount} onChange={(e) => handleItemChange(idx, 'before_discount', parseFloat(e.target.value) || 0)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-slate-500">Discount Percent</label>
                        <input type="number" placeholder="Disc %" value={item.discount_percent} onChange={(e) => handleItemChange(idx, 'discount_percent', parseFloat(e.target.value) || 0)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-slate-500">Discount Amount</label>
                        <input type="number" placeholder="Disc Amt" value={item.discount_amount} onChange={(e) => handleItemChange(idx, 'discount_amount', parseFloat(e.target.value) || 0)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-slate-500">Unit Price (Final)</label>
                        <input type="number" placeholder="Rate" value={item.unit_price} onChange={(e) => handleItemChange(idx, 'unit_price', parseFloat(e.target.value) || 0)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-slate-500">Discount On Purchase</label>
                        <input type="number" placeholder="Disc" value={item.discount_on_purchase} onChange={(e) => handleItemChange(idx, 'discount_on_purchase', parseFloat(e.target.value) || 0)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-slate-500">Taxable Amount</label>
                        <input type="number" placeholder="Taxable" value={item.taxable_amount} onChange={(e) => handleItemChange(idx, 'taxable_amount', parseFloat(e.target.value) || 0)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-slate-500">CGST Percent</label>
                        <input type="number" placeholder="CGST%" value={item.cgst_percent} onChange={(e) => handleItemChange(idx, 'cgst_percent', parseFloat(e.target.value) || 0)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-slate-500">CGST Amount</label>
                        <input type="number" placeholder="CGST Amt" value={item.cgst_amount} onChange={(e) => handleItemChange(idx, 'cgst_amount', parseFloat(e.target.value) || 0)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-slate-500">SGST Percent</label>
                        <input type="number" placeholder="SGST%" value={item.sgst_percent} onChange={(e) => handleItemChange(idx, 'sgst_percent', parseFloat(e.target.value) || 0)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-slate-500">SGST Amount</label>
                        <input type="number" placeholder="SGST Amt" value={item.sgst_amount} onChange={(e) => handleItemChange(idx, 'sgst_amount', parseFloat(e.target.value) || 0)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-slate-500">IGST Percent</label>
                        <input type="number" placeholder="IGST%" value={item.igst_percent} onChange={(e) => handleItemChange(idx, 'igst_percent', parseFloat(e.target.value) || 0)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-slate-500">IGST Amount</label>
                        <input type="number" placeholder="IGST Amt" value={item.igst_amount} onChange={(e) => handleItemChange(idx, 'igst_amount', parseFloat(e.target.value) || 0)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-slate-500">Total Amount</label>
                        <input type="number" placeholder="Total" value={item.total_amount} onChange={(e) => handleItemChange(idx, 'total_amount', parseFloat(e.target.value) || 0)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                      </div>
                    </div>
                  </div>
                  
                  {/* CUSTOMER/SALES SECTION */}
                  <div className="mb-3">
                    <h4 className="text-xs font-bold text-green-700 dark:text-green-300 mb-2 uppercase border-b border-green-200 dark:border-green-800/40 pb-1 flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" /> Sales to Customer (Admin Only)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-slate-500">Selling Price</label>
                      <div className="relative group">
                        <input type="number" placeholder="Selling" value={item.selling_price} onChange={(e) => handleItemChange(idx, 'selling_price', parseFloat(e.target.value) || 0)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" disabled={!isAdmin} />
                        {!isAdmin && (
                          <div className="absolute hidden group-hover:block z-10 bg-gray-800 text-white text-xs rounded px-2 py-1 -top-8 left-0 whitespace-nowrap">
                            Admin access required
                          </div>
                        )}
                      </div>
                      {priceErrors[idx] && <p className="text-xs text-red-600 mt-1">Selling price cannot exceed MRP</p>}
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-slate-500">Profit Margin (%)</label>
                      <div className="relative group">
                        <input type="number" placeholder="Margin" value={item.profit_margin} onChange={(e) => handleItemChange(idx, 'profit_margin', parseFloat(e.target.value) || 0)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" disabled={!isAdmin} />
                        {!isAdmin && (
                          <div className="absolute hidden group-hover:block z-10 bg-gray-800 text-white text-xs rounded px-2 py-1 -top-8 left-0 whitespace-nowrap">
                            Admin access required
                          </div>
                        )}
                      </div>
                    </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-slate-500">Discount On Sales (%)</label>
                        <input type="number" placeholder="Disc %" value={item.discount_on_sales} onChange={(e) => handleItemChange(idx, 'discount_on_sales', parseFloat(e.target.value) || 0)} className="px-2 py-1 border rounded w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" disabled={!isAdmin} />
                        {item.discount_on_sales > 0 && (
                          <p className="text-xs text-green-600 mt-1">
                            Customer pays: ₹{(item.selling_price * (1 - item.discount_on_sales / 100)).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Custom Columns */}
                  {customItemColumns.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-2 uppercase border-b border-blue-200 dark:border-blue-800/40 pb-1 flex items-center gap-1">
                        <Settings className="w-3 h-3" /> Custom Fields
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        {customItemColumns.map(colName => (
                          <div key={colName}>
                            <label className="text-xs text-blue-600 font-semibold">{colName}</label>
                            <input
                              type="text"
                              placeholder={colName}
                              value={item.custom_fields?.[colName] || ''}
                              onChange={(e) => handleItemChange(idx, `custom_${colName}`, e.target.value)}
                              className="px-2 py-1 border border-blue-300 dark:border-blue-700 rounded w-full bg-blue-50 dark:bg-blue-900/20 dark:text-white dark:placeholder-slate-400"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-700/50 p-2 rounded">
                    <span className="font-semibold">Purchase:</span> ₹{item.taxable_amount.toFixed(2)} + GST ₹{(item.cgst_amount + item.sgst_amount).toFixed(2)} = ₹{item.total_amount.toFixed(2)} | 
                    <span className="font-semibold text-green-700">Selling:</span> ₹{item.selling_price.toFixed(2)} ({item.profit_margin.toFixed(1)}% margin)
                    {item.discount_on_sales > 0 && (
                      <span className="text-blue-700"> → Customer: ₹{(item.selling_price * (1 - item.discount_on_sales / 100)).toFixed(2)} (after {item.discount_on_sales}% disc)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t dark:border-slate-700/50 pt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <label className="text-gray-600 dark:text-slate-400">Gross Amount</label>
                <p className="font-bold dark:text-white">₹{formData.gross_amount.toFixed(2)}</p>
              </div>
              <div>
                <label className="text-gray-600 dark:text-slate-400">Total GST</label>
                <p className="font-bold text-blue-600">₹{formData.total_gst.toFixed(2)}</p>
              </div>
              <div>
                <label className="text-gray-600 dark:text-slate-400">Round Off</label>
                <input type="number" step="0.01" value={formData.round_off} onChange={(e) => handleChange('round_off', parseFloat(e.target.value) || 0)} className="w-full px-2 py-1 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
              </div>
              <div>
                <label className="text-gray-600 dark:text-slate-400">Net Amount</label>
                <p className="font-bold text-green-600 text-lg">₹{formData.net_amount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t dark:border-slate-700/50 p-4 flex justify-end gap-3 rounded-b-xl">
          <button onClick={onClose} className="px-6 py-2 border dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/30 dark:text-slate-300">Cancel</button>
          <button onClick={handleSave} disabled={saving || (isDistributorInvoice && !isAdmin && invoice.is_staff_verified && !invoice.is_rejected)} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Processing...' : isDistributorInvoice ? (invoice.is_staff_verified && !invoice.is_rejected && !isAdmin ? 'Already Verified' : isAdmin ? 'Save Changes' : 'Verify Invoice') : invoice.id ? (isAdmin ? 'Save Changes' : 'Save & Verify') : 'Create & Verify'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditInvoice
