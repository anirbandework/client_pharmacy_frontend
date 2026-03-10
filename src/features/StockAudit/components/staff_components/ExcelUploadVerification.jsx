import React, { useState, useEffect } from 'react'
import { Upload, Eye, Check, X, Edit, Trash2, Clock, User, AlertCircle, CheckCircle, FileSpreadsheet, Search, Calendar, Package } from 'lucide-react'
import { staffStockAuditAPI } from '../../services/staff_stock_audit_apis'
import toast from 'react-hot-toast'

const ExcelUploadVerification = () => {
  const [uploads, setUploads] = useState([])
  const [selectedUpload, setSelectedUpload] = useState(null)
  const [uploadItems, setUploadItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [sections, setSections] = useState([])
  const [racks, setRacks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [verifyNotes, setVerifyNotes] = useState('')
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    fetchUploads()
    fetchSections()
    fetchRacks()
  }, [])

  const fetchUploads = async () => {
    try {
      const response = await staffStockAuditAPI.getExcelUploads()
      setUploads(response.data)
    } catch (error) {
      console.error('Error fetching uploads:', error)
    }
  }

  const fetchSections = async () => {
    try {
      const response = await staffStockAuditAPI.getSections()
      setSections(response.data)
    } catch (error) {
      console.error('Error fetching sections:', error)
    }
  }

  const fetchRacks = async () => {
    try {
      const response = await staffStockAuditAPI.getRacks()
      setRacks(response.data)
    } catch (error) {
      console.error('Error fetching racks:', error)
    }
  }

  const fetchUploadItems = async (uploadId) => {
    try {
      setLoading(true)
      const response = await staffStockAuditAPI.getUploadItems(uploadId)
      setUploadItems(response.data.items)
      setSelectedUpload(response.data.upload)
    } catch (error) {
      console.error('Error fetching upload items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStaffVerify = async (uploadId, notes) => {
    try {
      await staffStockAuditAPI.staffVerifyUpload(uploadId, notes)
      fetchUploads()
      setShowVerifyModal(false)
      setVerifyNotes('')
      toast.success('Upload verified and sent to admin for approval')
    } catch (error) {
      console.error('Error verifying upload:', error)
      toast.error('Error verifying upload')
    }
  }

  const handleReject = async (uploadId, reason) => {
    try {
      await staffStockAuditAPI.rejectUpload(uploadId, reason)
      fetchUploads()
      setShowRejectModal(false)
      setRejectReason('')
      toast.success('Upload rejected')
    } catch (error) {
      console.error('Error rejecting upload:', error)
      toast.error('Error rejecting upload')
    }
  }

  const handleUpdateItem = async (itemId, itemData) => {
    try {
      await staffStockAuditAPI.updateUploadItem(selectedUpload.id, itemId, itemData)
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
      await staffStockAuditAPI.deleteUploadItem(selectedUpload.id, itemId)
      fetchUploadItems(selectedUpload.id)
      toast.success('Item deleted successfully')
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('Error deleting item')
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending_staff_verification: { color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle, text: 'Staff Verification Required' },
      pending_admin_verification: { color: 'bg-orange-100 text-orange-700', icon: AlertCircle, text: 'Awaiting Admin Approval' },
      approved: { color: 'bg-green-100 text-green-700', icon: CheckCircle, text: 'Admin Verified' },
      rejected: { color: 'bg-red-100 text-red-700', icon: X, text: 'Rejected' }
    }
    
    const config = statusConfig[status] || statusConfig.pending_staff_verification
    const Icon = config.icon
    
    return (
      <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${config.color} ${status === 'pending_staff_verification' || status === 'pending_admin_verification' ? 'animate-pulse' : ''}`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </span>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const filteredUploads = uploads.filter(upload =>
    upload.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    upload.uploaded_by.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (selectedUpload) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedUpload(null)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors"
          >
            ← Back to Uploads
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
            Upload Details: {selectedUpload.filename}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div><strong>Uploaded by:</strong> {selectedUpload.uploaded_by}</div>
            <div><strong>Upload Date:</strong> {formatDate(selectedUpload.uploaded_at)}</div>
            <div><strong>Status:</strong> {getStatusBadge(selectedUpload.status)}</div>
            <div><strong>Total Items:</strong> {uploadItems.length}</div>
          </div>
          
          {selectedUpload.status === 'pending_staff_verification' && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowVerifyModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
              >
                <Check className="w-4 h-4" />
                Verify & Send to Admin
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
              >
                <X className="w-4 h-4" />
                Reject
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading items...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100/80 via-sky-100/80 to-cyan-100/80 backdrop-blur-sm border-b border-blue-200/50">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Composition</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Mfg</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Batch</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Qty</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Purchase ₹</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Selling ₹</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Expiry</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Section</th>
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
                        {item.section_name ? (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                              {item.rack_name}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                              {item.section_name}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {selectedUpload.status === 'approved' ? (
                            <>
                              <button
                                disabled
                                className="p-2 text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed border border-gray-200"
                                title="Cannot edit - Upload has been admin verified"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                disabled
                                className="p-2 text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed border border-gray-200"
                                title="Cannot delete - Upload has been admin verified"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setEditingItem(item)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
                                title="Edit Item"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                                title="Delete Item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

        {showVerifyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                Verify Upload
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Verification Notes (Optional)</label>
                <textarea
                  value={verifyNotes}
                  onChange={(e) => setVerifyNotes(e.target.value)}
                  placeholder="Add any notes about this verification..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowVerifyModal(false)
                    setVerifyNotes('')
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStaffVerify(selectedUpload.id, verifyNotes)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Verify & Send to Admin
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
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
            <input
              type="text"
              placeholder="Search by filename or uploaded by..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm md:text-base"
            />
          </div>
          <button
            onClick={fetchUploads}
            className="px-4 py-2 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredUploads.map((upload) => (
          <div key={upload.id} className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                  <FileSpreadsheet className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  <h3 className="font-bold text-base md:text-lg text-gray-800">{upload.filename}</h3>
                  {getStatusBadge(upload.status)}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 text-xs md:text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                    {formatDate(upload.uploaded_at)}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="w-3 h-3 md:w-4 md:h-4" />
                    {upload.success_count} items
                    {upload.error_count > 0 && (
                      <span className="text-red-600 ml-1">({upload.error_count} errors)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-3 h-3 md:w-4 md:h-4" />
                    {upload.uploaded_by}
                  </div>
                </div>
                <div className="mt-2 text-[10px] md:text-xs text-gray-500">
                  Uploaded by: {upload.uploaded_by}
                  {upload.staff_verified_by && (
                    <span className="ml-2 md:ml-3 text-green-600">
                      • Verified by: {upload.staff_verified_by}
                    </span>
                  )}
                  {upload.admin_verified_by && (
                    <span className="ml-2 md:ml-3 text-blue-600">
                      • Approved by: {upload.admin_verified_by}
                    </span>
                  )}
                  {upload.status === 'rejected' && upload.rejection_reason && (
                    <span className="ml-2 md:ml-3 text-red-600">
                      • Rejected: {upload.rejection_reason}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchUploadItems(upload.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Items"
                >
                  <Eye className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUploads.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 text-center py-8 md:py-12 text-gray-500">
          <FileSpreadsheet className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-sm md:text-base">No uploads found</p>
        </div>
      )}
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
        <h3 className="text-lg font-bold mb-4">Edit Item</h3>
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

export default ExcelUploadVerification