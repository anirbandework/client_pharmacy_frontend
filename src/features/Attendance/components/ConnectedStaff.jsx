import React, { useState, useEffect } from 'react'
import { attendanceAPI } from '../services/attendanceApi'
import { Users, Clock, Wifi } from 'lucide-react'

const ConnectedStaff = ({ shopCode }) => {
  const [connected, setConnected] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (shopCode) {
      fetchConnected()
      const interval = setInterval(fetchConnected, 30000) // Refresh every 30s
      return () => clearInterval(interval)
    }
  }, [shopCode])

  const fetchConnected = async () => {
    try {
      const res = await attendanceAPI.getConnectedStaff(shopCode)
      setConnected(res.data.connected_staff)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div></div>

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-gray-700">Currently Connected Staff</h3>
          </div>
          <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-green-700">{connected.length} Online</span>
          </div>
        </div>

        {connected.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No staff currently connected to WiFi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connected.map((staff) => (
              <div key={staff.staff_id} className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-gray-900">{staff.staff_name}</div>
                    <div className="text-xs text-gray-500">{staff.staff_code}</div>
                  </div>
                  {staff.is_late && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Late</span>
                  )}
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Check-in: {new Date(staff.check_in_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Wifi className="w-4 h-4" />
                    <span>Duration: {Math.floor(staff.duration_minutes / 60)}h {staff.duration_minutes % 60}m</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Last seen: {new Date(staff.last_seen).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ConnectedStaff
