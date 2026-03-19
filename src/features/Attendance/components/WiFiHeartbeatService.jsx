import { useEffect, useRef } from 'react'
import { attendanceAPI } from '../services/attendanceApi'

/**
 * Global WiFi Heartbeat Service
 * Automatically sends heartbeats for staff users after login
 * Should be mounted at app root level for staff users
 */
const WiFiHeartbeatService = () => {
  const isInitialized = useRef(false)
  
  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (isInitialized.current) return
    isInitialized.current = true
    
    let heartbeatInterval = null
    let wifiInfo = null

    // Only run for staff users
    const userType = localStorage.getItem('user_type')
    if (userType !== 'staff') {
      console.log('⏭️ WiFi Heartbeat skipped (not a staff user)')
      return
    }

    const initHeartbeat = async () => {
      try {
        // Fetch WiFi info once
        const res = await attendanceAPI.getWifiInfo()
        wifiInfo = res.data
        
        // Send first heartbeat immediately
        await sendHeartbeat()
        
        // Send heartbeat every 5 minutes
        heartbeatInterval = setInterval(sendHeartbeat, 300000)
        
        console.log('✅ WiFi Heartbeat Service started')
      } catch (error) {
        console.error('❌ WiFi Heartbeat Service failed to start:', error.response?.data?.detail || error.message)
      }
    }

    const sendHeartbeat = async () => {
      try {
        if (!wifiInfo?.wifi_ssid) return
        
        // Get user's location
        let latitude = null
        let longitude = null
        
        if (navigator.geolocation) {
          try {
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 30000
              })
            })
            latitude = position.coords.latitude
            longitude = position.coords.longitude
            console.log('📍 Location obtained:', { latitude, longitude })
          } catch (e) {
            console.warn('Could not get location:', e.message)
          }
        }
        
        const payload = {
          wifi_ssid: wifiInfo.wifi_ssid,
          mac_address: null
        }
        
        if (latitude !== null && longitude !== null) {
          payload.latitude = latitude
          payload.longitude = longitude
        }
        
        const response = await attendanceAPI.wifiHeartbeat(payload)
        console.log('✅ Heartbeat sent - Response:', response.data)
      } catch (error) {
        // Log heartbeat errors but always continue — do not stop heartbeats
        const errorMsg = error.response?.data?.message || error.response?.data?.detail || error.message
        console.warn('⚠️ Heartbeat error (will retry):', errorMsg)
      }
    }

    // Start heartbeat service
    initHeartbeat()

    // Cleanup on unmount (logout)
    return () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval)
      }
      // Don't send disconnect - allow multiple logins per day
      // Final checkout happens via stale session detection
      console.log('✅ WiFi Heartbeat Service stopped')
    }
  }, [])

  return null // This component doesn't render anything
}

export default WiFiHeartbeatService
