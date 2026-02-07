import React, { useState } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { ClipboardList, Phone, Calendar } from 'lucide-react'

const StaffTasks = () => {
  const [staffCode, setStaffCode] = useState('')
  const [tasks, setTasks] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchTasks = async () => {
    if (!staffCode) return
    setLoading(true)
    try {
      const { data } = await customerTrackingAPI.getStaffTasks(staffCode)
      setTasks(data)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <ClipboardList className="w-6 h-6" />
        Staff Daily Tasks
      </h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter Staff Code"
          value={staffCode}
          onChange={(e) => setStaffCode(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <button
          onClick={fetchTasks}
          disabled={loading}
          className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          {loading ? 'Loading...' : 'Get Tasks'}
        </button>
      </div>

      {tasks && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-gray-600">Total Tasks</p>
            <p className="text-2xl font-bold">{tasks.total_tasks || 0}</p>
          </div>

          {tasks.pending_contacts && tasks.pending_contacts.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Pending Contacts ({tasks.pending_contacts.length})</h3>
              <div className="space-y-2">
                {tasks.pending_contacts.map((contact) => (
                  <div key={contact.id} className="border rounded p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.phone}</p>
                      <span className="text-xs text-gray-500">Attempts: {contact.contact_attempts}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      contact.contact_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {contact.contact_status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tasks.pending_reminders && tasks.pending_reminders.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Pending Reminders ({tasks.pending_reminders.length})</h3>
              <div className="space-y-2">
                {tasks.pending_reminders.map((reminder) => (
                  <div key={reminder.id} className="border rounded p-3 bg-yellow-50">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">{reminder.reminder_type}</span>
                    </div>
                    <p className="text-sm text-gray-600">{reminder.message}</p>
                    <p className="text-xs text-gray-500 mt-1">Due: {new Date(reminder.reminder_date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default StaffTasks
