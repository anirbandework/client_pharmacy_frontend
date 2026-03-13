import React, { useState, useEffect } from 'react'
import { Upload, Eye, Check, X, Edit, Trash2, Clock, User, AlertCircle, CheckCircle, Shield } from 'lucide-react'
import { adminStockAuditAPI } from '../../services/admin_stock_audit_apis'
import toast from 'react-hot-toast'

const ExcelVerification = () => {
  const [uploads, setUploads] = useState([])
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

  useEffect(() => {
    fetchUploads()
    fetchSections()
    fetchRacks()
  }, [statusFilter])

  const fetchUploads = async () => {
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {}
      const response = await adminStockAuditAPI.getAdminExcelUploads(params)
      setUploads(response.data)
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
    try {
      await adminStockAuditAPI.adminVerifyUpload(uploadId, notes)
      fetchUploads()
      setSelectedUpload(null)
      setShowApproveModal(false)
      setApproveNotes('')
      toast.success('Upload approved and items added to inventory')
    } catch (error) {
      console.error('Error approving upload:', error)
      toast.error('Error approving upload')
    }
  }

  const handleReject = async (uploadId, reason) => {
    try {
      await adminStockAuditAPI.rejectUpload(uploadId, reason)
      fetchUploads()
      setSelectedUpload(null)
      setShowRejectModal(false)
      setRejectReason('')
      toast.success('Upload rejected')
    } catch (error) {
      console.error('Error rejecting upload:', error)
      toast.error('Error rejecting upload')
    }
  }

  const handleDeleteUpload = async (uploadId) => {
    try {
      await adminStockAuditAPI.deleteUpload(uploadId)
      fetchUploads()
      if (selectedUpload?.id === uploadId) {
        setSelectedUpload(null)
      }
      setShowDeleteModal(false)
      setDeleteTarget(null)
      toast.success('Upload deleted successfully')
    } catch (error) {
      console.error('Error deleting upload:', error)
      toast.error('Error deleting upload')
    }
  }

  const handleUpdateItem = async (itemId, itemData) => {
    try {
      await adminStockAuditAPI.updateUploadItem(selectedUpload.id, itemId, itemData)
      fetchUploadItems(selectedUpload.id)
      setEditingItem(null)
      toast.success('Item updated successfully')
    } catch (error) {
      console.error('Error updating item:', error)
      toast.error('Error updating item')
    }
  }

  const handleDeleteItem = async (itemId) => {
    try {
      await adminStockAuditAPI.deleteUploadItem(selectedUpload.id, itemId)
      fetchUploadItems(selectedUpload.id)
      setShowDeleteItemModal(false)
      setDeleteTarget(null)
      toast.success('Item deleted successfully')
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('Error deleting item')
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_staff_verification: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending Staff Verification' },
      pending_admin_verification: { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'Pending Admin Verification' },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', icon: X, text: 'Rejected' }
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
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Uploads
          </button>
          <div className="flex items-center gap-4">
            {getStatusBadge(selectedUpload.status)}
            {selectedUpload.status === 'pending_admin_verification' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Approve & Add to Inventory
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
              </div>
            )}
            <button
              onClick={() => {
                setDeleteTarget(selectedUpload.id)
                setShowDeleteModal(true)
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Upload
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Admin Review: {selectedUpload.filename}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Uploaded by:</strong> {selectedUpload.uploaded_by}</div>
            <div><strong>Upload Date:</strong> {formatDate(selectedUpload.uploaded_at)}</div>
            <div><strong>Status:</strong> {getStatusBadge(selectedUpload.status)}</div>
            <div><strong>Total Items:</strong> {uploadItems.length}</div>
          </div>
          
          {selectedUpload.staff_verified && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 font-medium">
                <CheckCircle className="w-4 h-4" />
                Staff Verified by {selectedUpload.staff_verified_by}
              </div>
              <div className="text-sm text-green-700 mt-1">
                {formatDate(selectedUpload.staff_verified_at)}
              </div>
              {selectedUpload.staff_notes && (
                <div className="text-sm text-green-700 mt-2">
                  <strong>Staff Notes:</strong> {selectedUpload.staff_notes}
                </div>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">Loading items...</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-100/80 via-sky-100/80 to-cyan-100/80 backdrop-blur-sm border-b border-blue-200/50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Composition</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Mfg</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Batch</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Expiry</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Purchase ₹</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Selling ₹</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Margin %</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Section</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {uploadItems.map((item, idx) => (
                  <tr key={item.id} className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-sm ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 text-sm leading-tight">{item.product_name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.composition || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.manufacturer || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                        {item.batch_number}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.unit || '-'}</td>
                    <td className="px-6 py-4">
                      {item.expiry_date ? (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          new Date(item.expiry_date) < new Date() 
                            ? 'bg-red-100 text-red-800 border border-red-200' 
                            : new Date(item.expiry_date) < new Date(Date.now() + 30*24*60*60*1000)
                            ? 'bg-orange-100 text-orange-800 border border-orange-200'
                            : 'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                          {new Date(item.expiry_date).toLocaleDateString()}
                        </span>
                      ) : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900 text-lg">{item.quantity_software}</span>
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
                      ) : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-6 py-4">
                      {item.section_name ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                          {item.rack_name} - {item.section_name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.status === 'approved' ? 'bg-green-100 text-green-800' :
                        item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status === 'pending' ? 'Pending' : item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingItem(item)} 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setDeleteTarget(item.id)
                            setShowDeleteItemModal(true)
                          }} 
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
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                Approve Upload
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Admin Approval Notes (Optional)</label>
                <textarea
                  value={approveNotes}
                  onChange={(e) => setApproveNotes(e.target.value)}
                  placeholder="Add any notes about this approval..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowApproveModal(false)
                    setApproveNotes('')
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAdminVerify(selectedUpload.id, approveNotes)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve & Add to Inventory
                </button>
              </div>
            </div>
          </div>
        )}

        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <X className="w-5 h-5 text-red-600" />
                Reject Upload
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rejection Reason *</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
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
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject Upload
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-600" />
                Delete Upload
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to permanently delete this upload and all associated data? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeleteTarget(null)
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUpload(deleteTarget)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteItemModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-600" />
                Delete Item
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this item? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowDeleteItemModal(false)
                    setDeleteTarget(null)
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteItem(deleteTarget)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete Item
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Admin Excel Upload Verification</h1>
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="all">All Status</option>
            <option value="pending_staff_verification">Pending Staff</option>
            <option value="pending_admin_verification">Pending Admin</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={fetchUploads}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification History</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {uploads.map((upload) => (
                <tr key={upload.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Upload className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{upload.filename}</div>
                        {upload.upload_notes && (
                          <div className="text-sm text-gray-500">{upload.upload_notes}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{upload.uploaded_by}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(upload.uploaded_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {upload.success_count} success
                      {upload.error_count > 0 && (
                        <span className="text-red-600 ml-2">{upload.error_count} errors</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(upload.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      {upload.staff_verified && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Staff: {upload.staff_verified_by}
                        </div>
                      )}
                      {upload.admin_verified && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Admin: {upload.admin_verified_by}
                        </div>
                      )}
                      {upload.status === 'rejected' && upload.rejection_reason && (
                        <div className="text-red-600 text-xs">
                          Rejected: {upload.rejection_reason}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => fetchUploadItems(upload.id)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Review
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget(upload.id)
                          setShowDeleteModal(true)
                        }}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
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
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Admin Edit Item
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <input
                type="text"
                value={formData.product_name}
                onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Batch Number</label>
              <input
                type="text"
                value={formData.batch_number}
                onChange={(e) => setFormData({...formData, batch_number: e.target.value})}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Composition</label>
              <input
                type="text"
                value={formData.composition}
                onChange={(e) => setFormData({...formData, composition: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Manufacturer</label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                value={formData.quantity_software}
                onChange={(e) => setFormData({...formData, quantity_software: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Section</label>
              <select
                value={formData.section_id}
                onChange={(e) => setFormData({...formData, section_id: e.target.value})}
                className="w-full px-3 py-2 border rounded"
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
              <label className="block text-sm font-medium mb-1">Unit Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) => setFormData({...formData, unit_price: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Selling Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.selling_price}
                onChange={(e) => setFormData({...formData, selling_price: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ExcelVerification