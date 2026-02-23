import React, { useState, useEffect } from 'react'
import { TrendingUp, Package, DollarSign, FileText } from 'lucide-react'
import { purchaseInvoiceAPI } from '../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await purchaseInvoiceAPI.getSummary()
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!stats) {
    return null
  }

  const statCards = [
    {
      title: 'Total Invoices',
      value: stats.total_invoices,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Amount',
      value: `₹${stats.total_amount.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Items',
      value: stats.total_items,
      icon: Package,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Avg Invoice',
      value: `₹${stats.average_invoice_amount.toFixed(2)}`,
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className="w-6 h-6 text-gray-700" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {stats.top_suppliers && stats.top_suppliers.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Top Suppliers</h3>
          <div className="space-y-3">
            {stats.top_suppliers.map((supplier, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{supplier.name}</span>
                <span className="text-green-600 font-semibold">₹{supplier.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
