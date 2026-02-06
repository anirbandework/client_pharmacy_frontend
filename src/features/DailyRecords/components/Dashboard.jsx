import React, { useState, useEffect } from 'react'
import { dailyRecordsAPI } from '../services/dailyRecords'
import { TrendingUp, DollarSign, FileText, AlertTriangle, Calendar, BarChart3, ArrowUp, ArrowDown } from 'lucide-react'

const Dashboard = () => {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const response = await dailyRecordsAPI.getDashboardSummary()
      setSummary(response.data)
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    )
  }

  const stats = [
    { 
      icon: Calendar, 
      label: 'Total Records', 
      value: summary?.total_records || 0, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-600',
      change: '+12%'
    },
    { 
      icon: DollarSign, 
      label: 'Total Sales', 
      value: `₹${(summary?.total_sales || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, 
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      textColor: 'text-green-600',
      change: '+8.5%'
    },
    { 
      icon: FileText, 
      label: 'Avg Bills/Day', 
      value: (summary?.avg_bills || 0).toFixed(1), 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-600',
      change: '+5.2%'
    },
    { 
      icon: TrendingUp, 
      label: 'Avg Sale/Bill', 
      value: `₹${(summary?.avg_per_bill || 0).toFixed(0)}`, 
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100',
      textColor: 'text-yellow-600',
      change: '+3.1%'
    },
    { 
      icon: AlertTriangle, 
      label: 'High Variances', 
      value: summary?.high_variance_count || 0, 
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100',
      textColor: 'text-red-600',
      change: '-2.3%',
      isNegative: true
    },
    { 
      icon: BarChart3, 
      label: 'This Month', 
      value: `₹${(summary?.current_month_sales || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, 
      color: 'from-primary-500 to-primary-600',
      bgColor: 'from-primary-50 to-primary-100',
      textColor: 'text-primary-600',
      change: '+15.7%'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="group bg-white rounded-2xl shadow-soft border border-primary-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden relative"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  stat.isNegative ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {stat.isNegative ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              
              <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform">
                {stat.value}
              </div>
              
              <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl shadow-lg p-6 text-white">
        <h3 className="text-lg font-bold mb-4">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold mb-1">{summary?.best_day || 'N/A'}</div>
            <div className="text-sm text-white/80">Best Performing Day</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold mb-1">₹{(summary?.highest_sale || 0).toFixed(0)}</div>
            <div className="text-sm text-white/80">Highest Single Day Sale</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold mb-1">{summary?.consistency_score || 'N/A'}%</div>
            <div className="text-sm text-white/80">Consistency Score</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
