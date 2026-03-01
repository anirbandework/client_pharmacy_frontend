import React from 'react'
import toast from 'react-hot-toast'
import { FileText, Calendar } from 'lucide-react'
import { attendanceAPI } from '../services/attendanceApi'

const StaffLeaves = ({ leaveForm, setLeaveForm, myLeaves, fetchData }) => {
  const handleLeaveRequest = async (e) => {
    e.preventDefault()
    try {
      await attendanceAPI.requestLeave(leaveForm)
      toast.success('Leave request submitted!')
      setLeaveForm({ leave_type: 'sick', from_date: '', to_date: '', reason: '' })
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Request failed')
    }
  }

  return (
    <div className="space-y-4">
      {/* Request Leave */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-700">Request Leave</h3>
        </div>
        <form onSubmit={handleLeaveRequest} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Leave Type</label>
              <select value={leaveForm.leave_type} onChange={(e) => setLeaveForm({ ...leaveForm, leave_type: e.target.value })} className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="earned">Earned Leave</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">From Date</label>
              <input type="date" value={leaveForm.from_date} onChange={(e) => setLeaveForm({ ...leaveForm, from_date: e.target.value })} required className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">To Date</label>
              <input type="date" value={leaveForm.to_date} onChange={(e) => setLeaveForm({ ...leaveForm, to_date: e.target.value })} required className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Reason</label>
            <textarea value={leaveForm.reason} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} rows="2" required className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-500/20">
            Submit Request
          </button>
        </form>
      </div>

      {/* My Leave Requests */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-700">My Leave Requests</h3>
        </div>
        <div className="space-y-2">
          {myLeaves.length === 0 ? (
            <div className="text-center text-gray-500 py-4 text-sm">No leave requests</div>
          ) : (
            myLeaves.map((leave) => (
              <div key={leave.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-sm capitalize text-gray-900">{leave.leave_type} Leave • {leave.total_days} days</div>
                    <div className="text-xs text-gray-500">{leave.from_date} to {leave.to_date}</div>
                    <div className="text-xs text-gray-600 mt-1">{leave.reason}</div>
                    {leave.rejection_reason && (
                      <div className="text-xs text-red-600 mt-1">Reason: {leave.rejection_reason}</div>
                    )}
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded capitalize ${
                    leave.status === 'approved' ? 'bg-green-100 text-green-700' :
                    leave.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {leave.status}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default StaffLeaves
