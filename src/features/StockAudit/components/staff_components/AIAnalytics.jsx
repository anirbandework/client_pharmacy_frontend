import { useState, useEffect } from 'react'
import { staffStockAuditAPI } from '../../services/staff_stock_audit_apis'
import { Brain, TrendingUp, AlertCircle, Lightbulb, Calendar, Download } from 'lucide-react'
import { Line, Pie, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

const AIAnalytics = () => {
  const [data, setData] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)
    setError(null)
    try {
      const [insights, charts] = await Promise.all([
        staffStockAuditAPI.getAIInsights({ days }),
        staffStockAuditAPI.getAICharts({ days })
      ])
      setData(insights.data)
      setChartData(charts.data)
    } catch (error) {
      console.error('Failed to fetch AI analytics:', error)
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (type) => {
    try {
      let response
      if (type === 'items') {
        response = await staffStockAuditAPI.exportStockItems()
      } else if (type === 'audits') {
        response = await staffStockAuditAPI.exportAuditRecords({ days })
      } else if (type === 'adjustments') {
        response = await staffStockAuditAPI.exportAdjustments({ days })
      }
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${type}_${new Date().toISOString().split('T')[0]}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export data')
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

  if (loading) return <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-8 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div><p className="text-gray-600 dark:text-slate-400">Loading AI Analytics...</p></div>
  if (error) return <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800/40 rounded-xl p-4 text-center text-red-600 dark:text-red-400">{error}</div>
  if (!data) return <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-8 text-center text-gray-500 dark:text-slate-500">No data available</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">AI-Powered Analytics</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <button onClick={() => handleExport('items')} className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-1 text-sm">
              <Download className="w-4 h-4" /> Items
            </button>
            <button onClick={() => handleExport('audits')} className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-1 text-sm">
              <Download className="w-4 h-4" /> Audits
            </button>
            <button onClick={() => handleExport('adjustments')} className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-1 text-sm">
              <Download className="w-4 h-4" /> Adjustments
            </button>
          </div>
          <Calendar className="w-4 h-4" />
          <select value={days} onChange={(e) => setDays(e.target.value)} className="px-3 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white">
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
          <button onClick={fetchAnalytics} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all">Refresh</button>
        </div>
      </div>

      {data.summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 hover:shadow-xl transition-shadow">
            <p className="text-xs md:text-sm text-gray-600 dark:text-slate-400 mb-1">Total Audits</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{data.summary.total_audits}</p>
          </div>
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 hover:shadow-xl transition-shadow">
            <p className="text-xs md:text-sm text-gray-600 dark:text-slate-400 mb-1">Total Items</p>
            <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{data.summary.total_items}</p>
          </div>
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 hover:shadow-xl transition-shadow">
            <p className="text-xs md:text-sm text-gray-600 dark:text-slate-400 mb-1">Discrepancies</p>
            <p className="text-xl md:text-2xl font-bold text-red-600">{data.summary.items_with_discrepancies}</p>
          </div>
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 hover:shadow-xl transition-shadow">
            <p className="text-xs md:text-sm text-gray-600 dark:text-slate-400 mb-1">Discrepancy Value</p>
            <p className="text-xl md:text-2xl font-bold text-red-600">₹{data.summary.total_discrepancy_value}</p>
          </div>
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 hover:shadow-xl transition-shadow">
            <p className="text-xs md:text-sm text-gray-600 dark:text-slate-400 mb-1">Completion Rate</p>
            <p className="text-xl md:text-2xl font-bold text-green-600">{data.summary.audit_completion_rate}%</p>
          </div>
        </div>
      )}

      {chartData && (
        <div className="grid grid-cols-3 gap-4">
          {chartData.discrepancy_trend && (
            <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 col-span-2">
              <h3 className="font-bold text-gray-800 dark:text-white mb-3">Discrepancy Trend</h3>
              <Line data={formatLineChart(chartData.discrepancy_trend)} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          )}
          {chartData.section_discrepancies && (
            <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4">
              <h3 className="font-bold text-gray-800 dark:text-white mb-3">Section Discrepancies</h3>
              <Pie data={formatPieChart(chartData.section_discrepancies)} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          )}
          {chartData.staff_performance && (
            <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 col-span-3">
              <h3 className="font-bold text-gray-800 dark:text-white mb-3">Staff Performance</h3>
              <Bar data={formatBarChart(chartData.staff_performance)} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          )}
        </div>
      )}

      {data.ai_insights ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white">Key Findings</h3>
            </div>
            <ul className="space-y-2">
              {data.ai_insights.findings?.map((f, i) => <li key={i} className="text-sm text-gray-700 dark:text-slate-300">• {f}</li>)}
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white">Risk Areas</h3>
            </div>
            <ul className="space-y-2">
              {data.ai_insights.risks?.map((r, i) => <li key={i} className="text-sm text-gray-700 dark:text-slate-300">• {r}</li>)}
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white">Recommendations</h3>
            </div>
            <ul className="space-y-2">
              {data.ai_insights.recommendations?.map((r, i) => <li key={i} className="text-sm text-gray-700 dark:text-slate-300">• {r}</li>)}
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Brain className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white">Predictions</h3>
            </div>
            <ul className="space-y-2">
              {data.ai_insights.predictions?.map((p, i) => <li key={i} className="text-sm text-gray-700 dark:text-slate-300">• {p}</li>)}
            </ul>
          </div>
        </div>
      ) : data.findings ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800/80 p-4 rounded-lg shadow dark:border dark:border-slate-700/50">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold dark:text-white">Key Findings</h3>
            </div>
            <ul className="space-y-2">
              {data.findings?.map((f, i) => <li key={i} className="text-sm text-gray-700 dark:text-slate-300">• {f}</li>)}
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-800/80 p-4 rounded-lg shadow dark:border dark:border-slate-700/50">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold dark:text-white">Risk Areas</h3>
            </div>
            <ul className="space-y-2">
              {data.risks?.map((r, i) => <li key={i} className="text-sm text-gray-700 dark:text-slate-300">• {r}</li>)}
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-800/80 p-4 rounded-lg shadow dark:border dark:border-slate-700/50">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold dark:text-white">Recommendations</h3>
            </div>
            <ul className="space-y-2">
              {data.recommendations?.map((r, i) => <li key={i} className="text-sm text-gray-700 dark:text-slate-300">• {r}</li>)}
            </ul>
          </div>
          <div className="bg-white dark:bg-slate-800/80 p-4 rounded-lg shadow dark:border dark:border-slate-700/50">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold dark:text-white">Predictions</h3>
            </div>
            <ul className="space-y-2">
              {data.predictions?.map((p, i) => <li key={i} className="text-sm text-gray-700 dark:text-slate-300">• {p}</li>)}
            </ul>
          </div>
        </div>
      ) : null}

      {data.generated_at && (
        <p className="text-xs text-gray-500 dark:text-slate-500 text-center">Generated at: {new Date(data.generated_at).toLocaleString()}</p>
      )}
    </div>
  )
}

export default AIAnalytics
