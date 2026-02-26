import toast from 'react-hot-toast'
import React, { useState, useEffect } from 'react'
import { attendanceAPI } from '../services/attendanceApi'
import { Clock, FileText, History } from 'lucide-react'
import StaffStatus from './StaffStatus'
import StaffLeaves from './StaffLeaves'
import StaffHistory from './StaffHistory'

const StaffAttendance = () => {
  const [activeTab, setActiveTab] = useState('status')
  const [wifiStatus, setWifiStatus] = useState(null)
  const [wifiInfo, setWifiInfo] = useState(null)
  const [myAttendance, setMyAttendance] = useState([])
  const [allRecords, setAllRecords] = useState([])
  const [leaveForm, setLeaveForm] = useState({ leave_type: 'sick', from_date: '', to_date: '', reason: '' })
  const [myLeaves, setMyLeaves] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const statusInterval = setInterval(fetchData, 10000)
    return () => clearInterval(statusInterval)
  }, [])

  const fetchData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const [statusRes, infoRes, attendanceRes, leavesRes, recordsRes] = await Promise.all([
        attendanceAPI.getWiFiStatus().catch(() => null),
        attendanceAPI.getWifiInfo().catch(() => null),
        attendanceAPI.getMyAttendance(today, today),
        attendanceAPI.getMyLeaveRequests(),
        attendanceAPI.getMyAttendance(null, null)
      ])
      setWifiStatus(statusRes?.data)
      setWifiInfo(infoRes?.data)
      setMyAttendance(attendanceRes.data)
      setMyLeaves(leavesRes.data)
      setAllRecords(recordsRes.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div></div>

  const todayRecord = myAttendance[0]

  const tabs = [
    { id: 'status', label: 'Status & Today', icon: Clock, color: 'from-green-500 to-green-600' },
    { id: 'leaves', label: 'Leaves', icon: FileText, color: 'from-blue-500 to-blue-600' },
    { id: 'history', label: 'History', icon: History, color: 'from-purple-500 to-purple-600' }
  ]

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4">
        <div className="inline-flex bg-white rounded-xl shadow-md p-1.5 border border-primary-100 gap-1 min-w-full md:min-w-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id ? 'text-white shadow-lg scale-105' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {activeTab === tab.id && <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-lg`}></div>}
              <tab.icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'status' && <StaffStatus wifiStatus={wifiStatus} wifiInfo={wifiInfo} todayRecord={todayRecord} fetchData={fetchData} />}
        {activeTab === 'leaves' && <StaffLeaves leaveForm={leaveForm} setLeaveForm={setLeaveForm} myLeaves={myLeaves} fetchData={fetchData} />}
        {activeTab === 'history' && <StaffHistory allRecords={allRecords} />}
      </div>
    </div>
  )
}

export default StaffAttendance
