import React, { useState } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { MessageCircle, Send } from 'lucide-react'

const WhatsAppBulk = () => {
  const [formData, setFormData] = useState({
    whatsapp_only: true,
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [responseMsg, setResponseMsg] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await customerTrackingAPI.sendWhatsAppBulk(formData)
      setResponseMsg({ type: 'success', text: 'WhatsApp messages sent successfully!' })
      setFormData({ whatsapp_only: true, message: '' })
    } catch (error) {
      setResponseMsg({ type: 'error', text: error.response?.data?.detail || 'Failed to send messages' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-green-600" />
        Send Bulk WhatsApp
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            placeholder="Enter your message..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.whatsapp_only}
              onChange={(e) => setFormData({ ...formData, whatsapp_only: e.target.checked })}
            />
            <span className="text-sm">Send to WhatsApp contacts only</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          {loading ? 'Sending...' : 'Send WhatsApp Messages'}
        </button>
      </form>

      {responseMsg && (
        <div className={`mt-4 p-3 rounded ${responseMsg.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {responseMsg.text}
        </div>
      )}
    </div>
  )
}

export default WhatsAppBulk
