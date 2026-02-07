import React, { useState, useEffect } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { Users, Plus, UserCheck, UserCog } from 'lucide-react'

const StaffManagement = () => {
  const [staff, setStaff] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showAssign, setShowAssign] = useState(false)
  const [formData, setFormData] = useState({ name: '', staff_code: '', phone: '', max_contacts_per_day: 20 })
  const [assignData, setAssignData] = useState({ staff_code: '', contact_count: 10 })

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      const { data } = await customerTrackingAPI.getStaff()
      setStaff(data)
    } catch (error) {
      console.error('Failed to fetch staff:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await customerTrackingAPI.createStaff(formData)
      setFormData({ name: '', staff_code: '', phone: '', max_contacts_per_day: 20 })
      setShowForm(false)
      fetchStaff()
    } catch (error) {
      console.error('Failed to create staff:', error)
    }
  }

  const handleAssign = async (e) => {
    e.preventDefault()
    try {
      await customerTrackingAPI.assignContacts(assignData)
      setAssignData({ staff_code: '', contact_count: 10 })
      setShowAssign(false)
      alert('Contacts assigned successfully')
    } catch (error) {
      console.error('Failed to assign contacts:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Staff Members</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAssign(!showAssign)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <UserCog className="w-4 h-4" />
              Assign Contacts
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              <Plus className="w-4 h-4" />
              Add Staff
            </button>
          </div>
        </div>

        {showAssign && (
          <form onSubmit={handleAssign} className="mb-6 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold mb-3">Auto-Assign Contacts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Staff Code"
                value={assignData.staff_code}
                onChange={(e) => setAssignData({ ...assignData, staff_code: e.target.value })}
                className="px-3 py-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Number of Contacts"
                value={assignData.contact_count}
                onChange={(e) => setAssignData({ ...assignData, contact_count: Number(e.target.value) })}
                className="px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Assign
              </button>
              <button
                type="button"
                onClick={() => setShowAssign(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Staff Code"
                value={formData.staff_code}
                onChange={(e) => setFormData({ ...formData, staff_code: e.target.value })}
                className="px-3 py-2 border rounded"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="px-3 py-2 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Max Contacts/Day"
                value={formData.max_contacts_per_day}
                onChange={(e) => setFormData({ ...formData, max_contacts_per_day: Number(e.target.value) })}
                className="px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((member) => (
            <div key={member.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.staff_code}</p>
                  <p className="text-sm text-gray-500">{member.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StaffManagement
