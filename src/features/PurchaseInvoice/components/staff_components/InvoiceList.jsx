import React, { useState, useEffect } from 'react'
import { FileText, Eye, Trash2, Search, Calendar, IndianRupee, Package, Edit, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { staffPurchaseInvoiceAPI } from '../../services/staff_purchase_invoice_apis'
import EditInvoice from './EditInvoice'
import FieldsGuideModal from '../shared/FieldsGuideModal'
import InvoiceModal from '../shared/InvoiceModal'
import DeleteConfirmationModal from '../shared/DeleteConfirmationModal'

const InvoiceList = ({ refresh }) => {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [editingInvoice, setEditingInvoice] = useState(null)
  const [deletingInvoice, setDeletingInvoice] = useState(null)

  useEffect(() => {
    fetchInvoices()
  }, [refresh])

  const fetchInvoices = async () => {
    try {
      // Fetch regular purchase invoices
      const response = await staffPurchaseInvoiceAPI.getInvoices({ limit: 50 })
      
      // Fetch distributor invoices for this shop
      let distributorInvoices = []
      try {
        const distResponse = await staffPurchaseInvoiceAPI.getDistributorInvoices()
        distributorInvoices = distResponse.data.map(inv => ({
          ...inv,
          supplier_name: inv.distributor?.company_name || 'Distributor',
          total_items: inv.items?.length || 0,
          staff_name: `Imported from ${inv.distributor?.company_name || 'Distributor'}`,
          is_distributor_invoice: true
        }))
      } catch (err) {
        console.log('No distributor invoices or error fetching:', err)
      }
      
      // Combine both types of invoices
      const allInvoices = [...response.data, ...distributorInvoices]
      // Sort by created_at descending (most recently uploaded first)
      allInvoices.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      
      setInvoices(allInvoices)
    } catch (error) {
      toast.error('Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }

  const handleView = async (id, isDistributor) => {
    try {
      const response = isDistributor 
        ? await staffPurchaseInvoiceAPI.getDistributorInvoice(id)
        : await staffPurchaseInvoiceAPI.getInvoice(id)
      setSelectedInvoice(response.data)
    } catch (error) {
      toast.error('Failed to fetch invoice details')
    }
  }

  const handleEdit = async (id, isDistributor) => {
    const invoice = invoices.find(inv => inv.id === id)
    
    // Check if admin verified
    if (invoice?.is_admin_verified) {
      toast.error('This invoice is already approved by admin. Contact admin to make changes.', {
        duration: 4000,
        icon: '🔒'
      })
      return
    }
    
    try {
      const response = isDistributor
        ? await staffPurchaseInvoiceAPI.getDistributorInvoice(id)
        : await staffPurchaseInvoiceAPI.getInvoice(id)
      setEditingInvoice({ ...response.data, is_distributor_invoice: isDistributor })
    } catch (error) {
      toast.error('Failed to fetch invoice details')
    }
  }

  const handleDelete = async (id, isDistributor) => {
    if (isDistributor) {
      toast.error('Distributor invoices cannot be deleted. Contact the distributor.', {
        duration: 4000,
        icon: <AlertCircle className="w-4 h-4" />
      })
      return
    }
    const invoice = invoices.find(inv => inv.id === id)
    setDeletingInvoice(invoice)
  }

  const confirmDelete = async () => {
    if (!deletingInvoice) return
    
    try {
      const response = await staffPurchaseInvoiceAPI.deleteInvoice(deletingInvoice.id)
      if (response.data.stock_reversed) {
        toast.success('Invoice deleted and stock quantities reversed')
      } else {
        toast.success('Invoice deleted successfully')
      }
      setDeletingInvoice(null)
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
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
            <input
              type="text"
              placeholder="Search by invoice number or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm md:text-base"
            />
          </div>
          <FieldsGuideModal />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredInvoices.map((invoice) => (
          <div key={invoice.id} className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                  <FileText className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                  <h3 className="font-bold text-base md:text-lg text-gray-800">{invoice.invoice_number}</h3>
                  {invoice.is_admin_verified ? (
                    <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Admin Verified
                    </span>
                  ) : invoice.is_rejected || invoice.admin_rejected_by_name ? (
                    <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full animate-pulse">
                      <AlertCircle className="w-3 h-3" />
                      Rejected - Reverify
                    </span>
                  ) : invoice.is_staff_verified ? (
                    <span className="flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full animate-pulse">
                      <AlertCircle className="w-3 h-3" />
                      Awaiting Admin Approval
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full animate-pulse">
                      <AlertCircle className="w-3 h-3" />
                      Staff Verification Required
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 text-xs md:text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                    {new Date(invoice.invoice_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="w-3 h-3 md:w-4 md:h-4" />
                    {invoice.total_items} items
                  </div>
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <IndianRupee className="w-3 h-3 md:w-4 md:h-4" />
                    ₹{invoice.net_amount.toFixed(2)}
                  </div>
                  <div className="text-gray-700 font-medium">
                    {invoice.supplier_name}
                  </div>
                </div>
                <div className="mt-2 text-[10px] md:text-xs text-gray-500">
                  Uploaded by: {invoice.staff_name}
                  {invoice.staff_verified_by_name && (
                    <span className="ml-2 md:ml-3 text-green-600">
                      • Verified by: {invoice.staff_verified_by_name}
                    </span>
                  )}
                  {invoice.admin_verified_by_name && (
                    <span className="ml-2 md:ml-3 text-blue-600">
                      • Approved by: {invoice.admin_verified_by_name}
                    </span>
                  )}
                  {invoice.admin_rejected_by_name && (
                    <span className="ml-2 md:ml-3 text-red-600">
                      • Rejected by: {invoice.admin_rejected_by_name}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(invoice.id, invoice.is_distributor_invoice)}
                  className={`p-2 rounded-lg transition-colors ${
                    invoice.is_admin_verified 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-orange-600 hover:bg-orange-50'
                  }`}
                  title={invoice.is_admin_verified ? 'Already approved - Contact admin' : invoice.is_distributor_invoice ? 'Verify Invoice' : 'Edit & Verify'}
                >
                  <Edit className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  onClick={() => handleView(invoice.id, invoice.is_distributor_invoice)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                {!invoice.is_staff_verified && !invoice.is_distributor_invoice && (
                  <button
                    onClick={() => handleDelete(invoice.id, invoice.is_distributor_invoice)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredInvoices.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 text-center py-8 md:py-12 text-gray-500">
          <FileText className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-sm md:text-base">No invoices found</p>
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

      {deletingInvoice && (
        <DeleteConfirmationModal
          invoice={deletingInvoice}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingInvoice(null)}
        />
      )}
    </div>
  )
}

export default InvoiceList
