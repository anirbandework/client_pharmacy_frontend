import React, { useState, useEffect } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { User, Phone, Mail, MapPin, Heart } from 'lucide-react'
import toast from 'react-hot-toast'

const CustomerList = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [categoryFilter])

  const fetchCustomers = async () => {
    try {
      const params = categoryFilter ? { category: categoryFilter } : {}
      const { data } = await customerTrackingAPI.getCustomers(params)
      setCustomers(data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryLabel = (category) => {
    const labels = {
      contact_sheet: 'From Contact Sheet',
      first_time_prescription: 'First Time Prescription',
      regular_branded: 'Regular (Branded)',
      generic_informed: 'Generic Informed'
    }
    return labels[category] || category
  }

  const getCategoryColor = (category) => {
    const colors = {
      contact_sheet: 'bg-purple-100 text-purple-800',
      first_time_prescription: 'bg-blue-100 text-blue-800',
      regular_branded: 'bg-green-100 text-green-800',
      generic_informed: 'bg-teal-100 text-teal-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Categories</option>
            <option value="contact_sheet">From Contact Sheet</option>
            <option value="first_time_prescription">First Time Prescription</option>
            <option value="regular_branded">Regular (Branded)</option>
            <option value="generic_informed">Generic Informed</option>
          </select>
          <button
            onClick={() => setCategoryFilter('')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedCustomer(customer)
              setShowDetailModal(true)
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{customer.name || 'Unknown'}</h3>
                  <p className="text-sm text-gray-600">{customer.phone}</p>
                </div>
              </div>
              {customer.prefers_generic && (
                <Heart className="w-5 h-5 text-red-500 fill-current" />
              )}
            </div>

            <div className="space-y-2">
              <span className={`inline-block px-2 py-1 rounded-full text-xs ${getCategoryColor(customer.category)}`}>
                {getCategoryLabel(customer.category)}
              </span>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">Visits</p>
                  <p className="font-semibold">{customer.total_visits}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Spent</p>
                  <p className="font-semibold">₹{customer.total_purchases.toFixed(2)}</p>
                </div>
              </div>

              {customer.last_visit_date && (
                <p className="text-xs text-gray-500">
                  Last visit: {new Date(customer.last_visit_date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {customers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No customers found
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{selectedCustomer.name || 'Unknown'}</h2>
                <p className="text-gray-600">{selectedCustomer.phone}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Category</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${getCategoryColor(selectedCustomer.category)}`}>
                  {getCategoryLabel(selectedCustomer.category)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Total Visits</h3>
                  <p className="text-2xl font-bold text-primary-600">{selectedCustomer.total_visits}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Total Purchases</h3>
                  <p className="text-2xl font-bold text-green-600">₹{selectedCustomer.total_purchases.toFixed(2)}</p>
                </div>
              </div>

              {selectedCustomer.email && (
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-gray-700">{selectedCustomer.email}</p>
                </div>
              )}

              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCustomer.prefers_generic}
                    disabled
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Prefers Generic</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCustomer.generic_education_given}
                    disabled
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Generic Education Given</span>
                </div>
              </div>

              {selectedCustomer.last_visit_date && (
                <div>
                  <h3 className="font-semibold mb-2">Last Visit</h3>
                  <p className="text-gray-700">
                    {new Date(selectedCustomer.last_visit_date).toLocaleString()}
                  </p>
                </div>
              )}

              {selectedCustomer.created_at && (
                <div>
                  <h3 className="font-semibold mb-2">First Visit</h3>
                  <p className="text-gray-700">
                    {new Date(selectedCustomer.created_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerList
