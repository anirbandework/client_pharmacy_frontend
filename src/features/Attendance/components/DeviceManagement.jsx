import React, { useState, useEffect } from 'react'
import { attendanceAPI } from '../services/attendanceApi'
import { Smartphone, Plus } from 'lucide-react'

const DeviceManagement = () => {
  const [devices, setDevices] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ mac_address: '', device_name: '' })

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    try {
      const res = await attendanceAPI.getMyDevices()
      setDevices(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await attendanceAPI.registerDevice(formData)
      alert('Device registered!')
      setFormData({ mac_address: '', device_name: '' })
      setShowForm(false)
      fetchDevices()
    } catch (error) {
      alert(error.response?.data?.detail || 'Registration failed')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-primary-600" />
          <h3 className="text-sm font-bold text-gray-700">My Devices</h3>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="text-xs bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700 flex items-center gap-1">
          <Plus className="w-3 h-3" />
          Add Device
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-3 bg-gray-50 rounded-lg space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">MAC Address</label>
            <input type="text" value={formData.mac_address} onChange={(e) => setFormData({ ...formData, mac_address: e.target.value })} placeholder="AA:BB:CC:DD:EE:FF" required className="w-full px-3 py-2 text-sm border rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Device Name</label>
            <input type="text" value={formData.device_name} onChange={(e) => setFormData({ ...formData, device_name: e.target.value })} placeholder="My iPhone" required className="w-full px-3 py-2 text-sm border rounded-lg" />
          </div>
          <button type="submit" className="w-full bg-primary-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-primary-700">
            Register Device
          </button>
        </form>
      )}

      <div className="space-y-2">
        {devices.length === 0 ? (
          <div className="text-center text-gray-500 py-4 text-sm">No devices registered</div>
        ) : (
          devices.map((device) => (
            <div key={device.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
              <div>
                <div className="font-semibold text-sm">{device.device_name}</div>
                <div className="text-xs text-gray-500">{device.mac_address}</div>
                <div className="text-xs text-gray-400 mt-1">Last seen: {device.last_seen ? new Date(device.last_seen).toLocaleString() : 'Never'}</div>
              </div>
              <div className={`text-xs px-2 py-1 rounded ${device.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {device.is_active ? 'Active' : 'Inactive'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DeviceManagement
