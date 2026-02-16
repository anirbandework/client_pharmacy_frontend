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
    { label: 'Total Sections', value: summary?.total_sections || 0, icon: Package, color: 'green' },
    { label: 'Discrepancies', value: summary?.items_with_discrepancies || 0, icon: AlertTriangle, color: 'red' },
    { label: 'Pending Audits', value: summary?.pending_audits || 0, icon: TrendingUp, color: 'orange' },
    { label: 'Completion Rate', value: `${summary?.audit_completion_rate?.toFixed(1) || 0}%`, icon: CheckCircle, color: 'green' }
  ]

  return (
    <div>
      {summary?.last_audit_date && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            Last Audit: <span className="font-semibold">{new Date(summary.last_audit_date).toLocaleString()}</span>
            {summary.last_audited_by && <span className="ml-3">by <span className="font-semibold">{summary.last_audited_by}</span></span>}
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
