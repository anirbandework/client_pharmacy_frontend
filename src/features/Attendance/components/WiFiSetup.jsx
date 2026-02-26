import toast from 'react-hot-toast'
import React, { useState, useEffect } from 'react'
import { attendanceAPI } from '../services/attendanceApi'
import { Wifi } from 'lucide-react'

const WiFiSetup = ({ shopCode }) => {
  const [wifiData, setWifiData] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({ wifi_ssid: '', wifi_password: '', shop_latitude: '', shop_longitude: '', geofence_radius_meters: 100 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (shopCode) fetchWiFiInfo()
  }, [shopCode])

  const fetchWiFiInfo = async () => {
    try {
      const res = await attendanceAPI.getWifiInfo(shopCode)
      setWifiData(res.data)
      setFormData({ 
        wifi_ssid: res.data.wifi_ssid, 
        wifi_password: '', 
        shop_latitude: res.data.shop_latitude || '', 
        shop_longitude: res.data.shop_longitude || '',
        geofence_radius_meters: res.data.geofence_radius_meters || 100
      })
      setEditMode(false)
    } catch (error) {
      // WiFi not set up yet
      setWifiData(null)
      setEditMode(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await attendanceAPI.setupWiFi(shopCode, formData)
      toast.success('WiFi setup successful!')
      fetchWiFiInfo()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Setup failed')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div></div>

  if (!editMode && wifiData) {
    return (
      <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-primary-600" />
            <h3 className="text-sm font-bold text-gray-700">WiFi Configuration</h3>
          </div>
          <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700">
            Edit WiFi
          </button>
        </div>
        <div className="space-y-3">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">WiFi SSID</div>
            <div className="text-lg font-bold text-gray-900">{wifiData.wifi_ssid}</div>
          </div>
          {wifiData.shop_latitude && wifiData.shop_longitude && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Geofence Location</div>
              <div className="text-sm font-semibold text-gray-900">{wifiData.shop_latitude}, {wifiData.shop_longitude}</div>
              <div className="text-xs text-gray-500 mt-1">Radius: {wifiData.geofence_radius_meters}m - Staff must be within this distance</div>
            </div>
          )}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Status</div>
            <div className="text-sm font-semibold text-green-600">✅ Active</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wifi className="w-5 h-5 text-primary-600" />
          <h3 className="text-sm font-bold text-gray-700">{wifiData ? 'Edit WiFi Configuration' : 'WiFi Setup'}</h3>
        </div>
        {wifiData && (
          <button onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300">
            Cancel
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">WiFi SSID</label>
          <input
            type="text"
            value={formData.wifi_ssid}
            onChange={(e) => setFormData({ ...formData, wifi_ssid: e.target.value })}
            placeholder="MyPharmacy_WiFi"
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Password (Optional)</label>
          <input
            type="password"
            value={formData.wifi_password}
            onChange={(e) => setFormData({ ...formData, wifi_password: e.target.value })}
            placeholder="Optional"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Shop Latitude *</label>
            <input
              type="text"
              value={formData.shop_latitude}
              onChange={(e) => setFormData({ ...formData, shop_latitude: e.target.value })}
              placeholder="28.6139"
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Shop Longitude *</label>
            <input
              type="text"
              value={formData.shop_longitude}
              onChange={(e) => setFormData({ ...formData, shop_longitude: e.target.value })}
              placeholder="77.2090"
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Geofence Radius (meters) *</label>
          <input
            type="number"
            value={formData.geofence_radius_meters}
            onChange={(e) => setFormData({ ...formData, geofence_radius_meters: parseInt(e.target.value) })}
            placeholder="100"
            min="10"
            max="1000"
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
          />
          <p className="text-xs text-gray-500 mt-1">Staff must be within this distance from shop to check in (Required)</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? 'Setting up...' : 'Setup WiFi'}
        </button>
      </form>
    </div>
  )
}

export default WiFiSetup
