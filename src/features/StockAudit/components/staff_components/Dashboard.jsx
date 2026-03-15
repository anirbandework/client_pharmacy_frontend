import { useState, useEffect } from 'react'
import { staffStockAuditAPI } from '../../services/staff_stock_audit_apis'
import { Package, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'

const Dashboard = () => {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      const { data } = await staffStockAuditAPI.getAuditSummary()
      setSummary(data)
    } catch (error) {
      console.error('Failed to fetch summary:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Items',
      value: summary?.total_items || 0,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Sections',
      value: summary?.total_sections || 0,
      icon: Package,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Discrepancies',
      value: summary?.items_with_discrepancies || 0,
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Pending Audits',
      value: summary?.pending_audits || 0,
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Completion Rate',
      value: `${summary?.audit_completion_rate?.toFixed(1) || 0}%`,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    }
  ]

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!summary) {
    return null
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {summary?.last_audit_date && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl shadow-lg border border-blue-200 dark:border-blue-800/40 p-4">
          <p className="text-sm text-gray-700 dark:text-slate-300">
            <span className="font-semibold text-blue-700">Last Audit:</span>{' '}
            <span className="font-semibold">{new Date(summary.last_audit_date).toLocaleString()}</span>
            {summary.last_audited_by && (
              <span className="ml-3">
                by <span className="font-semibold text-purple-700">{summary.last_audited_by}</span>
              </span>
            )}
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 md:p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className={`p-2 md:p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-gray-700 dark:text-slate-300" />
              </div>
            </div>
            <h3 className="text-gray-600 dark:text-slate-400 text-xs md:text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
