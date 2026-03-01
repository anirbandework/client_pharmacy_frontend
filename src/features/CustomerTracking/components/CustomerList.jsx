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
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
          <label className="text-xs md:text-sm font-medium">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 md:px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm md:text-base w-full sm:w-auto"
          >
            <option value="">All Categories</option>
            <option value="contact_sheet">From Contact Sheet</option>
            <option value="first_time_prescription">First Time Prescription</option>
            <option value="regular_branded">Regular (Branded)</option>
            <option value="generic_informed">Generic Informed</option>
          </select>
          <button
            onClick={() => setCategoryFilter('')}
            className="px-3 md:px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:shadow-lg transition-all text-sm md:text-base w-full sm:w-auto"
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
            className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 md:p-6 hover:shadow-xl transition-all cursor-pointer"
            onClick={() => {
              setSelectedCustomer(customer)
              setShowDetailModal(true)
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm md:text-base">{customer.name || 'Unknown'}</h3>
                  <p className="text-xs md:text-sm text-gray-600">{customer.phone}</p>
                </div>
              </div>
              {customer.prefers_generic && (
                <Heart className="w-5 h-5 text-red-500 fill-current" />
              )}
            </div>

            <div className="space-y-2">
              <span className={`inline-block px-2 py-1 rounded-full text-[10px] md:text-xs ${getCategoryColor(customer.category)}`}>
                {getCategoryLabel(customer.category)}
              </span>
              
              <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                <div>
                  <p className="text-gray-600 text-[10px] md:text-xs">Visits</p>
                  <p className="font-semibold">{customer.total_visits}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-[10px] md:text-xs">Total Spent</p>
                  <p className="font-semibold">₹{customer.total_purchases.toFixed(2)}</p>
                </div>
              </div>

              {customer.last_visit_date && (
                <p className="text-[10px] md:text-xs text-gray-500">
                  Last visit: {new Date(customer.last_visit_date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {customers.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 text-center py-8 md:py-12 text-gray-500">
          <User className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-sm md:text-base">No customers found</p>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold">{selectedCustomer.name || 'Unknown'}</h2>
                <p className="text-sm md:text-base text-gray-600">{selectedCustomer.phone}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl md:text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-sm md:text-base">Category</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs md:text-sm ${getCategoryColor(selectedCustomer.category)}`}>
                  {getCategoryLabel(selectedCustomer.category)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2 text-sm md:text-base">Total Visits</h3>
                  <p className="text-xl md:text-2xl font-bold text-purple-600">{selectedCustomer.total_visits}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-sm md:text-base">Total Purchases</h3>
                  <p className="text-xl md:text-2xl font-bold text-green-600">₹{selectedCustomer.total_purchases.toFixed(2)}</p>
                </div>
              </div>

              {selectedCustomer.email && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm md:text-base">Email</h3>
                  <p className="text-sm md:text-base text-gray-700">{selectedCustomer.email}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCustomer.prefers_generic}
                    disabled
                    className="w-4 h-4"
                  />
                  <span className="text-xs md:text-sm">Prefers Generic</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCustomer.generic_education_given}
                    disabled
                    className="w-4 h-4"
                  />
                  <span className="text-xs md:text-sm">Generic Education Given</span>
                </div>
              </div>

              {selectedCustomer.last_visit_date && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm md:text-base">Last Visit</h3>
                  <p className="text-sm md:text-base text-gray-700">
                    {new Date(selectedCustomer.last_visit_date).toLocaleString()}
                  </p>
                </div>
              )}

              {selectedCustomer.created_at && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm md:text-base">First Visit</h3>
                  <p className="text-sm md:text-base text-gray-700">
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
