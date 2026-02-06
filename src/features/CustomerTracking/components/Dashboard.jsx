import React, { useState, useEffect } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { Users, Phone, CheckCircle, Clock, TrendingUp } from 'lucide-react'

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
    { label: 'Total Contacts', value: summary?.total_contacts || 0, icon: Users, color: 'blue' },
    { label: 'Contacted Today', value: summary?.contacted_today || 0, icon: Phone, color: 'green' },
    { label: 'Converted', value: summary?.converted || 0, icon: CheckCircle, color: 'purple' },
    { label: 'Pending Follow-ups', value: summary?.pending_followups || 0, icon: Clock, color: 'orange' }
  ]

  return (
    <div className="space-y-4">
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
    </div>
  )
}

export default Dashboard
