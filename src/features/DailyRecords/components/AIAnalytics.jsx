import React, { useState, useEffect } from 'react'
import { dailyRecordsAPI } from '../services/dailyRecords'
import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Brain, TrendingUp, AlertCircle, Sparkles, Target } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

const AIAnalytics = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(90)

  useEffect(() => {
    fetchAIData()
  }, [days])

  const fetchAIData = async () => {
    setLoading(true)
    try {
      const response = await dailyRecordsAPI.getAIDashboard()
      setData(response.data)
    } catch (error) {
      console.error('AI Analytics error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Brain className="w-10 h-10 md:w-12 md:h-12 text-primary-600 animate-pulse mb-3" />
        <div className="text-sm md:text-base text-gray-600">AI analyzing...</div>
      </div>
    )
  }

  if (!data) return <div className="text-center py-12 text-sm text-gray-500">No AI data available</div>

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-xl shadow-lg p-4 md:p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <Brain className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold">AI Analytics</h2>
              <p className="text-white/90 text-xs">Intelligent insights</p>
            </div>
          </div>
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="px-3 py-1.5 text-xs md:text-sm bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white font-medium">
            <option value={30} className="text-gray-900">30 Days</option>
            <option value={60} className="text-gray-900">60 Days</option>
            <option value={90} className="text-gray-900">90 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-3 md:p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-1.5 md:p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div className="text-[10px] font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
              {data.key_metrics?.sales_growth_rate > 0 ? '+' : ''}{(data.key_metrics?.sales_growth_rate || 0).toFixed(1)}%
            </div>
          </div>
          <div className="text-lg md:text-xl font-bold text-gray-900 mb-0.5">₹{(data.key_metrics?.avg_daily_sales || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <div className="text-xs text-gray-500">Avg Daily Sales</div>
        </div>

        <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-3 md:p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-1.5 md:p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div className="text-[10px] font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Accuracy</div>
          </div>
          <div className="text-lg md:text-xl font-bold text-gray-900 mb-0.5">{(data.key_metrics?.cash_accuracy_rate || 0).toFixed(1)}%</div>
          <div className="text-xs text-gray-500">Cash Accuracy</div>
        </div>

        <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-3 md:p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="p-1.5 md:p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="text-[10px] font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">Per Bill</div>
          </div>
          <div className="text-lg md:text-xl font-bold text-gray-900 mb-0.5">₹{(data.key_metrics?.avg_bill_value || 0).toFixed(0)}</div>
          <div className="text-xs text-gray-500">Avg Bill Value</div>
        </div>
      </div>

      {/* Alerts */}
      {data.alerts && data.alerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
            <h3 className="text-sm md:text-base font-bold text-gray-900">AI Alerts</h3>
          </div>
          <div className="space-y-2">
            {data.alerts.map((alert, i) => (
              <div key={i} className={`p-3 rounded-lg border-l-4 ${
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                alert.type === 'danger' ? 'bg-red-50 border-red-500' :
                'bg-blue-50 border-blue-500'
              }`}>
                <div className="text-xs md:text-sm font-semibold text-gray-900 mb-0.5">{alert.message}</div>
                <div className="text-[10px] text-gray-600">Priority: {alert.priority}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        {data.chart_data?.sales_trend && (
          <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-3 md:p-4">
            <h3 className="text-sm md:text-base font-bold text-gray-900 mb-3">Sales Trend</h3>
            <Line data={data.chart_data.sales_trend} options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } } }} />
          </div>
        )}

        {data.chart_data?.day_performance && (
          <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-3 md:p-4">
            <h3 className="text-sm md:text-base font-bold text-gray-900 mb-3">Day Performance</h3>
            <Bar data={data.chart_data.day_performance} options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } } }} />
          </div>
        )}

        {data.chart_data?.cash_differences && (
          <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-3 md:p-4">
            <h3 className="text-sm md:text-base font-bold text-gray-900 mb-3">Cash Differences</h3>
            <Line data={data.chart_data.cash_differences} options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } } }} />
          </div>
        )}

        {data.chart_data?.bills_vs_sales && (
          <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-3 md:p-4">
            <h3 className="text-sm md:text-base font-bold text-gray-900 mb-3">Bills vs Sales</h3>
            <Line data={data.chart_data.bills_vs_sales} options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } } }} />
          </div>
        )}
      </div>

      {/* AI Insights */}
      {data.ai_insights?.ai_analysis && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-soft border-2 border-indigo-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Brain className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h3 className="text-sm md:text-base font-bold text-gray-900">AI Insights</h3>
          </div>
          <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm">
            <pre className="whitespace-pre-wrap text-xs md:text-sm text-gray-700 leading-relaxed font-sans">{data.ai_insights.ai_analysis}</pre>
          </div>
        </div>
      )}

      {/* Predictions */}
      {data.predictions && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {data.predictions.sales_forecast && (
            <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4">
              <h3 className="text-sm md:text-base font-bold text-gray-900 mb-3">Sales Forecast</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                  <span className="text-xs text-gray-600">Next 30 Days</span>
                  <span className="text-sm md:text-base font-bold text-green-700">₹{(data.predictions.sales_forecast.avg_predicted_daily_sales || 0).toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                  <span className="text-xs text-gray-600">Confidence</span>
                  <span className="text-sm md:text-base font-bold text-blue-700">{(data.predictions.sales_forecast.confidence_score || 0).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )}

          {data.predictions.cash_difference_forecast && (
            <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4">
              <h3 className="text-sm md:text-base font-bold text-gray-900 mb-3">Cash Risk</h3>
              <div className="space-y-2">
                <div className={`flex justify-between items-center p-2 rounded-lg ${
                  data.predictions.cash_difference_forecast.risk_level === 'high' ? 'bg-red-50' :
                  data.predictions.cash_difference_forecast.risk_level === 'medium' ? 'bg-yellow-50' : 'bg-green-50'
                }`}>
                  <span className="text-xs text-gray-600">Risk Level</span>
                  <span className="text-sm md:text-base font-bold uppercase">{data.predictions.cash_difference_forecast.risk_level}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs text-gray-600">Avg Difference</span>
                  <span className="text-sm md:text-base font-bold text-gray-700">₹{Math.abs(data.predictions.cash_difference_forecast.avg_predicted_difference || 0).toFixed(0)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AIAnalytics
