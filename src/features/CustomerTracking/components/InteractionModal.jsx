import React, { useState } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { X, Phone, MessageCircle } from 'lucide-react'

const InteractionModal = ({ contact, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    contact_id: contact.id,
    staff_code: '',
    interaction_type: 'call',
    notes: '',
    customer_response: '',
    next_action: '',
    call_duration: 0,
    call_successful: true
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await customerTrackingAPI.addInteraction(contact.id, formData)
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Failed to log interaction:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Log Interaction - {contact.name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Staff Code"
            value={formData.staff_code}
            onChange={(e) => setFormData({ ...formData, staff_code: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            required
          />

          <select
            value={formData.interaction_type}
            onChange={(e) => setFormData({ ...formData, interaction_type: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="call">Call</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="sms">SMS</option>
            <option value="visit">Visit</option>
          </select>

          <textarea
            placeholder="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border rounded"
            rows="3"
            required
          />

          <input
            type="text"
            placeholder="Customer Response"
            value={formData.customer_response}
            onChange={(e) => setFormData({ ...formData, customer_response: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />

          <input
            type="text"
            placeholder="Next Action"
            value={formData.next_action}
            onChange={(e) => setFormData({ ...formData, next_action: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />

          {formData.interaction_type === 'call' && (
            <>
              <input
                type="number"
                placeholder="Call Duration (seconds)"
                value={formData.call_duration}
                onChange={(e) => setFormData({ ...formData, call_duration: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.call_successful}
                  onChange={(e) => setFormData({ ...formData, call_successful: e.target.checked })}
                />
                <span>Call Successful</span>
              </label>
            </>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              {loading ? 'Saving...' : 'Save Interaction'}
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

export default InteractionModal
