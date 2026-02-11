import React, { useState, useEffect } from 'react'
import { attendanceAPI } from '../services/attendanceApi'
import { Users, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react'

const Dashboard = ({ shopId }) => {
  const [summary, setSummary] = useState(null)
  const [todayList, setTodayList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (shopId) fetchData()
  }, [shopId])

  const fetchData = async () => {
    try {
      const [summaryRes, todayRes] = await Promise.all([
        attendanceAPI.getSummary(shopId),
        attendanceAPI.getToday(shopId)
      ])
      setSummary(summaryRes.data)
      setTodayList(todayRes.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div></div>

  const stats = [
    { icon: Users, label: 'Total Staff', value: summary?.total_staff || 0, color: 'from-blue-500 to-blue-600' },
    { icon: CheckCircle, label: 'Present', value: summary?.present_today || 0, color: 'from-green-500 to-green-600' },
    { icon: Clock, label: 'Late', value: summary?.late_today || 0, color: 'from-yellow-500 to-yellow-600' },
    { icon: XCircle, label: 'Absent', value: summary?.absent_today || 0, color: 'from-red-500 to-red-600' }
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-soft border border-primary-100 p-4 hover:shadow-lg transition-all">
            <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-lg w-fit mb-2`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500 uppercase">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4">
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Today's Attendance
        </h3>
        <div className="space-y-2">
          {todayList.map((record) => (
            <div key={record.staff_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-semibold text-sm">{record.staff_name}</div>
                <div className="text-xs text-gray-500">{record.staff_code}</div>
              </div>
              <div className="text-right">
                {record.attendance ? (
                  <>
                    <div className={`text-xs font-semibold ${record.attendance.is_late ? 'text-yellow-600' : 'text-green-600'}`}>
                      {new Date(record.attendance.check_in_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-[10px] text-gray-500">{record.attendance.is_late ? 'Late' : 'On time'}</div>
                  </>
                ) : (
                  <div className="text-xs font-semibold text-red-600">Absent</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
