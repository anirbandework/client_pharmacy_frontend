import { useState, useEffect } from 'react'
import { billingAdminAPI } from '../../services/admin_billing_apis'
import { adminApi } from '../../../Admin&SuperAdmin/services/admin&superAminApi'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, IndianRupee, Receipt, Target, Store } from 'lucide-react'
import toast from 'react-hot-toast'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d']

const Analytics = () => {
  const [days, setDays] = useState(30)
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchShops()
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [days, selectedShop])

  const fetchShops = async () => {
    try {
      const response = await adminApi.getShops()
      setShops(response)
    } catch {
      toast.error('Failed to fetch shops')
    }
  }

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const params = { days }
      if (selectedShop) params.shop_id = selectedShop
      const { data: res } = await billingAdminAPI.getDashboard(params)
      setData(res)
    } catch {
      toast.error('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  // Compute day-wise averages from daily_trends
  const getDayWiseAnalysis = (trends = []) => {
    const dayMap = {}
    for (const row of trends) {
      const day = new Date(row.date).toLocaleDateString('en-US', { weekday: 'long' })
      if (!dayMap[day]) dayMap[day] = { sales: 0, bills: 0, count: 0 }
      dayMap[day].sales += row.revenue || 0
      dayMap[day].bills += row.bills || 0
      dayMap[day].count += 1
    }
    return Object.entries(dayMap).map(([day, d]) => ({
      day,
      avg_sales: d.count ? Math.round(d.sales / d.count) : 0,
      avg_bills: d.count ? Math.round(d.bills / d.count) : 0
    }))
  }

  // Compute simple 7-day prediction from last 7 days of daily_trends
  const getPredictions = (trends = []) => {
    const last7 = trends.slice(-7)
    const avgDaily = last7.length
      ? last7.reduce((s, r) => s + (r.revenue || 0), 0) / last7.length
      : 0
    return {
      next_7_days_sales: Math.round(avgDaily * 7),
      avg_daily_prediction: Math.round(avgDaily)
    }
  }

  if (loading) return <div className="text-center py-8">Loading analytics...</div>
  if (!data) return <div className="text-center py-8">No data available</div>

  const { overview, daily_trends = [], expenses } = data
  const expense_breakdown = expenses?.breakdown || []
  const day_wise_analysis = getDayWiseAnalysis(daily_trends)
  const predictions = getPredictions(daily_trends)

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            <Store className="w-5 h-5 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">Filter by Shop:</label>
            <select
              value={selectedShop || ''}
              onChange={(e) => setSelectedShop(e.target.value ? parseInt(e.target.value) : null)}
              className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Shops</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>{shop.shop_name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Period:</label>
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
              <p className="text-3xl font-bold mt-1">₹{overview.total_revenue?.toLocaleString()}</p>
              <p className="text-xs mt-2">Avg: ₹{(overview.total_revenue / days).toFixed(2)}/day</p>
            </div>
            <IndianRupee className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-90">Total Bills</p>
              <p className="text-3xl font-bold mt-1">{overview.total_bills}</p>
              <p className="text-xs mt-2">Avg: {overview.avg_bills_per_day?.toFixed(1)}/day</p>
            </div>
            <Receipt className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-90">Avg Bill Value</p>
              <p className="text-3xl font-bold mt-1">₹{overview.avg_bill_value?.toFixed(2)}</p>
            </div>
            <Target className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-90">Net Revenue</p>
              <p className="text-3xl font-bold mt-1">₹{overview.net_profit?.toLocaleString()}</p>
              <p className="text-xs mt-2">After expenses</p>
            </div>
            <TrendingUp className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>

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
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Sales" />
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
      {day_wise_analysis.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Day-wise Average Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={day_wise_analysis}>
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
      )}

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
                  {expense_breakdown.map((_, index) => (
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
            <p className="text-3xl font-bold text-green-600 mt-2">₹{predictions.avg_daily_prediction.toLocaleString()}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">* Predictions based on recent 7-day average trend</p>
      </div>
    </div>
  )
}

export default Analytics
