import { useEffect, useState } from 'react'
import { AlertCircle, MapPin, Wifi } from 'lucide-react'
import { attendanceAPI } from '../features/Attendance/services/attendanceApi'
import { useTheme } from '../contexts/ThemeContext'

const GeofenceGuard = ({ children, moduleName = 'this module' }) => {
  const { isDark } = useTheme()
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
    const interval = setInterval(checkWifiStatus, 300000)
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
      <div className="rounded-xl p-4 sm:p-8 text-center" style={{ background: isDark ? 'rgba(239,68,68,0.08)' : 'rgba(254,226,226,0.8)', border: isDark ? '2px solid rgba(239,68,68,0.25)' : '2px solid rgba(252,165,165,0.8)' }}>
        <div className="flex justify-center mb-4">
          <div className="p-3 sm:p-4 rounded-full" style={{ background: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(254,202,202,0.8)' }}>
            <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: isDark ? '#f87171' : '#ef4444' }} />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>
          Access Denied
        </h2>

        <p className="text-sm sm:text-base mb-6" style={{ color: isDark ? '#fca5a5' : '#dc2626' }}>
          You must be checked in at the shop to access {moduleName}.
        </p>

        <div className="rounded-lg p-3 sm:p-4 mb-6" style={{ background: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(219,234,254,0.8)', border: isDark ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(147,197,253,0.8)' }}>
          <p className="text-xs sm:text-sm" style={{ color: isDark ? '#93c5fd' : '#1d4ed8' }}>
            <strong>Note:</strong> If you are inside the shop and still seeing this message, it may take a few minutes to connect. Please wait patiently or refresh the page.
          </p>
        </div>

        <div className="backdrop-blur-sm rounded-lg p-4 sm:p-6 mb-6 text-left" style={{ background: isDark ? 'rgba(30,41,59,0.5)' : 'rgba(241,245,249,0.9)', border: isDark ? '1px solid rgba(51,65,85,0.5)' : '1px solid rgba(203,213,225,0.8)' }}>
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: isDark ? '#f87171' : '#ef4444' }} />
            <div>
              <h3 className="font-semibold mb-2 text-sm sm:text-base" style={{ color: isDark ? '#ffffff' : '#1e293b' }}>Location Requirements:</h3>
              <ul className="text-xs sm:text-sm space-y-1" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>
                <li>• You must be within the shop's geofence radius</li>
                <li>• GPS location must be enabled on your device</li>
                <li>• You must be checked in via WiFi attendance</li>
              </ul>
            </div>
          </div>

          {wifiStatus?.location_error && (
            <div className="mt-4 p-3 rounded-lg" style={{ background: isDark ? 'rgba(239,68,68,0.1)' : 'rgba(254,226,226,0.8)', border: isDark ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(252,165,165,0.8)' }}>
              <p className="text-xs sm:text-sm font-medium break-words" style={{ color: isDark ? '#fca5a5' : '#dc2626' }}>
                <strong>Error:</strong> {wifiStatus.location_error}
              </p>
            </div>
          )}
        </div>

        <p className="text-xs mt-6" style={{ color: isDark ? '#64748b' : '#9ca3af' }}>
          If you believe this is an error, please contact your administrator.
        </p>
      </div>
    </div>
  )
}

export default GeofenceGuard
