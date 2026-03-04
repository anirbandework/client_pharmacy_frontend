import React, { useEffect, useState } from 'react'
import { AlertCircle, MapPin, Wifi } from 'lucide-react'
import { attendanceAPI } from '../features/Attendance/services/attendanceApi'

const GeofenceGuard = ({ children, moduleName = 'this module' }) => {
  const [wifiStatus, setWifiStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const userType = localStorage.getItem('user_type')

  useEffect(() => {
    if (userType === 'admin') {
      setLoading(false)
      setWifiStatus({ can_access_modules: true })
      return
    }
    
    checkWifiStatus()
    const interval = setInterval(checkWifiStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkWifiStatus = async () => {
    try {
      const response = await attendanceAPI.getWiFiStatus()
      console.log('WiFi Status:', response.data)
      setWifiStatus(response.data)
    } catch (error) {
      console.error('Failed to check WiFi status:', error)
      setWifiStatus({ can_access_modules: false })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (wifiStatus?.can_access_modules) {
    return <>{children}</>
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4 sm:p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 sm:p-4 bg-red-500/20 rounded-full">
            <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-400" />
          </div>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
          Access Denied
        </h2>
        
        <p className="text-sm sm:text-base text-red-300 mb-6">
          You must be checked in at the shop to access {moduleName}.
        </p>
        
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4 mb-6">
          <p className="text-xs sm:text-sm text-blue-300">
            <strong>Note:</strong> If you are inside the shop and still seeing this message, it may take a few minutes to connect. Please wait patiently or refresh the page.
          </p>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 sm:p-6 mb-6 text-left">
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">Location Requirements:</h3>
              <ul className="text-xs sm:text-sm text-slate-300 space-y-1">
                <li>• You must be within the shop's geofence radius</li>
                <li>• GPS location must be enabled on your device</li>
                <li>• You must be checked in via WiFi attendance</li>
              </ul>
            </div>
          </div>
          
          {wifiStatus?.location_error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-xs sm:text-sm text-red-300 font-medium break-words">
                <strong>Error:</strong> {wifiStatus.location_error}
              </p>
            </div>
          )}
        </div>
        
        <p className="text-xs text-slate-500 mt-6">
          If you believe this is an error, please contact your administrator.
        </p>
      </div>
    </div>
  )
}

export default GeofenceGuard
