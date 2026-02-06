import React, { useState } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { Search, User, ShoppingBag, MapPin } from 'lucide-react'

const CustomerProfile = () => {
  const [phone, setPhone] = useState('')
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(false)

  const searchCustomer = async () => {
    if (!phone) return
    setLoading(true)
    try {
      const { data } = await customerTrackingAPI.getCustomerByPhone(phone)
      setCustomer(data)
    } catch (error) {
      console.error('Customer not found:', error)
      setCustomer(null)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'contacted', label: 'Received Call from Store', color: 'blue' },
    { id: 'first_time', label: 'First Time with Prescription', color: 'green' },
    { id: 'regular_branded', label: 'Regular - Branded Medicines', color: 'purple' },
    { id: 'generic_informed', label: 'Informed about Generic', color: 'orange' }
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Customer Profile</h2>
        
        <div className="flex gap-2 mb-6">
          <input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 px-4 py-2 border rounded"
          />
          <button
            onClick={searchCustomer}
            disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>

        {customer && (
          <div className="space-y-4">
            <div className="border-l-4 border-primary-600 pl-4">
              <h3 className="text-lg font-semibold">{customer.name}</h3>
              <p className="text-gray-600">{customer.phone}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded text-sm ${
                categories.find(c => c.id === customer.category)?.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                categories.find(c => c.id === customer.category)?.color === 'green' ? 'bg-green-100 text-green-800' :
                categories.find(c => c.id === customer.category)?.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {categories.find(c => c.id === customer.category)?.label}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Total Visits</span>
                </div>
                <p className="text-2xl font-bold">{customer.total_visits || 0}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-sm">Total Purchases</span>
                </div>
                <p className="text-2xl font-bold">₹{customer.total_purchases || 0}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Last Visit</span>
                </div>
                <p className="text-sm">{customer.last_visit || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerProfile
