import toast from 'react-hot-toast'
import React, { useState, useEffect } from 'react'
import { attendanceAPI } from '../services/attendanceApi'
import { Settings as SettingsIcon, AlertCircle, Shield, MapPin, CheckCircle, XCircle, Loader2 } from 'lucide-react'

const Settings = ({ shopCode }) => {
  const [settings, setSettings] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)

  useEffect(() => {
    if (shopCode) fetchSettings()
  }, [shopCode])

  const fetchSettings = async () => {
    try {
      const res = await attendanceAPI.getSettings(shopCode)
      setSettings(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaveLoading(true)
    try {
      await attendanceAPI.updateSettings(shopCode, settings)
      toast.success('Settings updated!')
      setEditMode(false)
      fetchSettings()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Update failed')
    } finally {
      setSaveLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div></div>

  if (!editMode) {
    return (
      <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-primary-600" />
            <h3 className="text-sm font-bold text-gray-700">Attendance Settings</h3>
          </div>
          <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700">
            Edit Settings
          </button>
        </div>

        <div className="space-y-4">
          {/* Emergency Override Status */}
          <div className={`p-4 rounded-lg border ${
            settings?.allow_any_network ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4" />
              <span className="font-semibold text-sm">Emergency Override</span>
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              {settings?.allow_any_network ? (
                <><CheckCircle className="w-4 h-4" /> Any network allowed</>
              ) : (
                <><XCircle className="w-4 h-4" /> WiFi required</>
              )}
            </div>
          </div>

          {/* WiFi Enforcement Status */}
          <div className={`p-4 rounded-lg border ${
            settings?.require_wifi_for_modules ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4" />
              <span className="font-semibold text-sm">WiFi Enforcement</span>
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              {settings?.require_wifi_for_modules ? (
                <><CheckCircle className="w-4 h-4" /> WiFi required for modules</>
              ) : (
                <><XCircle className="w-4 h-4" /> WiFi not required</>
              )}
            </div>
          </div>

          {/* Geofence Status */}
          <div className={`p-4 rounded-lg border ${
            settings?.geofence_required ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4" />
              <span className="font-semibold text-sm">GPS / Geofence</span>
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              {settings?.geofence_required ? (
                <><CheckCircle className="w-4 h-4" /> GPS location required for check-in</>
              ) : (
                <><XCircle className="w-4 h-4" /> GPS not required — WiFi SSID match is enough</>
              )}
            </div>
          </div>

          {/* Work Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Work Start Time</div>
              <div className="text-lg font-bold text-gray-900">{settings?.work_start_time}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Work End Time</div>
              <div className="text-lg font-bold text-gray-900">{settings?.work_end_time}</div>
            </div>
          </div>

          {/* Grace Period */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Grace Period</div>
            <div className="text-lg font-bold text-gray-900">{settings?.grace_period_minutes} minutes</div>
          </div>

          {/* Working Days */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-2">Working Days</div>
            <div className="flex gap-2 flex-wrap">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                <span key={day} className={`px-2 py-1 text-xs rounded ${
                  settings?.[day] ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                }`}>
                  {day.slice(0, 3).toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-primary-600" />
          <h3 className="text-sm font-bold text-gray-700">Edit Attendance Settings</h3>
        </div>
        <button onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300">
          Cancel
        </button>
      </div>
      
      {/* Emergency Override Toggle */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-yellow-900 mb-1">Emergency Override</div>
            <div className="text-sm text-yellow-700 mb-3">Allow staff to access modules from any network (for power outages, WiFi failures)</div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings?.allow_any_network || false} 
                onChange={(e) => setSettings({ ...settings, allow_any_network: e.target.checked })} 
                className="w-5 h-5 rounded"
              />
              <span className="text-sm font-medium text-yellow-900 flex items-center gap-1">
                {settings?.allow_any_network ? (
                  <><CheckCircle className="w-4 h-4" /> Any Network Allowed</>
                ) : (
                  <><XCircle className="w-4 h-4" /> WiFi Required</>
                )}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* WiFi Enforcement Toggle */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-blue-900 mb-1">WiFi Enforcement</div>
            <div className="text-sm text-blue-700 mb-3">Require staff to be connected to shop WiFi to access protected modules (billing, stock audit, etc.)</div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.require_wifi_for_modules || false}
                onChange={(e) => setSettings({ ...settings, require_wifi_for_modules: e.target.checked })}
                className="w-5 h-5 rounded"
              />
              <span className="text-sm font-medium text-blue-900 flex items-center gap-1">
                {settings?.require_wifi_for_modules ? (
                  <><CheckCircle className="w-4 h-4" /> WiFi Required for Modules</>
                ) : (
                  <><XCircle className="w-4 h-4" /> WiFi Not Required</>
                )}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Geofence / GPS Toggle */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-green-900 mb-1">GPS / Geofence Check</div>
            <div className="text-sm text-green-700 mb-3">
              When enabled, staff must be physically within the shop's GPS radius to check in.
              Disable this for shops with old computers or GPS-unreliable devices — WiFi SSID match alone will be used for attendance.
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.geofence_required ?? true}
                onChange={(e) => setSettings({ ...settings, geofence_required: e.target.checked })}
                className="w-5 h-5 rounded"
              />
              <span className="text-sm font-medium text-green-900 flex items-center gap-1">
                {settings?.geofence_required ? (
                  <><CheckCircle className="w-4 h-4" /> GPS Location Required</>
                ) : (
                  <><XCircle className="w-4 h-4" /> GPS Not Required (WiFi SSID only)</>
                )}
              </span>
            </label>
          </div>
        </div>
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
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Grace Period (minutes)</label>
          <input type="number" value={settings?.grace_period_minutes || ''} onChange={(e) => setSettings({ ...settings, grace_period_minutes: Number(e.target.value) })} className="w-full px-3 py-2 text-sm border rounded-lg" />
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
        <button type="submit" disabled={saveLoading} className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold py-2 rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
          {saveLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Update Settings
        </button>
      </form>
    </div>
  )
}

export default Settings
