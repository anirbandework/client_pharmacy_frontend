import { useState, useEffect } from 'react'
import { Upload, Eye, Check, X, Edit, Trash2, Clock, User, AlertCircle, CheckCircle, Shield, Search, Loader2 } from 'lucide-react'
import { adminStockAuditAPI } from '../../services/admin_stock_audit_apis'
import toast from 'react-hot-toast'
import Pagination from '../shared/Pagination'

const PER_PAGE = 20

const ExcelVerification = ({ selectedShop }) => {
  const [uploads, setUploads] = useState([])
  const [uploadsPage, setUploadsPage] = useState(1)
  const [uploadsTotalPages, setUploadsTotalPages] = useState(1)
  const [uploadsTotal, setUploadsTotal] = useState(0)
  const [selectedUpload, setSelectedUpload] = useState(null)
  const [uploadItems, setUploadItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [sections, setSections] = useState([])
  const [racks, setRacks] = useState([])
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeleteItemModal, setShowDeleteItemModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [approveNotes, setApproveNotes] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [approvingUpload, setApprovingUpload] = useState(false)
  const [rejectingUpload, setRejectingUpload] = useState(false)
  const [deletingUpload, setDeletingUpload] = useState(false)
  const [updatingItem, setUpdatingItem] = useState(false)
  const [deletingItem, setDeletingItem] = useState(false)
  const [reviewingUpload, setReviewingUpload] = useState(new Set())

  useEffect(() => {
    fetchSections()
    fetchRacks()
  }, [])

  useEffect(() => {
    setUploadsPage(1)
    fetchUploads(1)
  }, [statusFilter, selectedShop, searchTerm])

  useEffect(() => {
    fetchUploads(uploadsPage)
  }, [uploadsPage])

  const fetchUploads = async (page = 1) => {
    try {
      const params = { page, per_page: PER_PAGE }
      if (statusFilter !== 'all') params.status = statusFilter
      if (selectedShop) params.shop_id = selectedShop
      if (searchTerm) params.search = searchTerm
      const response = await adminStockAuditAPI.getAdminExcelUploads(params)
      setUploads(response.data.items)
      setUploadsTotal(response.data.total)
      setUploadsTotalPages(response.data.pages)
    } catch (error) {
      console.error('Error fetching uploads:', error)
    }
  }

  const fetchSections = async () => {
    try {
      const response = await adminStockAuditAPI.getAdminSections()
      setSections(response.data)
    } catch (error) {
      console.error('Error fetching sections:', error)
    }
  }

  const fetchRacks = async () => {
    try {
      const response = await adminStockAuditAPI.getAdminRacks()
      setRacks(response.data)
    } catch (error) {
      console.error('Error fetching racks:', error)
    }
  }

  const fetchUploadItems = async (uploadId) => {
    try {
      setLoading(true)
      const response = await adminStockAuditAPI.getAdminUploadItems(uploadId)
      setUploadItems(response.data.items)
      setSelectedUpload(response.data.upload)
    } catch (error) {
      console.error('Error fetching upload items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdminVerify = async (uploadId, notes) => {
    setApprovingUpload(true)
    try {
      await adminStockAuditAPI.adminVerifyUpload(uploadId, notes)
      setSelectedUpload(null)
      setUploadsPage(1)
      fetchUploads(1)
      setShowApproveModal(false)
      setApproveNotes('')
      toast.success('Upload approved and items added to inventory')
    } catch (error) {
      console.error('Error approving upload:', error)
      toast.error('Error approving upload')
    } finally {
      setApprovingUpload(false)
    }
  }

  const handleReject = async (uploadId, reason) => {
    setRejectingUpload(true)
    try {
      await adminStockAuditAPI.rejectUpload(uploadId, reason)
      setSelectedUpload(null)
      setUploadsPage(1)
      fetchUploads(1)
      setShowRejectModal(false)
      setRejectReason('')
      toast.success('Upload rejected')
    } catch (error) {
      console.error('Error rejecting upload:', error)
      toast.error('Error rejecting upload')
    } finally {
      setRejectingUpload(false)
    }
  }

  const handleDeleteUpload = async (uploadId) => {
    setDeletingUpload(true)
    try {
      await adminStockAuditAPI.deleteUpload(uploadId)
      setUploadsPage(1)
      fetchUploads(1)
      if (selectedUpload?.id === uploadId) {
        setSelectedUpload(null)
      }
      setShowDeleteModal(false)
      setDeleteTarget(null)
      toast.success('Upload deleted successfully')
    } catch (error) {
      console.error('Error deleting upload:', error)
      toast.error('Error deleting upload')
    } finally {
      setDeletingUpload(false)
    }
  }

  const handleUpdateItem = async (itemId, itemData) => {
    setUpdatingItem(true)
    try {
      await adminStockAuditAPI.updateUploadItem(selectedUpload.id, itemId, itemData)
      fetchUploadItems(selectedUpload.id)
      setEditingItem(null)
      toast.success('Item updated successfully')
    } catch (error) {
      console.error('Error updating item:', error)
      toast.error('Error updating item')
    } finally {
      setUpdatingItem(false)
    }
  }

  const handleDeleteItem = async (itemId) => {
    setDeletingItem(true)
    try {
      await adminStockAuditAPI.deleteUploadItem(selectedUpload.id, itemId)
      fetchUploadItems(selectedUpload.id)
      setShowDeleteItemModal(false)
      setDeleteTarget(null)
      toast.success('Item deleted successfully')
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('Error deleting item')
    } finally {
      setDeletingItem(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_staff_verification: { color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300', icon: Clock, text: 'Pending Staff Verification' },
      pending_admin_verification: { color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300', icon: Clock, text: 'Pending Admin Verification' },
      approved: { color: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300', icon: CheckCircle, text: 'Approved' },
      rejected: { color: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300', icon: X, text: 'Rejected' }
    }

    const config = statusConfig[status] || statusConfig.pending_staff_verification
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </span>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  if (selectedUpload) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedUpload(null)}
            className="text-white hover:text-gray-200 font-medium"
          >
            ← Back to Uploads
          </button>
          <div className="flex items-center gap-4">
            {getStatusBadge(selectedUpload.status)}
            {selectedUpload.status === 'pending_admin_verification' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowApproveModal(true)}
                  disabled={approvingUpload}
                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {approvingUpload ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {approvingUpload ? 'Approving...' : 'Approve & Add to Inventory'}
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={rejectingUpload}
                  className="px-4 py-2 bg-gradient-to-r from-red-400 to-rose-400 text-white rounded-lg hover:from-red-500 hover:to-rose-500 flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {rejectingUpload ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  {rejectingUpload ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            )}
            <button
              onClick={() => {
                setDeleteTarget(selectedUpload.id)
                setShowDeleteModal(true)
              }}
              disabled={deletingUpload}
              className="px-4 py-2 bg-gradient-to-r from-red-400 to-rose-400 text-white rounded-lg hover:from-red-500 hover:to-rose-500 flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deletingUpload ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {deletingUpload ? 'Deleting...' : 'Delete Upload'}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/80 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700/50">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
            <Shield className="w-5 h-5 text-blue-600" />
            Admin Review: {selectedUpload.filename}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-800 dark:text-slate-300">
            <div><strong>Uploaded by:</strong> {selectedUpload.uploaded_by}</div>
            <div><strong>Upload Date:</strong> {formatDate(selectedUpload.uploaded_at)}</div>
            <div><strong>Status:</strong> {getStatusBadge(selectedUpload.status)}</div>
            <div><strong>Total Items:</strong> {uploadItems.length}</div>
          </div>

          {selectedUpload.upload_notes && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/40">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-medium mb-1">
                <AlertCircle className="w-4 h-4" />
                Upload Notes
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">{selectedUpload.upload_notes}</p>
            </div>
          )}

          {selectedUpload.staff_verified && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/40">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-300 font-medium">
                <CheckCircle className="w-4 h-4" />
                Staff Verified by {selectedUpload.staff_verified_by}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                {formatDate(selectedUpload.staff_verified_at)}
              </div>
              {selectedUpload.staff_notes && (
                <div className="text-sm text-green-700 dark:text-green-300 mt-2">
                  <strong>Staff Notes:</strong> {selectedUpload.staff_notes}
                </div>
              )}
            </div>
          )}

          {selectedUpload.admin_notes && (
            <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800/40">
              <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 font-medium mb-1">
                <Shield className="w-4 h-4" />
                Admin Approval Notes
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300">{selectedUpload.admin_notes}</p>
            </div>
          )}

          {selectedUpload.status === 'rejected' && selectedUpload.rejection_reason && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/40">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-300 font-medium mb-1">
                <X className="w-4 h-4" />
                Rejection Reason
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">{selectedUpload.rejection_reason}</p>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-600 dark:text-slate-400">Loading items...</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-100/80 via-sky-100/80 to-cyan-100/80 dark:from-slate-700/50 dark:via-slate-700/50 dark:to-slate-700/50 backdrop-blur-sm border-b border-blue-200/50 dark:border-slate-600">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Composition</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Mfg</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Batch</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Expiry</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Purchase ₹</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Selling ₹</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Margin %</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Section</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-100 dark:divide-slate-700">
                {uploadItems.map((item, idx) => (
                  <tr key={item.id} className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-slate-700/30 dark:hover:to-slate-700/30 hover:shadow-sm ${idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/50 dark:bg-slate-800/60'}`}>
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
                            ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800/40'
                            : new Date(item.expiry_date) < new Date(Date.now() + 30*24*60*60*1000)
                            ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 border border-orange-200 dark:border-orange-800/40'
                            : 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800/40'
                        }`}>
                          {new Date(item.expiry_date).toLocaleDateString()}
                        </span>
                      ) : <span className="text-gray-400 dark:text-slate-500">-</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900 dark:text-white text-lg">{item.quantity_software}</span>
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
                          item.profit_margin < 10 ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40' :
                          item.profit_margin < 20 ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/40' :
                          item.profit_margin < 30 ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/40' :
                          'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40'
                        }`}>
                          {item.profit_margin.toFixed(1)}%
                        </span>
                      ) : <span className="text-gray-400 dark:text-slate-500">-</span>}
                    </td>
                    <td className="px-6 py-4">
                      {item.section_name ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                          {item.rack_name} - {item.section_name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 border border-orange-200 dark:border-orange-800/40">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.status === 'approved' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' :
                        item.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300' :
                        'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                      }`}>
                        {item.status === 'pending' ? 'Pending' : item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-blue-200 dark:border-blue-800/40 hover:border-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteTarget(item.id)
                            setShowDeleteItemModal(true)
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-red-200 dark:border-red-800/40 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editingItem && (
          <EditItemModal
            item={editingItem}
            sections={sections}
            racks={racks}
            onSave={handleUpdateItem}
            onClose={() => setEditingItem(null)}
          />
        )}

        {showApproveModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-full max-w-md border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                <Check className="w-5 h-5 text-green-600" />
                Approve Upload
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">Admin Approval Notes (Optional)</label>
                <textarea
                  value={approveNotes}
                  onChange={(e) => setApproveNotes(e.target.value)}
                  placeholder="Add any notes about this approval..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white dark:placeholder-slate-400"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowApproveModal(false)
                    setApproveNotes('')
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAdminVerify(selectedUpload.id, approveNotes)}
                  disabled={approvingUpload}
                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {approvingUpload ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  {approvingUpload ? 'Approving...' : 'Approve & Add to Inventory'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-full max-w-md border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                <X className="w-5 h-5 text-red-600" />
                Reject Upload
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">Rejection Reason *</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white dark:placeholder-slate-400"
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowRejectModal(false)
                    setRejectReason('')
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (rejectReason.trim()) {
                      handleReject(selectedUpload.id, rejectReason)
                    } else {
                      toast.error('Please provide a rejection reason')
                    }
                  }}
                  disabled={rejectingUpload}
                  className="px-4 py-2 bg-gradient-to-r from-red-400 to-rose-400 text-white rounded-lg hover:from-red-500 hover:to-rose-500 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {rejectingUpload ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  {rejectingUpload ? 'Rejecting...' : 'Reject Upload'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-full max-w-md border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                <Trash2 className="w-5 h-5 text-red-600" />
                Delete Upload
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                Are you sure you want to permanently delete this upload and all associated data? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeleteTarget(null)
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUpload(deleteTarget)}
                  disabled={deletingUpload}
                  className="px-4 py-2 bg-gradient-to-r from-red-400 to-rose-400 text-white rounded-lg hover:from-red-500 hover:to-rose-500 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {deletingUpload ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  {deletingUpload ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteItemModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-full max-w-md border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                <Trash2 className="w-5 h-5 text-red-600" />
                Delete Item
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                Are you sure you want to delete this item? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowDeleteItemModal(false)
                    setDeleteTarget(null)
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteItem(deleteTarget)}
                  disabled={deletingItem}
                  className="px-4 py-2 bg-gradient-to-r from-red-400 to-rose-400 text-white rounded-lg hover:from-red-500 hover:to-rose-500 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {deletingItem ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  {deletingItem ? 'Deleting...' : 'Delete Item'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by filename or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white dark:placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white dark:bg-slate-700"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          >
            <option value="all">All Status</option>
            <option value="pending_staff_verification">Pending Staff</option>
            <option value="pending_admin_verification">Pending Admin</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={() => fetchUploads(uploadsPage)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100/80 via-sky-100/80 to-cyan-100/80 dark:from-slate-700/50 dark:via-slate-700/50 dark:to-slate-700/50 backdrop-blur-sm border-b border-blue-200/50 dark:border-slate-600">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">File</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Uploaded By</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Verification History</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {uploads.map((upload, idx) => (
                <tr key={upload.id} className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-slate-700/30 dark:hover:to-slate-700/30 hover:shadow-sm ${idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/50 dark:bg-slate-800/60'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
                        <Upload className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{upload.filename}</div>
                        {upload.upload_notes && (
                          <div className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{upload.upload_notes}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{upload.uploaded_by}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-slate-300">
                      {formatDate(upload.uploaded_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800/40 w-fit">
                        {upload.success_count} success
                      </span>
                      {upload.error_count > 0 && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800/40 w-fit">
                          {upload.error_count} errors
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(upload.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      {upload.staff_verified && (
                        <div className="flex items-center gap-1.5 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md border border-green-200 dark:border-green-800/40 w-fit">
                          <CheckCircle className="w-3 h-3" />
                          <span className="text-xs font-medium">Staff: {upload.staff_verified_by}</span>
                        </div>
                      )}
                      {upload.admin_verified && (
                        <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md border border-blue-200 dark:border-blue-800/40 w-fit">
                          <CheckCircle className="w-3 h-3" />
                          <span className="text-xs font-medium">Admin: {upload.admin_verified_by}</span>
                        </div>
                      )}
                      {upload.status === 'rejected' && upload.rejection_reason && (
                        <div className="text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md border border-red-200 dark:border-red-800/40 text-xs">
                          <span className="font-medium">Rejected:</span> {upload.rejection_reason}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => fetchUploadItems(upload.id)}
                        disabled={reviewingUpload.has(upload.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {reviewingUpload.has(upload.id) ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                        {reviewingUpload.has(upload.id) ? 'Loading...' : 'Review'}
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget(upload.id)
                          setShowDeleteModal(true)
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:from-red-700 hover:to-rose-700 transition-all shadow-sm hover:shadow-md text-xs font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={uploadsPage}
        totalPages={uploadsTotalPages}
        total={uploadsTotal}
        perPage={PER_PAGE}
        onPageChange={setUploadsPage}
      />
    </div>
  )
}

const EditItemModal = ({ item, sections, racks, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    product_name: item.product_name,
    composition: item.composition || '',
    manufacturer: item.manufacturer || '',
    batch_number: item.batch_number,
    quantity_software: item.quantity_software,
    unit_price: item.unit_price || '',
    selling_price: item.selling_price || '',
    section_id: item.section_id || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(item.id, formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
          <Shield className="w-5 h-5 text-blue-600" />
          Admin Edit Item
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">Product Name</label>
              <input
                type="text"
                value={formData.product_name}
                onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">Batch Number</label>
              <input
                type="text"
                value={formData.batch_number}
                onChange={(e) => setFormData({...formData, batch_number: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">Composition</label>
              <input
                type="text"
                value={formData.composition}
                onChange={(e) => setFormData({...formData, composition: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">Manufacturer</label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">Quantity</label>
              <input
                type="number"
                value={formData.quantity_software}
                onChange={(e) => setFormData({...formData, quantity_software: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">Section</label>
              <select
                value={formData.section_id}
                onChange={(e) => setFormData({...formData, section_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option value="">Unassigned</option>
                {sections.map(section => {
                  const rack = racks.find(r => r.id === section.rack_id)
                  return (
                    <option key={section.id} value={section.id}>
                      {rack?.rack_number} - {section.section_name}
                    </option>
                  )
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">Unit Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) => setFormData({...formData, unit_price: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-slate-300">Selling Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.selling_price}
                onChange={(e) => setFormData({...formData, selling_price: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded hover:bg-gray-50 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updatingItem}
              className="px-4 py-2 bg-gradient-to-r from-blue-400 to-indigo-400 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updatingItem ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
              {updatingItem ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ExcelVerification
