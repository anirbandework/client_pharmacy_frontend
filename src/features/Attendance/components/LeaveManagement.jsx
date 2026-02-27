import toast from 'react-hot-toast'
import React, { useState, useEffect } from 'react'
import { attendanceAPI } from '../services/attendanceApi'
import { FileText, Check, X, Filter } from 'lucide-react'
import { adminApi } from '../../Admin&SuperAdmin/services/admin&superAminApi'

const LeaveManagement = ({ shopCode }) => {
  const [leaves, setLeaves] = useState([])
  const [staff, setStaff] = useState([])
  const [filters, setFilters] = useState({ staff_id: '', status: 'pending' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (shopCode) {
      loadStaff()
      fetchLeaves()
    }
  }, [shopCode])

  const loadStaff = async () => {
    try {
      const data = await adminApi.getAllStaff()
      setStaff(data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchLeaves = async () => {
    setLoading(true)
    try {
      const res = await attendanceAPI.getAllLeaves(shopCode, filters.staff_id || null, filters.status || null)
      setLeaves(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') await attendanceAPI.approveLeave(id, shopCode)
      else await attendanceAPI.rejectLeave(id, shopCode, {})
      fetchLeaves()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Action failed')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div></div>

  return (
    <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary-600" />
        <h3 className="text-sm font-bold text-gray-700">Leave Records</h3>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <select value={filters.staff_id} onChange={(e) => setFilters({ ...filters, staff_id: e.target.value })} className="px-3 py-2 text-sm border rounded-lg">
          <option value="">All Staff</option>
          {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="px-3 py-2 text-sm border rounded-lg">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button onClick={fetchLeaves} className="bg-primary-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2">
          <Filter className="w-4 h-4" />
          Apply Filters
        </button>
      </div>

      <div className="space-y-3">
        {leaves.length === 0 ? (
          <div className="text-center text-gray-500 py-8 text-sm">No leave records found</div>
        ) : (
          leaves.map((leave) => (
            <div key={leave.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-sm">{leave.staff_name} ({leave.staff_code})</div>
                  <div className="text-xs text-gray-500 capitalize">{leave.leave_type} • {leave.total_days} days</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`text-xs font-semibold px-2 py-1 rounded capitalize ${
                    leave.status === 'approved' ? 'bg-green-100 text-green-700' :
                    leave.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {leave.status}
                  </div>
                  {leave.status === 'pending' && (
                    <>
                      <button onClick={() => handleAction(leave.id, 'approve')} className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleAction(leave.id, 'reject')} className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-600">{leave.from_date} to {leave.to_date}</div>
              <div className="text-xs text-gray-500 mt-1">{leave.reason}</div>
              {leave.approved_by && (
                <div className="text-xs text-gray-400 mt-1">By: {leave.approved_by} on {new Date(leave.approved_at).toLocaleDateString()}</div>
              )}
              {leave.rejection_reason && (
                <div className="text-xs text-red-600 mt-1">Rejection: {leave.rejection_reason}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default LeaveManagement
