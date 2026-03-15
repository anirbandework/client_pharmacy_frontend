import { useState, useEffect, useCallback } from 'react'
import {
  X, Package, Tag, Hash, Percent, Layers, ShoppingCart,
  TrendingUp, TrendingDown, Users, Truck, Factory, Star,
  AlertTriangle, Calendar, MapPin, User, BarChart2, Clock
} from 'lucide-react'
import { staffStockAuditAPI } from '../../services/staff_stock_audit_apis'
import { adminStockAuditAPI } from '../../services/admin_stock_audit_apis'
import toast from 'react-hot-toast'

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n, decimals = 2) =>
  n != null ? Number(n).toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : '—'

const fmtDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const Badge = ({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/40',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800/40',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/40',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/40',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/40',
    slate: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[color]}`}>
      {children}
    </span>
  )
}

const StatCard = ({ icon: Icon, label, value, sub, color = 'blue' }) => {
  const bg = {
    blue: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/60 dark:border-blue-800/40',
    green: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/60 dark:border-green-800/40',
    purple: 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200/60 dark:border-purple-800/40',
    amber: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/60 dark:border-amber-800/40',
    red: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200/60 dark:border-red-800/40',
  }
  const iconColor = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    amber: 'text-amber-600 dark:text-amber-400',
    red: 'text-red-600 dark:text-red-400',
  }
  return (
    <div className={`bg-gradient-to-br ${bg[color]} border rounded-xl p-4`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
          {sub && <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{sub}</p>}
        </div>
        <Icon className={`w-5 h-5 mt-0.5 ${iconColor[color]}`} />
      </div>
    </div>
  )
}

const Section = ({ title, icon: Icon, children }) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-4 h-4 text-gray-500 dark:text-slate-400" />
      <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">{title}</h3>
    </div>
    {children}
  </div>
)

// ── Main Component ────────────────────────────────────────────────────────────

const ItemDetailModal = ({ item, mode = 'staff', selectedShop = null, onClose }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchDetail = useCallback(async () => {
    setLoading(true)
    try {
      const api = mode === 'admin' ? adminStockAuditAPI : staffStockAuditAPI
      const params = { product_name: item.product_name }
      if (item.composition) params.composition = item.composition
      if (mode === 'admin' && selectedShop) params.shop_id = selectedShop
      const { data: res } = await api.getProductDetail(params)
      setData(res)
    } catch {
      toast.error('Failed to load product details')
      onClose()
    } finally {
      setLoading(false)
    }
  }, [item, mode, selectedShop])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200/50 dark:border-slate-700/50">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="text-xl font-bold text-white leading-tight truncate">
                {item.product_name}
              </h2>
              {item.composition && (
                <p className="text-blue-100 text-sm mt-1 truncate">{item.composition}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p className="text-sm text-gray-500 dark:text-slate-400">Loading product intelligence...</p>
              </div>
            </div>
          ) : data ? (
            <>
              {/* ── Identity ── */}
              <div className="flex flex-wrap gap-2 mb-6">
                {data.hsn_code && (
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/60 rounded-lg px-3 py-1.5">
                    <Hash className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">HSN: {data.hsn_code}</span>
                  </div>
                )}
                {data.gst_percent != null && (
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/60 rounded-lg px-3 py-1.5">
                    <Percent className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">GST: {data.gst_percent}%</span>
                  </div>
                )}
                {data.manufacturers?.length > 0 && data.manufacturers.map(m => (
                  <div key={m} className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/60 rounded-lg px-3 py-1.5">
                    <Factory className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{m}</span>
                  </div>
                ))}
              </div>

              {/* ── Stock overview stats ── */}
              <Section title="Stock Overview" icon={Package}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  <StatCard icon={Package} label="Current Qty" value={data.current_quantity} sub={`${data.batch_count} batch${data.batch_count !== 1 ? 'es' : ''}`} color="blue" />
                  <StatCard icon={TrendingUp} label="Stock Value" value={`₹${fmt(data.total_current_stock_value)}`} color="green" />
                  <StatCard icon={ShoppingCart} label="Times Sold" value={data.total_times_sold} sub={`${data.total_qty_sold} units total`} color="purple" />
                </div>

                {/* Batches table */}
                {data.batches?.length > 0 && (
                  <div className="rounded-xl border border-gray-200 dark:border-slate-700/50 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-slate-700/40">
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-400">Batch</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-400">Expiry</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 dark:text-slate-400">Qty</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 dark:text-slate-400">MRP</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-400">Location</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                        {data.batches.map((b, i) => {
                          const expiry = b.expiry_date ? new Date(b.expiry_date) : null
                          const daysToExpiry = expiry ? Math.ceil((expiry - new Date()) / 86400000) : null
                          const isExpiringSoon = daysToExpiry != null && daysToExpiry <= 90
                          return (
                            <tr key={i} className="bg-white dark:bg-slate-800">
                              <td className="px-3 py-2">
                                <span className="font-mono text-xs bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200 px-2 py-0.5 rounded">
                                  {b.batch_number || '—'}
                                </span>
                              </td>
                              <td className="px-3 py-2">
                                <span className={isExpiringSoon ? 'text-amber-600 dark:text-amber-400 font-medium text-xs' : 'text-gray-600 dark:text-slate-400 text-xs'}>
                                  {expiry ? expiry.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—'}
                                  {isExpiringSoon && ` (${daysToExpiry}d)`}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-right font-semibold text-gray-900 dark:text-white text-xs">{b.qty_software}</td>
                              <td className="px-3 py-2 text-right text-gray-600 dark:text-slate-400 text-xs">{b.mrp || '—'}</td>
                              <td className="px-3 py-2 text-xs text-gray-500 dark:text-slate-400">
                                {b.section_name ? (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {b.rack_name ? `${b.rack_name} › ` : ''}{b.section_name}
                                  </span>
                                ) : '—'}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </Section>

              {/* ── Financials ── */}
              <Section title="Financial Summary" icon={BarChart2}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <StatCard icon={TrendingDown} label="Total Purchase Value" value={`₹${fmt(data.total_purchase_value_till_date)}`} sub={`${data.total_purchases} invoice${data.total_purchases !== 1 ? 's' : ''}`} color="amber" />
                  <StatCard icon={TrendingUp} label="Total Sales Value" value={`₹${fmt(data.total_sales_value_till_date)}`} color="green" />
                  <StatCard icon={BarChart2} label="Current Stock Value" value={`₹${fmt(data.total_current_stock_value)}`} color="blue" />
                </div>
              </Section>

              {/* ── Forecasting ── */}
              <Section title="Forecasting" icon={Clock}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <StatCard icon={TrendingDown} label="Avg Daily Sales" value={`${fmt(data.avg_daily_sales, 1)} units`} color="purple" />
                  <StatCard
                    icon={Calendar}
                    label="Stock Lasts"
                    value={data.days_stock_will_last != null ? `${data.days_stock_will_last} days` : '—'}
                    color={data.days_stock_will_last != null && data.days_stock_will_last < 14 ? 'red' : 'green'}
                  />
                  <StatCard
                    icon={AlertTriangle}
                    label="Reorder By"
                    value={data.reorder_date ? fmtDate(data.reorder_date) : '—'}
                    color={data.reorder_date && new Date(data.reorder_date) <= new Date(Date.now() + 7 * 86400000) ? 'red' : 'amber'}
                  />
                  <StatCard icon={BarChart2} label="Monthly Revenue %" value={data.monthly_revenue_contribution_pct != null ? `${data.monthly_revenue_contribution_pct}%` : '—'} sub={data.daily_revenue_contribution_pct != null ? `Today: ${data.daily_revenue_contribution_pct}%` : undefined} color="blue" />
                </div>
              </Section>

              {/* ── Vendor analysis ── */}
              {data.vendors?.length > 0 && (
                <Section title="Vendor Analysis" icon={Truck}>
                  <div className="rounded-xl border border-gray-200 dark:border-slate-700/50 overflow-hidden mb-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-slate-700/40">
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-400">Supplier</th>
                          <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 dark:text-slate-400">Purchases</th>
                          <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 dark:text-slate-400">Avg Unit Cost</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-slate-400">Last Purchase</th>
                          <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 dark:text-slate-400"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                        {data.vendors.sort((a, b) => a.avg_unit_price - b.avg_unit_price).map((v, i) => (
                          <tr key={i} className="bg-white dark:bg-slate-800">
                            <td className="px-3 py-2 font-medium text-gray-900 dark:text-white text-xs">{v.supplier_name}</td>
                            <td className="px-3 py-2 text-center text-gray-600 dark:text-slate-400 text-xs">{v.purchase_count}</td>
                            <td className="px-3 py-2 text-right font-mono text-gray-900 dark:text-white text-xs">₹{fmt(v.avg_unit_price)}</td>
                            <td className="px-3 py-2 text-gray-500 dark:text-slate-400 text-xs">{fmtDate(v.last_purchase_date)}</td>
                            <td className="px-3 py-2 text-center">
                              {v.supplier_name === data.most_suitable_vendor && (
                                <Badge color="green"><Star className="w-3 h-3 inline mr-0.5" />Best</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {data.suboptimal_vendor_purchases > 0 && (
                    <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-lg px-3 py-2">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{data.suboptimal_vendor_purchases} purchase{data.suboptimal_vendor_purchases !== 1 ? 's' : ''} made from sub-optimal vendor{data.vendors.length > 2 ? 's' : ''}</span>
                    </div>
                  )}
                </Section>
              )}

              {/* ── Customers ── */}
              {data.customers?.length > 0 && (
                <Section title="Top Customers" icon={Users}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {data.customers.slice(0, 10).map((c, i) => (
                      <div key={i} className="flex items-center justify-between bg-gray-50 dark:bg-slate-700/40 rounded-lg px-3 py-2">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                            {c.customer_name || c.customer_phone}
                          </p>
                          {c.customer_name && (
                            <p className="text-xs text-gray-500 dark:text-slate-400">{c.customer_phone}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end flex-shrink-0 ml-2">
                          <Badge color="purple">{c.purchase_count}x</Badge>
                          {c.last_purchase && (
                            <span className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{fmtDate(c.last_purchase)}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* ── Staff & misc ── */}
              <Section title="Other Details" icon={User}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {data.top_staff && (
                    <StatCard icon={User} label="Top Billing Staff" value={data.top_staff} color="slate" />
                  )}
                  {data.manufacturers?.length > 0 && (
                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-700/20 dark:to-gray-700/20 border border-slate-200/60 dark:border-slate-700/40 rounded-xl p-4">
                      <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Manufacturers</p>
                      <div className="flex flex-wrap gap-1">
                        {data.manufacturers.map(m => <Badge key={m} color="slate">{m}</Badge>)}
                      </div>
                    </div>
                  )}
                  {data.vendors?.length > 0 && (
                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-700/20 dark:to-gray-700/20 border border-slate-200/60 dark:border-slate-700/40 rounded-xl p-4">
                      <p className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">All Vendors</p>
                      <div className="flex flex-wrap gap-1">
                        {data.vendors.map(v => <Badge key={v.supplier_name} color={v.supplier_name === data.most_suitable_vendor ? 'green' : 'slate'}>{v.supplier_name}</Badge>)}
                      </div>
                    </div>
                  )}
                </div>
              </Section>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ItemDetailModal
