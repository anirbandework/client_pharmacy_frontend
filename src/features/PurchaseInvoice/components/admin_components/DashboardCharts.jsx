import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Package, IndianRupee, AlertTriangle } from 'lucide-react'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

const DashboardCharts = ({ data }) => {
  if (!data) return null

  const hasData = data.spending_trends?.monthly?.length > 0 || 
                  data.supplier_analysis?.top_10?.length > 0 || 
                  data.product_insights?.top_by_spend?.length > 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 text-white" title="Total amount spent on all invoices">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Spend</p>
              <p className="text-2xl font-bold">
                ₹{data.payment_analysis?.summary?.net_amount?.toLocaleString() || 0}
              </p>
            </div>
            <IndianRupee className="w-10 h-10 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-4 text-white" title="Total number of unique suppliers">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Suppliers</p>
              <p className="text-2xl font-bold">{data.supplier_analysis?.top_10?.length || 0}</p>
            </div>
            <Package className="w-10 h-10 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-4 text-white" title="Total number of unique products purchased">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Products</p>
              <p className="text-2xl font-bold">{data.product_insights?.top_by_spend?.length || 0}</p>
            </div>
            <TrendingUp className="w-10 h-10 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-4 text-white" title="Items either already expired or expiring within 30 days">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">At Risk</p>
              <p className="text-2xl font-bold">
                {(data.expiry_timeline?.categories?.find(c => c.name === 'Expired')?.count || 0) +
                 (data.expiry_timeline?.categories?.find(c => c.name === '0-30 Days')?.count || 0)}
              </p>
              <p className="text-xs opacity-75 mt-1">Expired or &lt;30 days</p>
            </div>
            <AlertTriangle className="w-10 h-10 opacity-80" />
          </div>
        </div>
      </div>

      {/* No Data Message */}
      {!hasData && (
        <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-300 dark:text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-slate-400 mb-2">No Invoice Data Available</h3>
          <p className="text-gray-500 dark:text-slate-500">Upload invoices to see analytics and insights here.</p>
        </div>
      )}

      {/* Spending Trends - Line Chart */}
      {data.spending_trends?.monthly?.length > 0 && (
        <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Monthly Spending Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.spending_trends.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} name="Spend" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supplier Distribution - Pie Chart */}
        {data.supplier_analysis?.distribution?.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Top Suppliers Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.supplier_analysis.distribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.supplier_analysis.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Expiry Timeline - Bar Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Expiry Timeline</h3>
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">Items categorized by expiry status</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.expiry_timeline?.categories || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#F59E0B" name="Items" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products - Bar Chart */}
      {data.product_insights?.top_by_spend?.length > 0 && (
        <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Top Products by Spend</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.product_insights.top_by_spend.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="spend" fill="#10B981" name="Spend (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Purchase Patterns - Day of Week */}
      {data.purchase_patterns?.by_day?.some(d => d.count > 0) && (
        <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Purchase Patterns by Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.purchase_patterns.by_day}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="amount" fill="#8B5CF6" name="Amount (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* GST Breakdown */}
      {data.gst_breakdown?.by_rate?.length > 0 && (
        <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">GST Breakdown by Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.gst_breakdown.by_rate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rate" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="amount" fill="#EC4899" name="GST Amount (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default DashboardCharts
