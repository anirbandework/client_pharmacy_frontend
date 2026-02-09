import React, { useState, useEffect } from 'react'
import { invoiceAPI } from '../services/invoiceApi'
import { BarChart3, TrendingUp, Package, DollarSign } from 'lucide-react'

const Analytics = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)

  useEffect(() => {
    fetchAnalytics()
  }, [year, month])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await invoiceAPI.getMonthlyAnalytics(year, month)
      setData(response.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-4 md:p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold">Monthly Analytics</h3>
              <p className="text-xs text-white/80">{monthNames[month - 1]} {year}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="px-3 py-1.5 text-xs md:text-sm bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white font-medium">
              {monthNames.map((name, i) => (
                <option key={i + 1} value={i + 1} className="text-gray-900">{name}</option>
              ))}
            </select>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="px-3 py-1.5 text-xs md:text-sm bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white font-medium">
              {Array.from({ length: 5 }, (_, i) => (
                <option key={i} value={new Date().getFullYear() - i} className="text-gray-900">{new Date().getFullYear() - i}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <Package className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{data.total_invoices || 0}</div>
              <div className="text-xs text-gray-500 uppercase">Total Invoices</div>
            </div>

            <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">₹{(data.total_value || 0).toLocaleString('en-IN')}</div>
              <div className="text-xs text-gray-500 uppercase">Total Value</div>
            </div>

            <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{(data.average_sold_percentage || 0).toFixed(1)}%</div>
              <div className="text-xs text-gray-500 uppercase">Avg Sold</div>
            </div>

            <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
                  <Package className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{data.expiring_alerts || 0}</div>
              <div className="text-xs text-gray-500 uppercase">Expiring Alerts</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-soft border-2 border-green-300 p-4">
              <div className="text-3xl font-bold text-green-700 mb-1">{data.sold_out_invoices || 0}</div>
              <div className="text-sm text-green-600 font-semibold">Sold Out Invoices</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-soft border-2 border-yellow-300 p-4">
              <div className="text-3xl font-bold text-yellow-700 mb-1">{data.partial_invoices || 0}</div>
              <div className="text-sm text-yellow-600 font-semibold">Partial Invoices</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-soft border-2 border-red-300 p-4">
              <div className="text-3xl font-bold text-red-700 mb-1">{data.unsold_invoices || 0}</div>
              <div className="text-sm text-red-600 font-semibold">Unsold Invoices</div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-12 text-center">
          <div className="text-lg font-semibold text-gray-600">No data available</div>
        </div>
      )}
    </div>
  )
}

export default Analytics
