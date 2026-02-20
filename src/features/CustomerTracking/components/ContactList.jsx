import React, { useState, useEffect } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { Phone, MessageCircle, Calendar, User, Filter } from 'lucide-react'
import toast from 'react-hot-toast'

const ContactList = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    contact_status: '',
    whatsapp_status: ''
  })
  const [selectedContact, setSelectedContact] = useState(null)
  const [showInteractionModal, setShowInteractionModal] = useState(false)
  const [interactionData, setInteractionData] = useState({
    interaction_type: 'call',
    notes: '',
    customer_response: '',
    call_successful: false
  })

  useEffect(() => {
    fetchContacts()
  }, [filters])

  const fetchContacts = async () => {
    try {
      const { data } = await customerTrackingAPI.getContacts(filters)
      setContacts(data)
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddInteraction = async () => {
    if (!selectedContact) return

    try {
      await customerTrackingAPI.addInteraction(selectedContact.id, interactionData)
      toast.success('Interaction logged successfully')
      setShowInteractionModal(false)
      setInteractionData({ interaction_type: 'call', notes: '', customer_response: '', call_successful: false })
      fetchContacts()
    } catch (error) {
      toast.error('Failed to log interaction')
    }
  }

  const handleMarkYellow = async (contactId) => {
    if (!window.confirm('Mark this contact as yellow (visited but no purchase)?')) return

    try {
      await customerTrackingAPI.markContactYellow(contactId)
      toast.success('Contact marked as yellow')
      fetchContacts()
    } catch (error) {
      toast.error('Failed to mark contact')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-blue-100 text-blue-800',
      converted: 'bg-green-100 text-green-800',
      yellow: 'bg-orange-100 text-orange-800',
      inactive: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.contact_status}
            onChange={(e) => setFilters({...filters, contact_status: e.target.value})}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="yellow">Yellow</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={filters.whatsapp_status}
            onChange={(e) => setFilters({...filters, whatsapp_status: e.target.value})}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All WhatsApp Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="unknown">Unknown</option>
          </select>
          <button
            onClick={() => setFilters({ contact_status: '', whatsapp_status: '' })}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Contact List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">WhatsApp</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Attempts</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Conversion</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{contact.phone}</td>
                  <td className="px-4 py-3">{contact.name || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      contact.whatsapp_status === 'active' ? 'bg-green-100 text-green-800' : 
                      contact.whatsapp_status === 'inactive' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {contact.whatsapp_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(contact.contact_status)}`}>
                      {contact.contact_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{contact.contact_attempts}</td>
                  <td className="px-4 py-3">
                    {contact.conversion_value ? `₹${contact.conversion_value.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedContact(contact)
                        setShowInteractionModal(true)
                      }}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                      title="Add Interaction"
                    >
                      <Phone className="w-4 h-4 inline" />
                    </button>
                    {contact.contact_status !== 'yellow' && contact.contact_status !== 'converted' && (
                      <button
                        onClick={() => handleMarkYellow(contact.id)}
                        className="text-orange-600 hover:text-orange-800"
                        title="Mark as Yellow"
                      >
                        <User className="w-4 h-4 inline" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interaction Modal */}
      {showInteractionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Log Interaction</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={interactionData.interaction_type}
                  onChange={(e) => setInteractionData({...interactionData, interaction_type: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="call">Call</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="visit">Visit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={interactionData.notes}
                  onChange={(e) => setInteractionData({...interactionData, notes: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="What did you discuss?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Customer Response</label>
                <textarea
                  value={interactionData.customer_response}
                  onChange={(e) => setInteractionData({...interactionData, customer_response: e.target.value})}
                  rows="2"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="What did customer say?"
                />
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={interactionData.call_successful}
                  onChange={(e) => setInteractionData({...interactionData, call_successful: e.target.checked})}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm">Call Successful</span>
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleAddInteraction}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowInteractionModal(false)}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactList
