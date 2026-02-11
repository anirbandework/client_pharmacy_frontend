import React, { useState, useEffect } from 'react'
import { attendanceAPI } from '../services/attendanceApi'
import { Clock, CheckCircle, Calendar, FileText } from 'lucide-react'
import DeviceManagement from './DeviceManagement'

const StaffAttendance = () => {
  const [myAttendance, setMyAttendance] = useState([])
  const [todayRecord, setTodayRecord] = useState(null)
  const [leaveForm, setLeaveForm] = useState({ leave_type: 'sick', from_date: '', to_date: '', reason: '' })
  const [myLeaves, setMyLeaves] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const [attendanceRes, leavesRes] = await Promise.all([
        attendanceAPI.getMyAttendance(today, today),
        attendanceAPI.getMyLeaveRequests()
      ])
      setMyAttendance(attendanceRes.data)
      setTodayRecord(attendanceRes.data[0])
      setMyLeaves(leavesRes.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelfCheckIn = async () => {
    try {
      await attendanceAPI.selfCheckIn('')
      alert('Checked in successfully!')
      fetchData()
    } catch (error) {
      alert(error.response?.data?.detail || 'Check-in failed')
    }
  }

  const handleCheckOut = async () => {
    try {
      await attendanceAPI.checkOut({})
      alert('Checked out successfully!')
      fetchData()
    } catch (error) {
      alert(error.response?.data?.detail || 'Check-out failed')
    }
  }

  const handleLeaveRequest = async (e) => {
    e.preventDefault()
    try {
      await attendanceAPI.requestLeave(leaveForm)
      alert('Leave request submitted!')
      setLeaveForm({ leave_type: 'sick', from_date: '', to_date: '', reason: '' })
      fetchData()
    } catch (error) {
      alert(error.response?.data?.detail || 'Request failed')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div></div>

  return (
    <div className="space-y-4">
      {/* Today's Status */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6" />
          <h2 className="text-xl font-bold">Today's Attendance</h2>
        </div>
        {todayRecord ? (
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm opacity-90">Check-in Time</div>
                <div className="text-2xl font-bold">{new Date(todayRecord.check_in_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                <div className="text-xs mt-1">{todayRecord.is_late ? '⚠️ Late' : '✅ On time'}</div>
              </div>
              {!todayRecord.check_out_time && (
                <button onClick={handleCheckOut} className="bg-white text-primary-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100">
                  Check Out
                </button>
              )}
              {todayRecord.check_out_time && (
                <div className="text-right">
                  <div className="text-sm opacity-90">Check-out Time</div>
                  <div className="text-xl font-bold">{new Date(todayRecord.check_out_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-center">
              <div className="text-lg mb-3">Not checked in yet</div>
              <button onClick={handleSelfCheckIn} className="bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">
                Check In Now
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Device Management */}
      <DeviceManagement />

      {/* Request Leave */}
      <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-primary-600" />
          <h3 className="text-sm font-bold text-gray-700">Request Leave</h3>
        </div>
        <form onSubmit={handleLeaveRequest} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Leave Type</label>
              <select value={leaveForm.leave_type} onChange={(e) => setLeaveForm({ ...leaveForm, leave_type: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg">
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="earned">Earned Leave</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">From Date</label>
              <input type="date" value={leaveForm.from_date} onChange={(e) => setLeaveForm({ ...leaveForm, from_date: e.target.value })} required className="w-full px-3 py-2 text-sm border rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">To Date</label>
              <input type="date" value={leaveForm.to_date} onChange={(e) => setLeaveForm({ ...leaveForm, to_date: e.target.value })} required className="w-full px-3 py-2 text-sm border rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Reason</label>
            <textarea value={leaveForm.reason} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} rows="2" required className="w-full px-3 py-2 text-sm border rounded-lg" />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold py-2 rounded-lg hover:shadow-lg">
            Submit Request
          </button>
        </form>
      </div>

      {/* My Leave Requests */}
      <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-primary-600" />
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
                    <div className="font-semibold text-sm">{leave.leave_type} • {leave.total_days} days</div>
                    <div className="text-xs text-gray-500">{leave.from_date} to {leave.to_date}</div>
                    <div className="text-xs text-gray-600 mt-1">{leave.reason}</div>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded ${
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

export default StaffAttendance
