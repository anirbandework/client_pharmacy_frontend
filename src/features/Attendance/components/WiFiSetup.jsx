import React, { useState } from 'react'
import { attendanceAPI } from '../services/attendanceApi'
import { Wifi } from 'lucide-react'

const WiFiSetup = ({ shopId }) => {
  const [formData, setFormData] = useState({ wifi_ssid: '', wifi_password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await attendanceAPI.setupWiFi({ shop_id: shopId, ...formData })
      alert('WiFi setup successful!')
      setFormData({ wifi_ssid: '', wifi_password: '' })
    } catch (error) {
      alert(error.response?.data?.detail || 'Setup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Wifi className="w-5 h-5 text-primary-600" />
        <h3 className="text-sm font-bold text-gray-700">WiFi Setup</h3>
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
