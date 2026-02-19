import React, { useState, useEffect } from 'react'
import { billingAPI } from '../services/billing'
import { DollarSign, Receipt, TrendingUp, CreditCard, Smartphone } from 'lucide-react'

const Dashboard = () => {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      const { data } = await billingAPI.getSummary()
      setSummary(data)
    } catch (error) {
      console.error('Error fetching summary:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  const stats = [
    { label: 'Total Bills', value: summary?.total_bills || 0, icon: Receipt, color: 'blue' },
    { label: 'Total Revenue', value: `₹${summary?.total_revenue?.toFixed(2) || 0}`, icon: DollarSign, color: 'green' },
    { label: 'Cash Sales', value: `₹${summary?.cash_sales?.toFixed(2) || 0}`, icon: CreditCard, color: 'purple' },
    { label: 'Online Sales', value: `₹${summary?.online_sales?.toFixed(2) || 0}`, icon: Smartphone, color: 'orange' },
    { label: 'Avg Bill Value', value: `₹${summary?.average_bill_value?.toFixed(2) || 0}`, icon: TrendingUp, color: 'pink' }
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
