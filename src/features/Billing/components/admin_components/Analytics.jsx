import React, { useState, useEffect } from 'react'
import { analyticsAPI } from '../../services/analytics'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, IndianRupee, Receipt, Calendar, Target } from 'lucide-react'
import toast from 'react-hot-toast'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d']

const Analytics = () => {
  const [days, setDays] = useState(30)
  const [overview, setOverview] = useState(null)
  const [comparison, setComparison] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [days])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const [overviewRes, comparisonRes] = await Promise.all([
        analyticsAPI.getOverview(days),
        analyticsAPI.getComparison(days)
      ])
      setOverview(overviewRes.data)
      setComparison(comparisonRes.data)
    } catch (error) {
      toast.error('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading analytics...</div>
  if (!overview) return <div className="text-center py-8">No data available</div>

  const { summary, daily_trends, day_wise_analysis, expense_breakdown, predictions } = overview

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Business Analytics</h2>
          <div className="flex gap-2">
            {[7, 15, 30, 60, 90].map(d => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-4 py-2 rounded-lg ${days === d ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-90">Total Sales</p>
              <p className="text-3xl font-bold mt-1">₹{summary.total_sales.toLocaleString()}</p>
              <p className="text-xs mt-2">Avg: ₹{summary.avg_daily_sales.toFixed(2)}/day</p>
            </div>
            <IndianRupee className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-90">Total Bills</p>
              <p className="text-3xl font-bold mt-1">{summary.total_bills}</p>
              <p className="text-xs mt-2">Avg: {summary.avg_bills_per_day.toFixed(1)}/day</p>
            </div>
            <Receipt className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-90">Avg Bill Value</p>
              <p className="text-3xl font-bold mt-1">₹{summary.avg_bill_value.toFixed(2)}</p>
            </div>
            <Target className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-90">Net Revenue</p>
              <p className="text-3xl font-bold mt-1">₹{summary.net_revenue.toLocaleString()}</p>
              <p className="text-xs mt-2">After expenses</p>
            </div>
            <TrendingUp className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Period Comparison */}
      {comparison && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Period Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600">Sales Change</p>
              <div className="flex items-center gap-2 mt-2">
                <p className={`text-2xl font-bold ${comparison.changes.sales_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {comparison.changes.sales_change >= 0 ? '+' : ''}{comparison.changes.sales_change.toFixed(1)}%
                </p>
                {comparison.changes.sales_change >= 0 ? <TrendingUp className="w-5 h-5 text-green-600" /> : <TrendingDown className="w-5 h-5 text-red-600" />}
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600">Bills Change</p>
              <div className="flex items-center gap-2 mt-2">
                <p className={`text-2xl font-bold ${comparison.changes.bills_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {comparison.changes.bills_change >= 0 ? '+' : ''}{comparison.changes.bills_change.toFixed(1)}%
                </p>
                {comparison.changes.bills_change >= 0 ? <TrendingUp className="w-5 h-5 text-green-600" /> : <TrendingDown className="w-5 h-5 text-red-600" />}
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600">Expenses Change</p>
              <div className="flex items-center gap-2 mt-2">
                <p className={`text-2xl font-bold ${comparison.changes.expenses_change <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {comparison.changes.expenses_change >= 0 ? '+' : ''}{comparison.changes.expenses_change.toFixed(1)}%
                </p>
                {comparison.changes.expenses_change <= 0 ? <TrendingDown className="w-5 h-5 text-green-600" /> : <TrendingUp className="w-5 h-5 text-red-600" />}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Trend Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Daily Sales Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={daily_trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Sales" />
            <Line type="monotone" dataKey="expenses" stroke="#ff7300" name="Expenses" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bills Trend Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Daily Bills Count</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={daily_trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="bills" fill="#82ca9d" name="Bills" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Day-wise Analysis */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Day-wise Average Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={Object.entries(day_wise_analysis).map(([day, data]) => ({ day, ...data }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avg_sales" fill="#8884d8" name="Avg Sales" />
            <Bar dataKey="avg_bills" fill="#82ca9d" name="Avg Bills" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Expense Breakdown */}
      {expense_breakdown.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expense_breakdown}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {expense_breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {expense_breakdown.map((exp, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="font-medium">{exp.category}</span>
                  </div>
                  <span className="font-bold">₹{exp.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Predictions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">7-Day Forecast</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 bg-blue-50">
            <p className="text-sm text-gray-600">Predicted Sales (Next 7 Days)</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">₹{predictions.next_7_days_sales.toLocaleString()}</p>
          </div>
          <div className="border rounded-lg p-4 bg-green-50">
            <p className="text-sm text-gray-600">Predicted Daily Average</p>
            <p className="text-3xl font-bold text-green-600 mt-2">₹{predictions.avg_daily_prediction.toFixed(2)}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">* Predictions based on recent 7-day average trend</p>
      </div>
    </div>
  )
}

export default Analytics
