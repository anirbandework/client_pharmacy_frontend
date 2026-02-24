import React, { useState, useEffect } from 'react'
import { FileText, Eye, Trash2, Search, Calendar, DollarSign, Package, Edit, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { purchaseInvoiceAPI } from '../services/api'
import EditInvoice from './EditInvoice'

const InvoiceList = ({ refresh }) => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [editingInvoice, setEditingInvoice] = useState(null)

  useEffect(() => {
    fetchInvoices()
  }, [refresh])

  const fetchInvoices = async () => {
    try {
      const response = await purchaseInvoiceAPI.getInvoices({ limit: 100 })
      setInvoices(response.data)
    } catch (error) {
      toast.error('Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }

  const handleView = async (id) => {
    try {
      const response = await purchaseInvoiceAPI.getInvoice(id)
      setSelectedInvoice(response.data)
    } catch (error) {
      toast.error('Failed to fetch invoice details')
    }
  }

  const handleEdit = async (id) => {
    try {
      const response = await purchaseInvoiceAPI.getInvoice(id)
      setEditingInvoice(response.data)
    } catch (error) {
      toast.error('Failed to fetch invoice details')
    }
  }

  const handleDelete = async (id) => {
    const invoice = invoices.find(inv => inv.id === id)
    
    // Enhanced warning for verified invoices
    const confirmMessage = invoice?.is_verified 
      ? `⚠️ WARNING: This invoice is VERIFIED and synced to stock!\n\nDeleting will:\n• Remove ${invoice.total_items} items from stock\n• Reverse quantities in inventory\n• Cannot be undone\n\nAre you absolutely sure?`
      : 'Are you sure you want to delete this invoice?'
    
    if (!confirm(confirmMessage)) return
    
    try {
      const response = await purchaseInvoiceAPI.deleteInvoice(id)
      if (response.data.stock_reversed) {
        toast.success('Invoice deleted and stock quantities reversed')
      } else {
        toast.success('Invoice deleted successfully')
      }
      fetchInvoices()
    } catch (error) {
      toast.error('Failed to delete invoice')
    }
  }

  const filteredInvoices = invoices.filter(inv =>
    inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by invoice number or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredInvoices.map((invoice) => (
          <div key={invoice.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <h3 className="font-bold text-lg text-gray-800">{invoice.invoice_number}</h3>
                  {invoice.is_verified ? (
                    <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full animate-pulse">
                      <AlertCircle className="w-3 h-3" />
                      Verification Required
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(invoice.invoice_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="w-4 h-4" />
                    {invoice.total_items} items
                  </div>
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    ₹{invoice.net_amount.toFixed(2)}
                  </div>
                  <div className="text-gray-700 font-medium">
                    {invoice.supplier_name}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Uploaded by: {invoice.staff_name}
                  {invoice.is_verified && invoice.verified_by_name && (
                    <span className="ml-3 text-green-600">
                      • Verified by: {invoice.verified_by_name}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(invoice.id)}
                  className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  title="Edit & Verify"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleView(invoice.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(invoice.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>No invoices found</p>
        </div>
      )}

      {selectedInvoice && (
        <InvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}

      {editingInvoice && (
        <EditInvoice 
          invoice={editingInvoice} 
          onClose={() => setEditingInvoice(null)}
          onSave={() => {
            setEditingInvoice(null)
            fetchInvoices()
          }}
        />
      )}
    </div>
  )
}

const InvoiceModal = ({ invoice, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Invoice Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Supplier & Invoice Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Supplier Information
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {invoice.supplier_name}</p>
                {invoice.supplier_gstin && <p><strong>GSTIN:</strong> {invoice.supplier_gstin}</p>}
                {invoice.supplier_phone && <p><strong>Phone:</strong> {invoice.supplier_phone}</p>}
                {invoice.supplier_dl_numbers && <p><strong>DL Numbers:</strong> {invoice.supplier_dl_numbers}</p>}
                {invoice.supplier_address && <p><strong>Address:</strong> {invoice.supplier_address}</p>}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Invoice Information
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>Invoice Number:</strong> {invoice.invoice_number}</p>
                <p><strong>Invoice Date:</strong> {new Date(invoice.invoice_date).toLocaleDateString()}</p>
                {invoice.due_date && <p><strong>Due Date:</strong> {new Date(invoice.due_date).toLocaleDateString()}</p>}
                <p><strong>Uploaded By:</strong> {invoice.staff_name}</p>
                {invoice.is_verified ? (
                  <div className="mt-2 pt-2 border-t">
                    <p className="flex items-center gap-1 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <strong>Verified By:</strong> {invoice.verified_by_name || 'Staff'}
                    </p>
                    {invoice.verified_at && (
                      <p className="text-gray-600 text-xs mt-1">
                        {new Date(invoice.verified_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-2 pt-2 border-t">
                    <p className="flex items-center gap-1 text-orange-600">
                      <AlertCircle className="w-4 h-4" />
                      <strong>Status:</strong> Not Verified
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Financial Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Gross Amount</p>
                <p className="text-lg font-bold">₹{invoice.gross_amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Discount</p>
                <p className="text-lg font-bold text-orange-600">₹{invoice.discount_amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Total GST</p>
                <p className="text-lg font-bold text-blue-600">₹{invoice.total_gst.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Net Amount</p>
                <p className="text-xl font-bold text-green-600">₹{invoice.net_amount.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-300 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Taxable Amount</p>
                <p className="font-semibold">₹{invoice.taxable_amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Round Off</p>
                <p className="font-semibold">₹{invoice.round_off.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Items ({invoice.items.length})
            </h3>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">#</th>
                    <th className="px-3 py-2 text-left">Product Name</th>
                    <th className="px-3 py-2 text-left">Mfg</th>
                    <th className="px-3 py-2 text-left">HSN</th>
                    <th className="px-3 py-2 text-left">Batch</th>
                    <th className="px-3 py-2 text-right">Qty</th>
                    <th className="px-3 py-2 text-left">Pkg</th>
                    <th className="px-3 py-2 text-left">Expiry</th>
                    <th className="px-3 py-2 text-right">MRP</th>
                    <th className="px-3 py-2 text-right">Rate</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                    <th className="px-3 py-2 text-right">CGST</th>
                    <th className="px-3 py-2 text-right">SGST</th>
                    <th className="px-3 py-2 text-right">Total</th>
                    {/* Custom columns */}
                    {(() => {
                      const customCols = new Set()
                      invoice.items.forEach(item => {
                        if (item.custom_fields) {
                          Object.keys(item.custom_fields).forEach(key => customCols.add(key))
                        }
                      })
                      return Array.from(customCols).map(col => (
                        <th key={col} className="px-3 py-2 text-left bg-blue-50 text-blue-700">{col}</th>
                      ))
                    })()}
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, idx) => {
                    const customCols = new Set()
                    invoice.items.forEach(i => {
                      if (i.custom_fields) {
                        Object.keys(i.custom_fields).forEach(key => customCols.add(key))
                      }
                    })
                    return (
                      <tr key={idx} className="border-t hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-500">{idx + 1}</td>
                        <td className="px-3 py-2 font-medium">{item.product_name}</td>
                        <td className="px-3 py-2 text-gray-600">{item.manufacturer || '-'}</td>
                        <td className="px-3 py-2 text-gray-600">{item.hsn_code || '-'}</td>
                        <td className="px-3 py-2 text-gray-600">{item.batch_number || '-'}</td>
                        <td className="px-3 py-2 text-right">{item.quantity}</td>
                        <td className="px-3 py-2 text-gray-600">{item.package || '-'}</td>
                        <td className="px-3 py-2 text-gray-600">{item.expiry_date ? (() => {
                          // Check if we have a full date or just MM/YYYY
                          const date = new Date(item.expiry_date)
                          // If day is 1st, likely stored as MM/YYYY, show as MM/YYYY
                          if (date.getDate() === 1) {
                            const month = String(date.getMonth() + 1).padStart(2, '0')
                            const year = date.getFullYear()
                            return `${month}/${year}`
                          }
                          // Otherwise show full date
                          return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')
                        })() : '-'}</td>
                        <td className="px-3 py-2 text-right font-semibold text-purple-700">{item.mrp || '-'}</td>
                        <td className="px-3 py-2 text-right">₹{item.unit_price.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right">₹{item.taxable_amount.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right text-blue-600">
                          {item.cgst_percent}%<br/>
                          ₹{item.cgst_amount.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-right text-blue-600">
                          {item.sgst_percent}%<br/>
                          ₹{item.sgst_amount.toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-right font-bold text-green-600">₹{item.total_amount.toFixed(2)}</td>
                        {/* Custom field values */}
                        {Array.from(customCols).map(col => (
                          <td key={col} className="px-3 py-2 bg-blue-50 text-blue-900 font-medium">
                            {item.custom_fields?.[col] || '-'}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot className="bg-gray-50 font-bold">
                  <tr className="border-t-2">
                    <td colSpan="10" className="px-3 py-2 text-right">Totals:</td>
                    <td className="px-3 py-2 text-right">₹{invoice.taxable_amount.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right text-blue-600">
                      ₹{invoice.items.reduce((sum, item) => sum + item.cgst_amount, 0).toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right text-blue-600">
                      ₹{invoice.items.reduce((sum, item) => sum + item.sgst_amount, 0).toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right text-green-600">₹{invoice.net_amount.toFixed(2)}</td>
                    {/* Empty cells for custom columns */}
                    {(() => {
                      const customCols = new Set()
                      invoice.items.forEach(item => {
                        if (item.custom_fields) {
                          Object.keys(item.custom_fields).forEach(key => customCols.add(key))
                        }
                      })
                      return Array.from(customCols).map(col => <td key={col}></td>)
                    })()}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceList
