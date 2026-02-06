import React, { useState, useEffect } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { Phone, MessageCircle, Calendar, Edit } from 'lucide-react'

const ContactsList = ({ refresh }) => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchContacts()
  }, [refresh, filter])

  const fetchContacts = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const { data } = await customerTrackingAPI.getContacts(params)
      setContacts(data)
    } catch (error) {
      console.error('Failed to fetch contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-blue-100 text-blue-800',
      converted: 'bg-green-100 text-green-800',
      yellow: 'bg-orange-100 text-orange-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) return <div className="text-center py-8">Loading contacts...</div>

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex gap-2">
        {['all', 'pending', 'contacted', 'converted', 'yellow'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded ${filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">WhatsApp</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{contact.name}</td>
                <td className="px-4 py-3">{contact.phone}</td>
                <td className="px-4 py-3">
                  {contact.has_whatsapp ? (
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(contact.status)}`}>
                    {contact.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Phone className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <Calendar className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ContactsList
