import React, { useState } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { X, Calendar } from 'lucide-react'

const ReminderModal = ({ contact, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    staff_code: '',
    reminder_date: '',
    reminder_type: 'follow_up',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await customerTrackingAPI.addReminder(contact.id, formData)
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to add reminder:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Add Reminder - {contact.name}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Staff Code</label>
            <input
              type="text"
              value={formData.staff_code}
              onChange={(e) => setFormData({ ...formData, staff_code: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reminder Date</label>
            <input
              type="datetime-local"
              value={formData.reminder_date}
              onChange={(e) => setFormData({ ...formData, reminder_date: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reminder Type</label>
            <input
              type="text"
              placeholder="follow_up, callback, visit, etc."
              value={formData.reminder_type}
              onChange={(e) => setFormData({ ...formData, reminder_type: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              placeholder="Reminder message..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              rows="3"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              {loading ? 'Saving...' : 'Add Reminder'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReminderModal
