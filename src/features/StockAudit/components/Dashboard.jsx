import React, { useState, useEffect } from 'react'
import { stockAuditAPI } from '../services/stockAudit'
import { Package, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      const { data } = await stockAuditAPI.getAuditSummary()
      setSummary(data)
    } catch (error) {
      console.error('Failed to fetch summary:', error)
    }
  }

  const stats = [
    { label: 'Total Items', value: summary?.total_items || 0, icon: Package, color: 'blue' },
    { label: 'Low Stock', value: summary?.low_stock || 0, icon: AlertTriangle, color: 'red' },
    { label: 'Audited Today', value: summary?.audited_today || 0, icon: CheckCircle, color: 'green' },
    { label: 'Discrepancies', value: summary?.discrepancies || 0, icon: TrendingUp, color: 'orange' }
  ]

  return (
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
  )
}

export default Dashboard
