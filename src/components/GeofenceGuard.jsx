import React, { useEffect, useState } from 'react'
import { AlertCircle, MapPin, Wifi } from 'lucide-react'
import { attendanceAPI } from '../features/Attendance/services/attendanceApi'

const GeofenceGuard = ({ children, moduleName = 'this module' }) => {
  const [wifiStatus, setWifiStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const userType = localStorage.getItem('user_type')

  useEffect(() => {
    // Skip geofence check for admin users
    if (userType === 'admin') {
      setLoading(false)
      setWifiStatus({ can_access_modules: true })
      return
    }
    
    checkWifiStatus()
    const interval = setInterval(checkWifiStatus, 10000)
    return () => clearInterval(interval)
  }, [])

  const checkWifiStatus = async () => {
    try {
      const response = await attendanceAPI.getWiFiStatus()
      console.log('WiFi Status:', response.data)
      setWifiStatus(response.data)
    } catch (error) {
      console.error('Failed to check WiFi status:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="text-gray-600 text-center max-w-md">
          Connecting... This may take a few minutes. Please wait patiently or refresh the page.
        </p>
      </div>
    )
  }

  if (wifiStatus?.can_access_modules) {
    return <>{children}</>
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-red-900 mb-3">
          Access Denied
        </h2>
        
        <p className="text-red-700 mb-6">
          You must be checked in at the shop to access {moduleName}.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> If you are inside the shop and still seeing this message, it may take a few minutes to connect. Please wait patiently or refresh the page.
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-6 mb-6 text-left">
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="w-5 h-5 text-red-600 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Location Requirements:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• You must be within the shop's geofence radius</li>
                <li>• GPS location must be enabled on your device</li>
                <li>• You must be checked in via WiFi attendance</li>
              </ul>
            </div>
          </div>
          
          {wifiStatus?.location_error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">
                <strong>Error:</strong> {wifiStatus.location_error}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/attendance"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition"
          >
            <Wifi className="w-5 h-5" />
            Go to Attendance
          </a>
        </div>
        
        <p className="text-xs text-gray-500 mt-6">
          If you believe this is an error, please contact your administrator.
        </p>
      </div>
    </div>
  )
}

export default GeofenceGuard
