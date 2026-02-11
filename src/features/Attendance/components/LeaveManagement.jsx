import React, { useState, useEffect } from 'react'
import { attendanceAPI } from '../services/attendanceApi'
import { FileText, Check, X } from 'lucide-react'

const LeaveManagement = ({ shopId }) => {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (shopId) fetchLeaves()
  }, [shopId])

  const fetchLeaves = async () => {
    try {
      const res = await attendanceAPI.getPendingLeaves(shopId)
      setLeaves(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') await attendanceAPI.approveLeave(id)
      else await attendanceAPI.rejectLeave(id)
      fetchLeaves()
    } catch (error) {
      alert(error.response?.data?.detail || 'Action failed')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div></div>

  return (
    <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary-600" />
        <h3 className="text-sm font-bold text-gray-700">Pending Leave Requests</h3>
      </div>
      <div className="space-y-3">
        {leaves.length === 0 ? (
          <div className="text-center text-gray-500 py-8 text-sm">No pending requests</div>
        ) : (
          leaves.map((leave) => (
            <div key={leave.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-sm">{leave.staff_name}</div>
                  <div className="text-xs text-gray-500">{leave.leave_type} • {leave.total_days} days</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAction(leave.id, 'approve')} className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleAction(leave.id, 'reject')} className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-600">{leave.from_date} to {leave.to_date}</div>
              <div className="text-xs text-gray-500 mt-1">{leave.reason}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default LeaveManagement
