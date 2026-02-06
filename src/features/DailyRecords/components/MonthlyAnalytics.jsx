import React, { useState, useEffect } from 'react'
import { dailyRecordsAPI } from '../services/dailyRecords'
import { Calendar, TrendingUp, DollarSign, FileText, Download, Sparkles } from 'lucide-react'

const MonthlyAnalytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [year, month])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await dailyRecordsAPI.getMonthlyAnalytics(year, month)
      setAnalytics(response.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const response = await dailyRecordsAPI.exportExcel(year, month)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `daily_records_${year}_${month}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      alert('Export failed')
    } finally {
      setExporting(false)
    }
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Monthly Analytics</h3>
              <p className="text-sm text-white/80">Detailed insights for {monthNames[month - 1]} {year}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={month} 
              onChange={(e) => setMonth(Number(e.target.value))} 
              className="px-4 py-2.5 text-sm bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-white/50 font-medium"
            >
              {monthNames.map((name, i) => (
                <option key={i + 1} value={i + 1} className="text-gray-900">{name}</option>
              ))}
            </select>
            <select 
              value={year} 
              onChange={(e) => setYear(Number(e.target.value))} 
              className="px-4 py-2.5 text-sm bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-white/50 font-medium"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <option key={i} value={new Date().getFullYear() - i} className="text-gray-900">{new Date().getFullYear() - i}</option>
              ))}
            </select>
            <button 
              onClick={handleExport} 
              disabled={exporting}
              className="flex items-center gap-2 px-5 py-2.5 text-sm bg-white text-purple-600 rounded-lg hover:bg-white/90 transition-all font-semibold shadow-lg hover:scale-105 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {exporting ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
        </div>
      ) : analytics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-soft border border-primary-100 p-6 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">Days</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{analytics.total_days || 0}</div>
            <div className="text-sm text-gray-500">Total Days Recorded</div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-primary-100 p-6 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">Revenue</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">₹{(analytics.total_sales || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            <div className="text-sm text-gray-500">Total Sales</div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-primary-100 p-6 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">Bills</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{(analytics.total_bills || 0).toLocaleString('en-IN')}</div>
            <div className="text-sm text-gray-500">Total Bills Generated</div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-primary-100 p-6 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">Average</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">₹{(analytics.avg_daily_sales || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            <div className="text-sm text-gray-500">Avg Daily Sales</div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-soft border border-primary-100 p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <div className="text-lg font-semibold text-gray-600 mb-2">No data available</div>
          <div className="text-sm text-gray-500">No records found for the selected period</div>
        </div>
      )}
    </div>
  )
}

export default MonthlyAnalytics
