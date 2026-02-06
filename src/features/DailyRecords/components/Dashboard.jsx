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
      console.log('Dashboard API response:', response.data)
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
      value: summary?.last_7_days?.total_records || 0, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-600',
      change: '+12%'
    },
    { 
      icon: DollarSign, 
      label: 'Total Sales', 
      value: `₹${(summary?.last_7_days?.total_sales || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, 
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      textColor: 'text-green-600',
      change: '+8.5%'
    },
    { 
      icon: FileText, 
      label: 'Avg Daily Sales', 
      value: `₹${(summary?.last_7_days?.average_daily_sales || 0).toFixed(0)}`, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-600',
      change: '+5.2%'
    },
    { 
      icon: TrendingUp, 
      label: 'Latest Sale', 
      value: `₹${(summary?.latest_record?.total_sales || 0).toFixed(0)}`, 
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100',
      textColor: 'text-yellow-600',
      change: '+3.1%'
    },
    { 
      icon: AlertTriangle, 
      label: 'High Variances', 
      value: summary?.last_7_days?.days_with_variance || 0, 
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100',
      textColor: 'text-red-600',
      change: '-2.3%',
      isNegative: true
    },
    { 
      icon: BarChart3, 
      label: 'Last 7 Days', 
      value: `₹${(summary?.last_7_days?.total_sales || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, 
      color: 'from-primary-500 to-primary-600',
      bgColor: 'from-primary-50 to-primary-100',
      textColor: 'text-primary-600',
      change: '+15.7%'
    }
  ]

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="group bg-white rounded-xl shadow-soft border border-primary-100 p-3 md:p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden relative"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-2 md:mb-3">
                <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className={`flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  stat.isNegative ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {stat.isNegative ? <ArrowDown className="w-2 h-2" /> : <ArrowUp className="w-2 h-2" />}
                  {stat.change}
                </div>
              </div>
              
              <div className="text-lg md:text-2xl font-bold text-gray-900 mb-1 group-hover:scale-105 transition-transform">
                {stat.value}
              </div>
              
              <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide font-medium">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl shadow-lg p-4 md:p-5 text-white">
        <h3 className="text-sm md:text-base font-bold mb-3">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-lg md:text-xl font-bold mb-0.5">{summary?.latest_record?.date ? new Date(summary.latest_record.date).toLocaleDateString('en-US', { weekday: 'long' }) : 'N/A'}</div>
            <div className="text-xs text-white/80">Latest Record Day</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-lg md:text-xl font-bold mb-0.5">₹{(summary?.latest_record?.total_sales || 0).toFixed(0)}</div>
            <div className="text-xs text-white/80">Latest Day Sale</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="text-lg md:text-xl font-bold mb-0.5">₹{(summary?.latest_record?.difference || 0).toFixed(0)}</div>
            <div className="text-xs text-white/80">Latest Difference</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
