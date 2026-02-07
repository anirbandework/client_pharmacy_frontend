import React, { useState, useEffect } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { Bell, Send, Calendar } from 'lucide-react'

const Reminders = () => {
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [daysAhead, setDaysAhead] = useState(3)

  useEffect(() => {
    fetchReminders()
  }, [daysAhead])

  const fetchReminders = async () => {
    try {
      const { data } = await customerTrackingAPI.getPendingReminders({ days_ahead: daysAhead })
      setReminders(data)
    } catch (error) {
      console.error('Failed to fetch reminders:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendNotification = async (reminderId) => {
    try {
      await customerTrackingAPI.sendReminderNotification(reminderId)
      fetchReminders()
    } catch (error) {
      console.error('Failed to send notification:', error)
    }
  }

  if (loading) return <div className="text-center py-8">Loading reminders...</div>

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6" />
          Refill Reminders
        </h2>
        <select
          value={daysAhead}
          onChange={(e) => setDaysAhead(Number(e.target.value))}
          className="px-3 py-2 border rounded"
        >
          <option value={1}>Next 1 day</option>
          <option value={3}>Next 3 days</option>
          <option value={7}>Next 7 days</option>
          <option value={14}>Next 14 days</option>
        </select>
      </div>

      {reminders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No pending reminders</div>
      ) : (
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{reminder.customer_name}</h3>
                    {reminder.is_repeat_customer && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">Repeat</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{reminder.customer_phone}</p>
                  <p className="text-xs text-gray-500">Total Visits: {reminder.total_visits}</p>
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {reminder.reminder_date}
                    </span>
                    <span className="font-medium text-primary-600">{reminder.medicine_name}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {reminder.notification_sent ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">Sent</span>
                  ) : (
                    <button
                      onClick={() => sendNotification(reminder.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      Send
                    </button>
                  )}
                  {reminder.customer_purchased && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm">Purchased</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Reminders
