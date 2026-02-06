import React, { useState, useEffect } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { TrendingUp, Users, Target, Award } from 'lucide-react'

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [conversion, setConversion] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const [analyticsRes, conversionRes] = await Promise.all([
        customerTrackingAPI.getCustomerAnalytics(),
        customerTrackingAPI.getConversionReport()
      ])
      setAnalytics(analyticsRes.data)
      setConversion(conversionRes.data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading analytics...</div>

  const metrics = [
    { label: 'Conversion Rate', value: `${conversion?.conversion_rate || 0}%`, icon: Target, color: 'green' },
    { label: 'Total Customers', value: analytics?.total_customers || 0, icon: Users, color: 'blue' },
    { label: 'Active Contacts', value: analytics?.active_contacts || 0, icon: TrendingUp, color: 'purple' },
    { label: 'Success Rate', value: `${analytics?.success_rate || 0}%`, icon: Award, color: 'orange' }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{metric.label}</p>
                <p className="text-3xl font-bold mt-2">{metric.value}</p>
              </div>
              <div className={`p-3 bg-${metric.color}-100 rounded-lg`}>
                <metric.icon className={`w-8 h-8 text-${metric.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Conversion Breakdown</h3>
        <div className="space-y-3">
          {conversion?.breakdown?.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="font-medium">{item.category}</span>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">{item.count} contacts</span>
                <span className="font-bold text-primary-600">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Analytics
