import React, { useState, useEffect } from 'react'
import { invoiceAPI } from '../services/invoiceApi'
import { Package, TrendingUp, AlertTriangle, Calendar, DollarSign, ShoppingCart } from 'lucide-react'

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const response = await invoiceAPI.getDashboard()
      setData(response.data)
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

  const summary = data?.current_month_summary || {}
  const stats = [
    { icon: Package, label: 'Total Invoices', value: summary.total_invoices || 0, color: 'from-blue-500 to-blue-600', bgColor: 'from-blue-50 to-blue-100' },
    { icon: DollarSign, label: 'Total Value', value: `₹${(summary.total_amount || 0).toLocaleString('en-IN')}`, color: 'from-green-500 to-green-600', bgColor: 'from-green-50 to-green-100' },
    { icon: ShoppingCart, label: 'Items Sold', value: `${(summary.overall_sold_percentage || 0).toFixed(1)}%`, color: 'from-purple-500 to-purple-600', bgColor: 'from-purple-50 to-purple-100' },
    { icon: AlertTriangle, label: 'Expiring Soon', value: summary.expiring_items_count || 0, color: 'from-red-500 to-red-600', bgColor: 'from-red-50 to-red-100' },
    { icon: TrendingUp, label: 'Green Invoices', value: summary.green_invoices || 0, color: 'from-green-500 to-green-600', bgColor: 'from-green-50 to-green-100' },
    { icon: Calendar, label: 'Red Invoices', value: summary.red_invoices || 0, color: 'from-red-500 to-red-600', bgColor: 'from-red-50 to-red-100' }
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="group bg-white rounded-xl shadow-soft border border-primary-100 p-3 md:p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-2 md:mb-3">
                <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
              </div>
              <div className="text-lg md:text-2xl font-bold text-gray-900 mb-1 group-hover:scale-105 transition-transform">{stat.value}</div>
              <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wide font-medium">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {data?.pending_alerts && data.pending_alerts.length > 0 && (
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl shadow-lg p-4 md:p-5 text-white">
          <h3 className="text-sm md:text-base font-bold mb-3">⚠️ Pending Alerts ({data.pending_alerts.length})</h3>
          <div className="space-y-2">
            {data.pending_alerts.slice(0, 3).map((alert, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="text-xs md:text-sm font-semibold mb-1">{alert.message}</div>
                <div className="text-[10px] text-white/80">{alert.item_name} • {alert.days_to_expiry} days left</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.recent_invoices && data.recent_invoices.length > 0 && (
        <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4">
          <h3 className="text-sm md:text-base font-bold text-gray-900 mb-3">Recent Invoices</h3>
          <div className="space-y-2">
            {data.recent_invoices.slice(0, 3).map((invoice, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{invoice.invoice_number}</div>
                  <div className="text-xs text-gray-600">{invoice.supplier_name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{(invoice.sold_percentage || 0).toFixed(1)}%</div>
                  <div className={`text-xs px-2 py-0.5 rounded-full ${invoice.color_code === 'green' ? 'bg-green-100 text-green-700' : invoice.color_code === 'yellow' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {invoice.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
