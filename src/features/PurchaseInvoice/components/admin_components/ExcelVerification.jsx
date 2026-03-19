import { useState, useEffect } from 'react'
import { Clock, CheckCircle, XCircle, Eye, Edit, FileText, Trash2, Store, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminPurchaseInvoiceAPI } from '../../services/admin_purchase_invoice_apis'
import { staffPurchaseInvoiceAPI } from '../../services/staff_purchase_invoice_apis'
import { adminApi } from '../../../Admin&SuperAdmin/services/admin&superAminApi'
import InvoiceModal from '../shared/InvoiceModal'
import EditInvoice from '../staff_components/EditInvoice'
import DeleteConfirmationModal from '../shared/DeleteConfirmationModal'

const ExcelVerification = () => {
  const [pendingInvoices, setPendingInvoices] = useState(null)
  const [staffPendingInvoices, setStaffPendingInvoices] = useState(null)
  const [approvedInvoices, setApprovedInvoices] = useState(null)
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)

  useEffect(() => {
    fetchShops()
  }, [])

  useEffect(() => {
    if (shops.length > 0) {
      fetchPendingInvoices()
    }
  }, [selectedShop, shops])

  const fetchShops = async () => {
    try {
      const response = await adminApi.getShops()
      setShops(response)
    } catch (error) {
      toast.error('Failed to fetch shops')
    }
  }

  const fetchPendingInvoices = async () => {
    try {
      const params = selectedShop ? { shop_id: selectedShop } : {}
      const response = await adminPurchaseInvoiceAPI.getPendingAdminVerification(params)
      
      let distributorPending = []
      try {
        const distResponse = await adminPurchaseInvoiceAPI.getPendingDistributorInvoices()
        distributorPending = distResponse.data.map(inv => ({
          ...inv,
          supplier_name: inv.distributor?.company_name || 'Distributor',
          total_items: inv.items?.length || 0,
          staff_name: `Imported from ${inv.distributor?.company_name || 'Distributor'}`,
          is_distributor_invoice: true,
          shop_name: 'Shop',
          days_pending: Math.floor((new Date() - new Date(inv.staff_verified_at || inv.created_at)) / (1000 * 60 * 60 * 24))
        }))
      } catch (err) {
        console.log('No distributor invoices pending:', err)
      }
      
      const allPending = [...response.data.invoices, ...distributorPending]
      setPendingInvoices({
        total_pending: response.data.total_pending + distributorPending.length,
        total_value: response.data.total_value + distributorPending.reduce((sum, inv) => sum + inv.net_amount, 0),
        invoices: allPending
      })
      
      const staffResponse = await adminPurchaseInvoiceAPI.getPendingStaffVerification(params)
      setStaffPendingInvoices(staffResponse.data)
      
      const approvedResponse = await adminPurchaseInvoiceAPI.getAdminInvoices({ ...params, limit: 50 })
      const approved = approvedResponse.data.filter(inv => inv.is_admin_verified)
      
      let approvedDistributor = []
      try {
        const distApprovedResponse = await adminPurchaseInvoiceAPI.getApprovedDistributorInvoices({ limit: 50 })
        approvedDistributor = distApprovedResponse.data
      } catch (err) {
        console.log('No approved distributor invoices:', err)
      }
      
      setApprovedInvoices([...approved, ...approvedDistributor])
    } catch (error) {
      toast.error('Failed to fetch pending invoices')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 p-4">
        <div className="flex items-center gap-3">
          <Store className="w-5 h-5 text-gray-600 dark:text-slate-400" />
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Filter by Shop:</label>
          <select
            value={selectedShop || ''}
            onChange={(e) => setSelectedShop(e.target.value ? parseInt(e.target.value) : null)}
            className="flex-1 max-w-xs px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Shops</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.shop_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {pendingInvoices && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/40 rounded-xl p-4">
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">Awaiting Admin Approval</p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{pendingInvoices.total_pending}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/40 rounded-xl p-4">
            <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">Total Value</p>
            <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">₹{pendingInvoices.total_value.toLocaleString()}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-xl p-4">
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Staff Verification Pending</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{staffPendingInvoices?.total_pending || 0}</p>
          </div>
        </div>
      )}

      {pendingInvoices?.invoices?.length > 0 ? (
        <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Invoices Awaiting Admin Verification</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {pendingInvoices.invoices.map((invoice) => (
              <PendingInvoiceCard key={invoice.id} invoice={invoice} onAction={fetchPendingInvoices} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 p-12 text-center">
          <Clock className="w-16 h-16 mx-auto text-gray-300 dark:text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-slate-400 mb-2">All Caught Up!</h3>
          <p className="text-gray-500 dark:text-slate-500">No invoices pending admin verification.</p>
        </div>
      )}

      {staffPendingInvoices?.invoices?.length > 0 && (
        <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Invoices Awaiting Staff Verification</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {staffPendingInvoices.invoices.map((invoice) => (
              <StaffPendingInvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
        </div>
      )}

      {approvedInvoices?.length > 0 && (
        <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            Approved Invoices ({approvedInvoices.length})
          </h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {approvedInvoices.map((invoice) => (
              <ApprovedInvoiceCard key={invoice.id} invoice={invoice} onDelete={fetchPendingInvoices} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const PendingInvoiceCard = ({ invoice, onAction }) => {
  const [processing, setProcessing] = useState(false)
  const [viewing, setViewing] = useState(false)
  const [editing, setEditing] = useState(false)
  const [invoiceDetails, setInvoiceDetails] = useState(null)
  const [showRejectConfirm, setShowRejectConfirm] = useState(false)

  const handleApprove = async () => {
    setProcessing(true)
    try {
      if (invoice.is_distributor_invoice) {
        await adminPurchaseInvoiceAPI.adminVerifyDistributorInvoice(invoice.id)
      } else {
        await adminPurchaseInvoiceAPI.adminVerifyInvoice(invoice.id)
      }
      toast.success('Invoice approved and synced to stock!')
      onAction()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to approve invoice')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    setProcessing(true)
    try {
      if (invoice.is_distributor_invoice) {
        await adminPurchaseInvoiceAPI.adminRejectDistributorInvoice(invoice.id)
      } else {
        await adminPurchaseInvoiceAPI.adminRejectInvoice(invoice.id)
      }
      toast.success('Invoice rejected and sent back to staff')
      onAction()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to reject invoice')
    } finally {
      setProcessing(false)
      setShowRejectConfirm(false)
    }
  }

  const handleView = async () => {
    try {
      const response = invoice.is_distributor_invoice
        ? await adminPurchaseInvoiceAPI.getDistributorInvoiceAdmin(invoice.id)
        : await staffPurchaseInvoiceAPI.getInvoice(invoice.id)
      setInvoiceDetails(response.data)
      setViewing(true)
    } catch (error) {
      toast.error('Failed to fetch invoice details')
    }
  }

  const handleEdit = async () => {
    try {
      const response = invoice.is_distributor_invoice
        ? await adminPurchaseInvoiceAPI.getDistributorInvoiceAdmin(invoice.id)
        : await staffPurchaseInvoiceAPI.getInvoice(invoice.id)
      const invoiceData = response.data
      if (invoice.is_distributor_invoice) {
        invoiceData.is_distributor_invoice = true
      }
      setInvoiceDetails(invoiceData)
      setEditing(true)
    } catch (error) {
      toast.error('Failed to fetch invoice details')
    }
  }

  return (
    <>
      <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-2 border-orange-200 dark:border-orange-800/40 hover:shadow-md transition-all">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-bold text-gray-800 dark:text-white">{invoice.invoice_number}</p>
              <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-xs rounded-full font-semibold">
                Awaiting Admin Approval
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-slate-300 font-medium">{invoice.supplier_name}</p>
            <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">Shop: {invoice.shop_name}</p>
            <p className="text-xs text-gray-600 dark:text-slate-400 mt-1">Uploaded by: {invoice.staff_name}</p>
            {invoice.staff_verified_by_name && (
              <p className="text-xs text-green-600 dark:text-green-400">Verified by: {invoice.staff_verified_by_name}</p>
            )}
          </div>
          <div className="text-right ml-4">
            <p className="text-lg font-bold text-green-600 dark:text-green-400">₹{invoice.net_amount.toLocaleString()}</p>
            <p className="text-xs text-gray-500 dark:text-slate-500">{invoice.total_items} items</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-400 mt-2 pt-2 border-t border-orange-200 dark:border-orange-800/40">
          <span>Invoice Date: {new Date(invoice.invoice_date).toLocaleDateString()}</span>
          <span className="text-orange-600 dark:text-orange-400 font-semibold">
            Pending {invoice.days_pending} day{invoice.days_pending !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleEdit}
            className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={handleView}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={handleApprove}
            disabled={processing}
            className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            {processing ? 'Processing...' : 'Approve'}
          </button>
          <button
            onClick={() => setShowRejectConfirm(true)}
            disabled={processing}
            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
            Reject
          </button>
        </div>
      </div>

      {viewing && invoiceDetails && (
        <InvoiceModal invoice={invoiceDetails} onClose={() => setViewing(false)} />
      )}

      {editing && invoiceDetails && (
        <EditInvoice
          invoice={invoiceDetails}
          onClose={() => setEditing(false)}
          onSave={() => {
            setEditing(false)
            onAction()
          }}
          isAdmin={true}
        />
      )}

      {showRejectConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Reject Invoice?</h3>
            </div>
            <p className="text-gray-600 dark:text-slate-400 mb-6">
              This invoice will be sent back to staff for corrections.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectConfirm(false)}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {processing ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const StaffPendingInvoiceCard = ({ invoice }) => {
  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800/40">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-bold text-gray-800 dark:text-white">{invoice.invoice_number}</p>
            <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 text-xs rounded-full font-semibold">
              Awaiting Staff Verification
            </span>
          </div>
          <p className="text-sm text-gray-700 dark:text-slate-300 font-medium">{invoice.supplier_name}</p>
          <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
            Shop: {invoice.shop_name} • Uploaded by: {invoice.staff_name}
          </p>
        </div>
        <div className="text-right ml-4">
          <p className="text-lg font-bold text-green-600 dark:text-green-400">₹{invoice.net_amount.toLocaleString()}</p>
          <p className="text-xs text-gray-500 dark:text-slate-500">{invoice.total_items} items</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-400 mt-2 pt-2 border-t border-blue-200 dark:border-blue-800/40">
        <span>Invoice Date: {new Date(invoice.invoice_date).toLocaleDateString()}</span>
        <span className="text-blue-600 dark:text-blue-400 font-semibold">
          Uploaded {invoice.days_pending} day{invoice.days_pending !== 1 ? 's' : ''} ago
        </span>
      </div>
    </div>
  )
}

const ApprovedInvoiceCard = ({ invoice, onDelete }) => {
  const [viewing, setViewing] = useState(false)
  const [editing, setEditing] = useState(false)
  const [invoiceDetails, setInvoiceDetails] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleView = async () => {
    try {
      const response = invoice.is_distributor_invoice
        ? await adminPurchaseInvoiceAPI.getDistributorInvoiceAdmin(invoice.id)
        : await staffPurchaseInvoiceAPI.getInvoice(invoice.id)
      setInvoiceDetails(response.data)
      setViewing(true)
    } catch (error) {
      toast.error('Failed to fetch invoice details')
    }
  }

  const handleEdit = async () => {
    try {
      const response = invoice.is_distributor_invoice
        ? await adminPurchaseInvoiceAPI.getDistributorInvoiceAdmin(invoice.id)
        : await staffPurchaseInvoiceAPI.getInvoice(invoice.id)
      const invoiceData = response.data
      if (invoice.is_distributor_invoice) {
        invoiceData.is_distributor_invoice = true
      }
      setInvoiceDetails(invoiceData)
      setEditing(true)
    } catch (error) {
      toast.error('Failed to fetch invoice details')
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminPurchaseInvoiceAPI.adminDeleteInvoice(invoice.id)
      toast.success('Invoice deleted successfully')
      setShowDeleteModal(false)
      if (onDelete) onDelete()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete invoice')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 hover:shadow-xl transition-all">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
              <FileText className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
              <h3 className="font-bold text-base md:text-lg text-gray-800 dark:text-white">{invoice.invoice_number}</h3>
              <span className="flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" />
                Admin Verified
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-slate-400">
              <p className="font-medium dark:text-slate-300">{invoice.supplier_name}</p>
              <p className="text-xs mt-1">
                {invoice.total_items} items • ₹{invoice.net_amount.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="p-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={handleView}
              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            {!invoice.is_distributor_invoice && (
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={deleting}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {viewing && invoiceDetails && (
        <InvoiceModal invoice={invoiceDetails} onClose={() => setViewing(false)} />
      )}

      {editing && invoiceDetails && (
        <EditInvoice
          invoice={invoiceDetails}
          onClose={() => setEditing(false)}
          onSave={() => {
            setEditing(false)
            if (onDelete) onDelete()
          }}
          isAdmin={true}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          invoice={invoice}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  )
}

export default ExcelVerification
