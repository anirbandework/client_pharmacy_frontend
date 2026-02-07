import React, { useState, useEffect } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { Users, Phone, CheckCircle, Clock, Calendar } from 'lucide-react'

const Dashboard = () => {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      const { data } = await customerTrackingAPI.getDailySummary()
      setSummary(data)
    } catch (error) {
      console.error('Failed to fetch summary:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  const stats = [
    { label: 'Contacts Processed', value: summary?.contacts_processed || 0, icon: Users, color: 'blue' },
    { label: 'Interactions', value: summary?.interactions || 0, icon: Phone, color: 'green' },
    { label: 'Conversions', value: summary?.conversions || 0, icon: CheckCircle, color: 'purple' },
    { label: 'Customer Visits', value: summary?.customer_visits || 0, icon: Clock, color: 'orange' }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-5 h-5 text-primary-600" />
        <h2 className="text-lg font-semibold">Today's Summary - {summary?.date}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`w-10 h-10 text-${stat.color}-500`} />
            </div>
          </div>
        ))}
      </div>
      {summary?.revenue !== undefined && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <p className="text-sm opacity-90">Total Revenue</p>
          <p className="text-3xl font-bold">₹{summary.revenue.toFixed(2)}</p>
        </div>
      )}
    </div>
  )
}

export default Dashboard
