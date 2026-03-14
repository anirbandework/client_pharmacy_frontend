import { useState, useEffect } from 'react'
import { billingAdminAPI } from '../../services/admin_billing_apis'
import { IndianRupee, Receipt, TrendingUp, TrendingDown, Store, PercentCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminDashboard = ({ selectedShop = null }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    fetchDashboard()
  }, [selectedShop, days])

  const fetchDashboard = async () => {
    setLoading(true)
    try {
      const params = { days }
      if (selectedShop) params.shop_id = selectedShop
      const { data: res } = await billingAdminAPI.getDashboard(params)
      setData(res)
    } catch {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const stats = data ? [
    { label: 'Total Bills', value: data.overview?.total_bills ?? 0, sub: `${data.overview?.avg_bills_per_day?.toFixed(1) ?? 0}/day`, icon: Receipt, color: 'blue' },
    { label: 'Total Revenue', value: `₹${data.overview?.total_revenue?.toLocaleString() ?? 0}`, sub: `Avg ₹${data.overview?.avg_bill_value?.toFixed(0) ?? 0}/bill`, icon: IndianRupee, color: 'green' },
    { label: 'Total Expenses', value: `₹${data.overview?.total_expenses?.toLocaleString() ?? 0}`, sub: null, icon: TrendingDown, color: 'red' },
    { label: 'Net Profit', value: `₹${data.overview?.net_profit?.toLocaleString() ?? 0}`, sub: `${data.overview?.profit_margin?.toFixed(1) ?? 0}% margin`, icon: TrendingUp, color: 'purple' },
    { label: 'Unique Customers', value: data.customer_insights?.unique_customers ?? 0, sub: `${data.customer_insights?.returning_customers ?? 0} returning`, icon: Store, color: 'orange' },
    { label: 'Avg Discount', value: `₹${data.overview?.total_discount?.toLocaleString() ?? 0}`, sub: 'total given', icon: PercentCircle, color: 'pink' },
  ] : []

  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    pink: 'bg-pink-100 text-pink-600',
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Period:</span>
          {[7, 15, 30, 60, 90].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                days === d ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : data ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 md:p-6 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
                    {stat.sub && <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>}
                  </div>
                  <div className={`p-2 md:p-3 rounded-xl ${colorMap[stat.color]}`}>
                    <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Breakdown */}
          {data.payment_breakdown?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Payment Method Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.payment_breakdown.map((p, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                    <span className="font-medium text-gray-700">{p.method}</span>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">₹{p.amount?.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{p.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Selling */}
          {data.top_selling?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Top Selling Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold">#</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold">Item</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold">Qty</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.top_selling.slice(0, 8).map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-500">{idx + 1}</td>
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
        </>
      ) : null}
    </div>
  )
}

export default AdminDashboard
