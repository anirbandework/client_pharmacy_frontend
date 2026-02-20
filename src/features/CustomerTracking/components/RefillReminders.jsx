import React, { useState, useEffect } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { Bell, Phone, MessageCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const RefillReminders = () => {
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [daysAhead, setDaysAhead] = useState(0)

  useEffect(() => {
    fetchReminders()
  }, [daysAhead])

  const fetchReminders = async () => {
    try {
      const { data } = await customerTrackingAPI.getRefillReminders(daysAhead)
      setReminders(data)
    } catch (error) {
      console.error('Error fetching reminders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkSent = async (reminderId, method) => {
    try {
      await customerTrackingAPI.markReminderSent(reminderId, method)
      toast.success(`Marked as sent via ${method}`)
      fetchReminders()
    } catch (error) {
      toast.error('Failed to mark reminder')
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold">Refill Reminders</h2>
          </div>
          <select
            value={daysAhead}
            onChange={(e) => setDaysAhead(parseInt(e.target.value))}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="0">Due Today</option>
            <option value="1">Next 1 Day</option>
            <option value="3">Next 3 Days</option>
            <option value="7">Next 7 Days</option>
          </select>
        </div>
      </div>

      {/* Reminders List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Medicine</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Reminder Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reminders.map((reminder) => (
                <tr key={reminder.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{reminder.customer_name || 'Unknown'}</td>
                  <td className="px-4 py-3">{reminder.customer_phone}</td>
                  <td className="px-4 py-3">{reminder.medicine_name}</td>
                  <td className="px-4 py-3">
                    {new Date(reminder.reminder_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {reminder.whatsapp_sent && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> WhatsApp Sent
                        </span>
                      )}
                      {reminder.call_reminder_sent && (
                        <span className="text-xs text-blue-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Call Made
                        </span>
                      )}
                      {reminder.customer_purchased && (
                        <span className="text-xs text-purple-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Purchased
                        </span>
                      )}
                      {!reminder.whatsapp_sent && !reminder.call_reminder_sent && (
                        <span className="text-xs text-gray-500">Pending</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {!reminder.whatsapp_sent && (
                        <button
                          onClick={() => handleMarkSent(reminder.id, 'whatsapp')}
                          className="text-green-600 hover:text-green-800"
                          title="Mark WhatsApp Sent"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      )}
                      {!reminder.call_reminder_sent && (
                        <button
                          onClick={() => handleMarkSent(reminder.id, 'call')}
                          className="text-blue-600 hover:text-blue-800"
                          title="Mark Call Made"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {reminders.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No reminders due
        </div>
      )}
    </div>
  )
}

export default RefillReminders
