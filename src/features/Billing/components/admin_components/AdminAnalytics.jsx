import { useState, useEffect } from 'react'
import { Loader2, Info, Store, BarChart3, Brain, TrendingUp, IndianRupee, Receipt, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { billingAdminAPI } from '../../services/admin_billing_apis'
import { adminApi } from '../../../Admin&SuperAdmin/services/admin&superAminApi'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#FF6B9D', '#C084FC']

export default function BillingAdminAnalytics() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [dashboardData, setDashboardData] = useState(null)
  const [aiInsights, setAIInsights] = useState(null)
  const [loading, setLoading] = useState({})
  const [error, setError] = useState({})
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)
  const [days, setDays] = useState(30)

  useEffect(() => {
    fetchShops()
  }, [])

  useEffect(() => {
    if (selectedShop !== null || days) {
      setDashboardData(null)
      setAIInsights(null)
      setLoading({})
      setError({})
    }
  }, [selectedShop, days])

  const fetchShops = async () => {
    try {
      const response = await adminApi.getShops()
      setShops(response)
    } catch (error) {
      toast.error('Failed to fetch shops')
    }
  }

  const fetchDashboard = async () => {
    if (dashboardData) return
    setLoading(prev => ({ ...prev, dashboard: true }))
    setError(prev => ({ ...prev, dashboard: null }))
    try {
      const params = { days }
      if (selectedShop) params.shop_id = selectedShop
      const { data } = await billingAdminAPI.getDashboard(params)
      setDashboardData(data)
    } catch (err) {
      setError(prev => ({ ...prev, dashboard: err.response?.data?.detail || 'Failed to load dashboard' }))
    } finally {
      setLoading(prev => ({ ...prev, dashboard: false }))
    }
  }

  const fetchAIInsights = async () => {
    if (aiInsights) return
    setLoading(prev => ({ ...prev, ai: true }))
    setError(prev => ({ ...prev, ai: null }))
    try {
      const params = { days }
      if (selectedShop) params.shop_id = selectedShop
      const { data } = await billingAdminAPI.getAIInsights(params)
      setAIInsights(data.insights || data)
    } catch (err) {
      const errorMsg = err.code === 'ECONNABORTED' 
        ? 'Request timed out. AI analysis takes time, please try again.'
        : err.response?.data?.detail || 'Failed to load AI insights'
      setError(prev => ({ ...prev, ai: errorMsg }))
      toast.error(errorMsg)
    } finally {
      setLoading(prev => ({ ...prev, ai: false }))
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'dashboard') fetchDashboard()
    else if (tab === 'ai') fetchAIInsights()
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            <Store className="w-5 h-5 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">Filter by Shop:</label>
            <select
              value={selectedShop || ''}
              onChange={(e) => {
                setSelectedShop(e.target.value ? parseInt(e.target.value) : null)
                setDashboardData(null)
                setAIInsights(null)
              }}
              className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Shops</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.shop_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Period:</label>
            {[7, 15, 30, 60, 90].map(d => (
              <button
                key={d}
                onClick={() => {
                  setDays(d)
                  setDashboardData(null)
                  setAIInsights(null)
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  days === d
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
        <Info className="w-4 h-4 text-blue-600" />
        <p className="text-sm text-blue-800">
          Comprehensive billing analytics including revenue, expenses, customer insights, and AI-powered recommendations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => handleTabChange('dashboard')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'dashboard'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Dashboard
        </button>
        <button
          onClick={() => handleTabChange('ai')}
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'ai'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Brain className="w-4 h-4" />
          AI Insights
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        loading.dashboard ? (
          <div className="bg-white rounded-xl shadow-md p-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : error.dashboard ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error.dashboard}</p>
          </div>
        ) : dashboardData ? (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Receipt className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Bills</p>
                    <p className="text-xl font-bold text-gray-800">
                      {dashboardData.overview?.total_bills}
                    </p>
                    <p className="text-xs text-gray-500">{dashboardData.overview?.avg_bills_per_day?.toFixed(1)}/day</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <IndianRupee className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-xl font-bold text-gray-800">
                      ₹{dashboardData.overview?.total_revenue?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Expenses</p>
                    <p className="text-xl font-bold text-gray-800">
                      ₹{dashboardData.overview?.total_expenses?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Package className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Net Profit</p>
                    <p className="text-xl font-bold text-gray-800">
                      ₹{dashboardData.overview?.net_profit?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{dashboardData.overview?.profit_margin?.toFixed(1)}% margin</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Methods</h3>
              {dashboardData.payment_breakdown?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dashboardData.payment_breakdown.map((payment, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                        <span className="font-medium text-gray-700">{payment.method}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">₹{payment.amount?.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{payment.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Revenue & Profit Trends */}
            {dashboardData.daily_trends?.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue & Profit Trends</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={dashboardData.daily_trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10b981" fill="#10b981" name="Revenue" />
                    <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" name="Expenses" />
                    <Line type="monotone" dataKey="profit" stroke="#8b5cf6" strokeWidth={2} name="Profit" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {/* Payment Method Trends */}
            {dashboardData.daily_trends?.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Method Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dashboardData.daily_trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="cash" stackId="1" stroke="#10b981" fill="#10b981" name="Cash" />
                    <Area type="monotone" dataKey="card" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Card" />
                    <Area type="monotone" dataKey="online" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="Online" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Top Selling Items & Hourly Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Selling Items */}
              {dashboardData.top_selling?.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Top Selling Items</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold">Item</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold">Qty</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.top_selling.slice(0, 10).map((item, idx) => (
                          <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="px-3 py-2">{item.item}</td>
                            <td className="px-3 py-2 text-right">{item.quantity}</td>
                            <td className="px-3 py-2 text-right font-semibold">₹{item.revenue?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Hourly Distribution */}
              {dashboardData.hourly_distribution?.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Hourly Sales Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData.hourly_distribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="bills" fill="#3b82f6" name="Bills" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Expense & Bill Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Expense Breakdown */}
              {dashboardData.expenses?.breakdown?.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Expense Breakdown</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData.expenses.breakdown}
                        dataKey="amount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) => `${entry.category}: ₹${entry.amount}`}
                      >
                        {dashboardData.expenses.breakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              {/* Bill Value Distribution */}
              {dashboardData.bill_value_distribution?.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Bill Value Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData.bill_value_distribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8b5cf6" name="Bills" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        ) : null
      )}

      {activeTab === 'ai' && (
        loading.ai ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Generating AI Insights...</h3>
            <p className="text-sm text-gray-500">Analyzing {days} days of billing data</p>
            <p className="text-xs text-gray-400 mt-2">This may take up to 2 minutes</p>
          </div>
        ) : error.ai ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error.ai}</p>
          </div>
        ) : aiInsights ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            {dashboardData && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Receipt className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Bills</p>
                      <p className="text-xl font-bold text-gray-800">
                        {dashboardData.overview?.total_bills}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <IndianRupee className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="text-xl font-bold text-gray-800">
                        ₹{dashboardData.overview?.total_revenue?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Expenses</p>
                      <p className="text-xl font-bold text-gray-800">
                        ₹{dashboardData.overview?.total_expenses?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Package className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Net Profit</p>
                      <p className="text-xl font-bold text-gray-800">
                        ₹{dashboardData.overview?.net_profit?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">AI-Powered Business Insights</h2>
                </div>
              </div>
              
              {typeof aiInsights === 'string' ? (
                <div className="bg-white rounded-lg p-6 prose prose-sm max-w-none prose-headings:text-gray-800 prose-h2:text-lg prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-base prose-h3:font-semibold prose-h3:mt-4 prose-h3:mb-2 prose-p:text-gray-700 prose-p:leading-relaxed prose-ul:text-gray-700 prose-li:my-1 prose-strong:text-gray-900 prose-strong:font-semibold">
                  <ReactMarkdown>{aiInsights}</ReactMarkdown>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    {aiInsights?.error || 'AI insights unavailable. Please configure GEMINI_API_KEY.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null
      )}
    </div>
  )
}
