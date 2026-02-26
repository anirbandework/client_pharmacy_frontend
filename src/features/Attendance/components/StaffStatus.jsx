import React from 'react'
import { Clock, Wifi, WifiOff, AlertCircle, LogOut } from 'lucide-react'
import { attendanceAPI } from '../services/attendanceApi'
import toast from 'react-hot-toast'

const StaffStatus = ({ wifiStatus, wifiInfo, todayRecord, fetchData }) => {
  const isInsideGeofence = wifiStatus?.is_inside_geofence
  const canAccessModules = wifiStatus?.can_access_modules
  const locationError = wifiStatus?.location_error

  const handleManualCheckout = async () => {
    try {
      await attendanceAPI.wifiDisconnect()
      toast.success('Checked out successfully')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Checkout failed')
    }
  }

  return (
    <div className="space-y-4">
      {/* WiFi Status Card */}
      <div className={`rounded-xl shadow-lg p-6 text-white ${
        isInsideGeofence ? 'bg-gradient-to-r from-green-600 to-green-700' : 'bg-gradient-to-r from-gray-600 to-gray-700'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          {isInsideGeofence ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
          <h2 className="text-xl font-bold">WiFi Attendance Status</h2>
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm opacity-90">Connection Status</div>
              <div className="text-2xl font-bold">{isInsideGeofence ? '✅ Connected' : '❌ Not Connected'}</div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              canAccessModules ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {canAccessModules ? 'Access Granted' : 'Access Denied'}
            </div>
          </div>
          
          {wifiInfo && (
            <div className="text-sm opacity-90 mb-2">
              <strong>Shop WiFi:</strong> {wifiInfo.wifi_ssid}
            </div>
          )}
          
          <div className="text-xs opacity-75">
            {isInsideGeofence ? 'Inside shop - Sending heartbeats' : wifiStatus?.message}
          </div>
          
          {locationError && (
            <div className="mt-3 flex items-center gap-2 bg-red-500/30 px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">{locationError}</span>
            </div>
          )}
          
          {wifiStatus?.allow_any_network && (
            <div className="mt-3 flex items-center gap-2 bg-yellow-500/30 px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">Emergency mode: Any network allowed</span>
            </div>
          )}
        </div>
      </div>

      {/* Today's Attendance Record */}
      {todayRecord && (
        <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-bold text-gray-700">Today's Record</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Check-in Time</div>
              <div className="text-xl font-bold text-gray-900">
                {new Date(todayRecord.check_in_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className={`text-xs mt-1 font-semibold ${
                todayRecord.is_late ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {todayRecord.is_late ? '⚠️ Late by ' + todayRecord.late_by_minutes + ' min' : '✅ On time'}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Check-out Time</div>
              {todayRecord.check_out_time ? (
                <>
                  <div className="text-xl font-bold text-gray-900">
                    {new Date(todayRecord.check_out_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-xs mt-1 text-gray-600">
                    Total: {todayRecord.total_hours ? (todayRecord.total_hours / 60).toFixed(1) + 'h' : 'N/A'}
                  </div>
                </>
              ) : (
                <div className="text-xl font-bold text-green-600">Still Working</div>
              )}
            </div>
          </div>
          
          {todayRecord.total_break_minutes > 0 && (
            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="text-xs text-orange-600 font-semibold">⏸️ Total Break Time: {Math.floor(todayRecord.total_break_minutes / 60)}h {todayRecord.total_break_minutes % 60}m</div>
              <div className="text-xs text-gray-500 mt-1">Breaks are tracked when no heartbeat for &gt;30 minutes</div>
            </div>
          )}
          
          {todayRecord.auto_checked_in && (
            <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
              <Wifi className="w-3 h-3" />
              Automatically checked in via WiFi
            </div>
          )}
          
          {!todayRecord.check_out_time && (
            <button onClick={handleManualCheckout} className="mt-3 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition">
              <LogOut className="w-4 h-4" />
              Manual Check Out
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default StaffStatus
