import React, { useState, useEffect } from 'react'
import { attendanceAPI } from '../services/attendanceApi'
import { Settings as SettingsIcon } from 'lucide-react'

const Settings = ({ shopId }) => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (shopId) fetchSettings()
  }, [shopId])

  const fetchSettings = async () => {
    try {
      const res = await attendanceAPI.getSettings(shopId)
      setSettings(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await attendanceAPI.updateSettings(shopId, settings)
      alert('Settings updated!')
    } catch (error) {
      alert(error.response?.data?.detail || 'Update failed')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div></div>

  return (
    <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <SettingsIcon className="w-5 h-5 text-primary-600" />
        <h3 className="text-sm font-bold text-gray-700">Attendance Settings</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Work Start Time</label>
            <input type="time" value={settings?.work_start_time || ''} onChange={(e) => setSettings({ ...settings, work_start_time: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Work End Time</label>
            <input type="time" value={settings?.work_end_time || ''} onChange={(e) => setSettings({ ...settings, work_end_time: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Grace Period (minutes)</label>
            <input type="number" value={settings?.grace_period_minutes || ''} onChange={(e) => setSettings({ ...settings, grace_period_minutes: Number(e.target.value) })} className="w-full px-3 py-2 text-sm border rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Auto Checkout Time</label>
            <input type="time" value={settings?.auto_checkout_time || ''} onChange={(e) => setSettings({ ...settings, auto_checkout_time: e.target.value })} className="w-full px-3 py-2 text-sm border rounded-lg" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={settings?.auto_checkout_enabled || false} onChange={(e) => setSettings({ ...settings, auto_checkout_enabled: e.target.checked })} className="rounded" />
          <label className="text-sm text-gray-700">Enable Auto Checkout</label>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">Working Days</label>
          <div className="grid grid-cols-7 gap-2">
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
              <label key={day} className="flex items-center gap-1 text-xs">
                <input type="checkbox" checked={settings?.[day] || false} onChange={(e) => setSettings({ ...settings, [day]: e.target.checked })} className="rounded" />
                {day.slice(0, 3)}
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold py-2 rounded-lg hover:shadow-lg">
          Update Settings
        </button>
      </form>
    </div>
  )
}

export default Settings
