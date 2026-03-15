import { useState, useEffect } from 'react'
import { Loader2, Brain, TrendingUp, AlertCircle, Lightbulb, Download, Calendar } from 'lucide-react'
import { Line, Pie, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import AIInsightsCharts from './AIInsightsCharts'
import { adminStockAuditAPI } from '../../services/admin_stock_audit_apis'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

export default function AIInsights({ selectedShop }) {
  const [aiData, setAiData] = useState(null)
  const [dashData, setDashData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [days, setDays] = useState(30)

  useEffect(() => {
    fetchAll()
  }, [selectedShop])

  const fetchAll = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { days }
      if (selectedShop) params.shop_id = selectedShop
      const [aiRes, dashRes] = await Promise.all([
        adminStockAuditAPI.getAdminAIAnalytics(params),
        adminStockAuditAPI.getAdminDashboard(selectedShop ? { shop_id: selectedShop } : {})
      ])
      setAiData(aiRes.data)
      setDashData(dashRes.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (type) => {
    try {
      const params = selectedShop ? { shop_id: selectedShop } : {}
      let response
      if (type === 'items') response = await adminStockAuditAPI.exportStockItems()
      else if (type === 'audits') response = await adminStockAuditAPI.exportAuditRecords({ ...params, days })
      else if (type === 'adjustments') response = await adminStockAuditAPI.exportAdjustments({ ...params, days })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${type}_${new Date().toISOString().split('T')[0]}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error('Export failed:', err)
      alert('Export failed')
    }
  }

  const formatPieChart = (chartData) => ({
    labels: chartData.labels,
    datasets: [{
      data: chartData.data,
      backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  })

  const formatLineChart = (chartData) => ({
    labels: chartData.labels,
    datasets: chartData.datasets.map(ds => ({
      ...ds,
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      tension: 0.4
    }))
  })

  const formatBarChart = (chartData) => ({
    labels: chartData.labels,
    datasets: chartData.datasets.map((ds, idx) => ({
      ...ds,
      backgroundColor: idx === 0 ? '#3b82f6' : '#ef4444',
      borderRadius: 4
    }))
  })

  if (loading) return (
    <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-slate-400">Loading AI Analytics...</p>
    </div>
  )

  if (error) return (
    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800/40 rounded-xl p-4 text-center text-red-600 dark:text-red-400">{error}</div>
  )

  if (!aiData) return null

  const { summary, charts, ai_insights } = aiData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Brain className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">AI-Powered Analytics</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => handleExport('items')} className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-1 text-sm">
            <Download className="w-4 h-4" /> Items
          </button>
          <button onClick={() => handleExport('audits')} className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-1 text-sm">
            <Download className="w-4 h-4" /> Audits
          </button>
          <button onClick={() => handleExport('adjustments')} className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-1 text-sm">
            <Download className="w-4 h-4" /> Adjustments
          </button>
          <Calendar className="w-4 h-4 text-gray-500 dark:text-slate-400" />
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
          <button onClick={fetchAll} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all text-sm">Refresh</button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 hover:shadow-xl transition-shadow">
            <p className="text-xs md:text-sm text-gray-600 dark:text-slate-400 mb-1">Total Audits</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{summary.total_audits}</p>
          </div>
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 hover:shadow-xl transition-shadow">
            <p className="text-xs md:text-sm text-gray-600 dark:text-slate-400 mb-1">Total Items</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{summary.total_items}</p>
          </div>
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 hover:shadow-xl transition-shadow">
            <p className="text-xs md:text-sm text-gray-600 dark:text-slate-400 mb-1">Discrepancies</p>
            <p className="text-xl md:text-2xl font-bold text-red-600">{summary.items_with_discrepancies}</p>
          </div>
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 hover:shadow-xl transition-shadow">
            <p className="text-xs md:text-sm text-gray-600 dark:text-slate-400 mb-1">Discrepancy Value</p>
            <p className="text-xl md:text-2xl font-bold text-red-600">{summary.total_discrepancy_value}</p>
          </div>
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 hover:shadow-xl transition-shadow">
            <p className="text-xs md:text-sm text-gray-600 dark:text-slate-400 mb-1">Completion Rate</p>
            <p className="text-xl md:text-2xl font-bold text-green-600">{summary.audit_completion_rate}%</p>
          </div>
        </div>
      )}

      {/* Staff-style charts: Discrepancy Trend, Section Discrepancies, Staff Performance */}
      {charts && (
        <div className="grid grid-cols-3 gap-4">
          {charts.discrepancy_trend && charts.discrepancy_trend.labels?.length > 0 && (
            <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 col-span-2">
              <h3 className="font-bold text-gray-800 dark:text-white mb-3">Discrepancy Trend</h3>
              <Line data={formatLineChart(charts.discrepancy_trend)} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          )}
          {charts.section_discrepancies && charts.section_discrepancies.labels?.length > 0 && (
            <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4">
              <h3 className="font-bold text-gray-800 dark:text-white mb-3">Section Discrepancies</h3>
              <Pie data={formatPieChart(charts.section_discrepancies)} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          )}
          {charts.staff_performance && charts.staff_performance.labels?.length > 0 && (
            <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 col-span-3">
              <h3 className="font-bold text-gray-800 dark:text-white mb-3">Staff Performance</h3>
              <Bar data={formatBarChart(charts.staff_performance)} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          )}
          {(!charts.discrepancy_trend?.labels?.length && !charts.section_discrepancies?.labels?.length) && (
            <div className="col-span-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl p-8 text-center text-gray-500 dark:text-slate-400">
              No audit activity in the selected period to display charts.
            </div>
          )}
        </div>
      )}

      {/* AI Insights: Findings / Risks / Recommendations / Predictions */}
      {ai_insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"><TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-blue-600" /></div>
              <h3 className="font-bold text-gray-800 dark:text-white">Key Findings</h3>
            </div>
            <ul className="space-y-2">
              {ai_insights.findings?.map((f, i) => <li key={i} className="text-sm text-gray-700 dark:text-slate-300">• {f}</li>)}
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg"><AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" /></div>
              <h3 className="font-bold text-gray-800 dark:text-white">Risk Areas</h3>
            </div>
            <ul className="space-y-2">
              {ai_insights.risks?.map((r, i) => <li key={i} className="text-sm text-gray-700 dark:text-slate-300">• {r}</li>)}
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg"><Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" /></div>
              <h3 className="font-bold text-gray-800 dark:text-white">Recommendations</h3>
            </div>
            <ul className="space-y-2">
              {ai_insights.recommendations?.map((r, i) => <li key={i} className="text-sm text-gray-700 dark:text-slate-300">• {r}</li>)}
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg"><Brain className="w-4 h-4 md:w-5 md:h-5 text-purple-600" /></div>
              <h3 className="font-bold text-gray-800 dark:text-white">Predictions</h3>
            </div>
            <ul className="space-y-2">
              {ai_insights.predictions?.map((p, i) => <li key={i} className="text-sm text-gray-700 dark:text-slate-300">• {p}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Original dashboard charts: Discrepancy Distribution, Expiry Timeline, Stock Value, Audit Performance, Stock Movement, Adjustments */}
      {dashData && (
        <AIInsightsCharts
          discrepancyData={dashData.discrepancy_analysis}
          expiryData={dashData.expiry_analysis}
          valueData={dashData.stock_value_analysis}
          auditData={dashData.audit_performance}
          movementData={dashData.stock_movement}
          adjustmentData={dashData.adjustment_analysis}
        />
      )}

      {aiData.generated_at && (
        <p className="text-xs text-gray-500 dark:text-slate-400 text-center">Generated at: {new Date(aiData.generated_at).toLocaleString()}</p>
      )}
    </div>
  )
}
