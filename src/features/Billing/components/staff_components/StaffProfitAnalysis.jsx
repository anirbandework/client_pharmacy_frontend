import { useState, useEffect, useCallback } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
  TrendingUp, TrendingDown, IndianRupee, Receipt, Target, ShoppingCart,
  Users, Search, X, RefreshCw, AlertCircle
} from 'lucide-react'
import { billingAPI } from '../../services/staff_billing_apis'
import toast from 'react-hot-toast'

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6']
const PIE_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
const pct = (n) => `${Number(n || 0).toFixed(1)}%`

const KPICard = ({ label, value, sub, icon: Icon, color, trend, trendVal }) => (
  <div className={`bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3 shadow-sm`}>
    <div className={`p-2.5 rounded-xl ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-slate-500 font-medium truncate">{label}</p>
      <p className="text-lg font-bold text-slate-800 truncate">{value}</p>
      {sub && <p className="text-xs text-slate-400 truncate">{sub}</p>}
    </div>
    {trend !== undefined && (
      <div className={`flex items-center gap-0.5 text-xs font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
        {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {pct(Math.abs(trendVal ?? trend))}
      </div>
    )}
  </div>
)

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="flex gap-2">
          <span>{p.name}:</span>
          <span className="font-semibold">{p.name === 'Bills' ? p.value : fmt(p.value)}</span>
        </p>
      ))}
    </div>
  )
}

const PERIOD_OPTIONS = [
  { label: '7 Days', days: 7 },
  { label: '30 Days', days: 30 },
  { label: '90 Days', days: 90 },
  { label: '6 Months', days: 180 },
  { label: '1 Year', days: 365 },
]

export default function StaffProfitAnalysis() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [days, setDays] = useState(30)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [activeSection, setActiveSection] = useState('overview')

  const fetchData = useCallback(async (searchVal) => {
    setLoading(true)
    try {
      const params = { days }
      if (searchVal) params.search = searchVal
      const { data: res } = await billingAPI.getProfitAnalysis(params)
      setData(res)
    } catch {
      toast.error('Failed to load profit analysis')
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    fetchData(search)
  }, [fetchData])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    fetchData(searchInput)
  }

  const clearSearch = () => {
    setSearchInput('')
    setSearch('')
    fetchData('')
  }

  const s = data?.summary
  const isProfit = (s?.net_profit ?? 0) >= 0

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'trends', label: 'P&L Trends' },
    { id: 'breakdown', label: 'Breakdown' },
    { id: 'items', label: 'Top Items' },
  ]

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-wrap gap-3 items-center shadow-sm">
        <div className="flex gap-1 flex-wrap">
          {PERIOD_OPTIONS.map(opt => (
            <button
              key={opt.days}
              onClick={() => setDays(opt.days)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                days === opt.days
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-48">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search by customer, phone, bill no..."
                className="w-full pl-9 pr-8 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {searchInput && (
                <button type="button" onClick={clearSearch} className="absolute right-2 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>
            <button type="submit" className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              Search
            </button>
          </form>
        </div>
        <button onClick={() => fetchData(search)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && !data && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
          <p className="text-slate-500">Loading profit analysis...</p>
        </div>
      )}

      {data && (
        <>
          {/* Section Nav */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-1.5 inline-flex gap-1 w-full overflow-x-auto">
            {sections.map(sec => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`py-2 px-4 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex-1 ${
                  activeSection === sec.id
                    ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {activeSection === 'overview' && (
            <div className="space-y-4">
              {/* KPI Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                <KPICard label="Total Revenue" value={fmt(s?.total_revenue)} sub={`${s?.total_bills} bills`} icon={IndianRupee} color="bg-indigo-500" />
                <KPICard label="Total Expenses" value={fmt(s?.total_expenses)} sub="All categories" icon={Receipt} color="bg-orange-500" />
                <KPICard
                  label="Net Profit"
                  value={fmt(s?.net_profit)}
                  sub={pct(s?.profit_margin) + ' margin'}
                  icon={isProfit ? TrendingUp : TrendingDown}
                  color={isProfit ? 'bg-green-500' : 'bg-red-500'}
                />
                <KPICard label="Avg Bill Value" value={fmt(s?.avg_bill_value)} sub="Per transaction" icon={ShoppingCart} color="bg-purple-500" />
                <KPICard label="Discounts Given" value={fmt(s?.total_discounts_given)} sub={pct(s?.discount_rate) + ' of sales'} icon={Target} color="bg-pink-500" />
                <KPICard label="Tax Collected" value={fmt(s?.total_tax_collected)} sub="GST (SGST+CGST)" icon={Users} color="bg-teal-500" />
              </div>

              {/* Profit Margin Banner */}
              <div className={`rounded-xl p-4 flex items-center gap-4 ${isProfit ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className={`p-3 rounded-xl ${isProfit ? 'bg-green-500' : 'bg-red-500'}`}>
                  {isProfit ? <TrendingUp className="w-6 h-6 text-white" /> : <AlertCircle className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <p className={`font-bold text-lg ${isProfit ? 'text-green-700' : 'text-red-700'}`}>
                    {isProfit ? 'Profitable Period' : 'Loss Period'} — {pct(s?.profit_margin)} margin
                  </p>
                  <p className={`text-sm ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                    {s?.start_date} to {s?.end_date} &nbsp;·&nbsp; Net {fmt(s?.net_profit)} on {fmt(s?.total_revenue)} revenue
                  </p>
                </div>
              </div>

              {/* Mini chart */}
              {data.daily_pnl?.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Revenue vs Expenses (Last {days} days)</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data.daily_pnl}>
                      <defs>
                        <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(5)} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" fill="url(#rev)" strokeWidth={2} />
                      <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f59e0b" fill="url(#exp)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Staff performance table */}
              {data.staff_performance?.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Staff Performance</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="text-left py-2 px-3 text-slate-500 font-medium">Staff</th>
                          <th className="text-right py-2 px-3 text-slate-500 font-medium">Bills</th>
                          <th className="text-right py-2 px-3 text-slate-500 font-medium">Revenue</th>
                          <th className="text-right py-2 px-3 text-slate-500 font-medium">Avg Bill</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.staff_performance.map((s, i) => (
                          <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                            <td className="py-2 px-3 font-medium text-slate-700">{s.staff_name}</td>
                            <td className="py-2 px-3 text-right text-slate-600">{s.bill_count}</td>
                            <td className="py-2 px-3 text-right text-indigo-600 font-semibold">{fmt(s.total_revenue)}</td>
                            <td className="py-2 px-3 text-right text-slate-600">{fmt(s.avg_bill)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* P&L TRENDS */}
          {activeSection === 'trends' && (
            <div className="space-y-4">
              {data.daily_pnl?.length > 0 ? (
                <>
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Daily Revenue, Expenses & Net Profit</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={data.daily_pnl}>
                        <defs>
                          <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(5)} />
                        <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" fill="url(#gRev)" strokeWidth={2} />
                        <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f59e0b" fill="url(#gExp)" strokeWidth={2} />
                        <Area type="monotone" dataKey="net_profit" name="Net Profit" stroke="#22c55e" fill="url(#gProfit)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Daily Bill Count & Discounts</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={data.daily_pnl}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(5)} />
                        <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar yAxisId="left" dataKey="bills" name="Bills" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                        <Bar yAxisId="right" dataKey="discounts" name="Discounts" fill="#ec4899" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Day-wise table */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                      <h3 className="text-sm font-semibold text-slate-700">Daily P&L Table</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-50">
                          <tr>
                            {['Date', 'Day', 'Bills', 'Revenue', 'Expenses', 'Net Profit', 'Margin', 'Discounts'].map(h => (
                              <th key={h} className="text-left py-2.5 px-3 text-slate-500 font-medium whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[...data.daily_pnl].reverse().map((row, i) => (
                            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                              <td className="py-2 px-3 font-medium text-slate-700">{row.date}</td>
                              <td className="py-2 px-3 text-slate-500">{row.day}</td>
                              <td className="py-2 px-3 text-slate-600">{row.bills}</td>
                              <td className="py-2 px-3 text-indigo-600 font-semibold">{fmt(row.revenue)}</td>
                              <td className="py-2 px-3 text-orange-600">{fmt(row.expenses)}</td>
                              <td className={`py-2 px-3 font-semibold ${row.net_profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>{fmt(row.net_profit)}</td>
                              <td className={`py-2 px-3 ${row.profit_margin >= 0 ? 'text-green-600' : 'text-red-500'}`}>{pct(row.profit_margin)}</td>
                              <td className="py-2 px-3 text-pink-600">{fmt(row.discounts)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">No trend data available</div>
              )}
            </div>
          )}

          {/* BREAKDOWN */}
          {activeSection === 'breakdown' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Expense pie */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Expense Breakdown</h3>
                  {data.expense_breakdown?.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie data={data.expense_breakdown} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={80} label={({ category, percentage }) => `${category} ${percentage.toFixed(0)}%`} labelLine={false}>
                            {data.expense_breakdown.map((_, i) => (
                              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v) => fmt(v)} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-1.5 mt-2">
                        {data.expense_breakdown.map((e, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                              <span className="text-slate-600 capitalize">{e.category}</span>
                            </div>
                            <div className="flex gap-3 text-right">
                              <span className="font-semibold text-slate-700">{fmt(e.amount)}</span>
                              <span className="text-slate-400 w-10">{pct(e.percentage)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-slate-400 text-sm text-center py-8">No expense data</p>
                  )}
                </div>

                {/* Payment mix pie */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Payment Method Mix</h3>
                  {data.payment_split && (
                    <>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Cash', value: data.payment_split.cash },
                              { name: 'Card', value: data.payment_split.card },
                              { name: 'Online', value: data.payment_split.online }
                            ].filter(d => d.value > 0)}
                            dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}
                          >
                            <Cell fill="#6366f1" />
                            <Cell fill="#22c55e" />
                            <Cell fill="#06b6d4" />
                          </Pie>
                          <Tooltip formatter={(v) => fmt(v)} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-1.5 mt-2">
                        {[
                          { label: 'Cash', value: data.payment_split.cash, pct: data.payment_split.cash_pct, color: '#6366f1' },
                          { label: 'Card', value: data.payment_split.card, pct: data.payment_split.card_pct, color: '#22c55e' },
                          { label: 'Online', value: data.payment_split.online, pct: data.payment_split.online_pct, color: '#06b6d4' },
                        ].filter(d => d.value > 0).map((d, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                              <span className="text-slate-600">{d.label}</span>
                            </div>
                            <div className="flex gap-3">
                              <span className="font-semibold text-slate-700">{fmt(d.value)}</span>
                              <span className="text-slate-400 w-10">{pct(d.pct)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Revenue vs Profit bar */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Revenue vs Expenses vs Profit (Bar)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.daily_pnl?.slice(-14)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(5)} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="net_profit" name="Net Profit" fill="#22c55e" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* TOP ITEMS */}
          {activeSection === 'items' && (
            <div className="space-y-4">
              {data.top_items?.length > 0 ? (
                <>
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Top 10 Items by Revenue</h3>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={data.top_items} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                        <YAxis type="category" dataKey="item_name" tick={{ fontSize: 10 }} width={120} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="total_revenue" name="Revenue" radius={[0, 4, 4, 0]}>
                          {data.top_items.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                      <h3 className="text-sm font-semibold text-slate-700">Item Revenue Details</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-50">
                          <tr>
                            {['#', 'Item', 'Qty Sold', 'Revenue', 'Avg Discount', 'Transactions'].map(h => (
                              <th key={h} className="text-left py-2.5 px-3 text-slate-500 font-medium whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {data.top_items.map((item, i) => (
                            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                              <td className="py-2 px-3">
                                <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: COLORS[i % COLORS.length] }}>{i + 1}</span>
                              </td>
                              <td className="py-2 px-3 font-medium text-slate-700 max-w-[180px] truncate">{item.item_name}</td>
                              <td className="py-2 px-3 text-slate-600">{item.total_quantity}</td>
                              <td className="py-2 px-3 font-semibold text-indigo-600">{fmt(item.total_revenue)}</td>
                              <td className="py-2 px-3 text-pink-600">{pct(item.avg_discount_pct)}</td>
                              <td className="py-2 px-3 text-slate-600">{item.transaction_count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">No item data for this period</div>
              )}
            </div>
          )}

        </>
      )}
    </div>
  )
}
