import { useState, useEffect } from 'react'
import {
  TrendingUp, Package, ShoppingCart, IndianRupee, Info,
  ArrowUpDown, ChevronDown, ChevronUp, RefreshCw,
  AlertCircle, Award, BarChart3, Store
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
import toast from 'react-hot-toast'
import { adminPurchaseInvoiceAPI } from '../../services/admin_purchase_invoice_apis'
import { adminApi } from '../../../Admin&SuperAdmin/services/admin&superAminApi'
import ProductAutocomplete from '../shared/ProductAutocomplete'
import CompositionAutocomplete from '../shared/CompositionAutocomplete'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

const fmt  = (n) => (n ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })
const fmtP = (n) => `${(n ?? 0).toFixed(1)}%`

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, color = 'blue', icon: Icon }) => {
  const palette = {
    blue:   'bg-blue-50 dark:bg-blue-900/20   border-blue-200 dark:border-blue-800/40   text-blue-700 dark:text-blue-300   text-blue-500',
    green:  'bg-green-50 dark:bg-green-900/20  border-green-200 dark:border-green-800/40  text-green-700 dark:text-green-300  text-green-500',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/40 text-orange-700 dark:text-orange-300 text-orange-500',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-300 text-purple-500',
  }
  const [bg, border, val, ic] = (palette[color] || palette.blue).split(' ')
  return (
    <div className={`${bg} ${border} border rounded-xl p-4`}>
      {Icon && <Icon className={`w-5 h-5 ${ic} mb-2`} />}
      <p className="text-xs text-gray-500 dark:text-slate-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${val}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-slate-600 mt-1">{sub}</p>}
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────
const SectionTitle = ({ icon: Icon, title, sub, color = 'text-gray-800' }) => (
  <div className="flex items-start gap-2 mb-4">
    {Icon && <Icon className={`w-5 h-5 mt-0.5 ${color}`} />}
    <div>
      <h3 className={`font-bold ${color}`}>{title}</h3>
      {sub && <p className="text-xs text-gray-500 dark:text-slate-500 mt-0.5">{sub}</p>}
    </div>
  </div>
)

// ─── Distributor comparison row (expandable) ──────────────────────────────────
const CompareRow = ({ item }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">{item.product_name}</p>
          {item.composition && <p className="text-xs text-gray-500 dark:text-slate-500 truncate">{item.composition}</p>}
        </div>
        <div className="flex items-center gap-3 ml-3 shrink-0">
          {item.mrp && (
            <span className="text-xs bg-gray-100 dark:bg-slate-700/50 text-gray-600 dark:text-slate-400 px-2 py-0.5 rounded">MRP ₹{item.mrp}</span>
          )}
          <span className="text-xs font-medium text-blue-600">{item.supplier_count} suppliers</span>
          {item.margin_gap > 0 && (
            <span className="text-xs font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/40 px-2 py-0.5 rounded">
              {item.margin_gap.toFixed(1)}% gap
            </span>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-gray-400 dark:text-slate-600" /> : <ChevronDown className="w-4 h-4 text-gray-400 dark:text-slate-600" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-700/30 p-4 space-y-2">
          {item.suppliers.map((s, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                s.badge === 'best'  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/40' :
                s.badge === 'worst' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/40' :
                                      'bg-white dark:bg-slate-800/80 border-gray-200 dark:border-slate-700/50'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-800 dark:text-white text-sm">{s.supplier_name}</p>
                  {s.badge === 'best'  && <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-300 font-semibold">★ Best Deal</span>}
                  {s.badge === 'worst' && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100   text-red-700   border border-red-300   font-semibold">↓ Costlier</span>}
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-500 mt-0.5">
                  Qty: {s.total_qty} · Spent: ₹{s.total_purchase_value.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800 dark:text-white">₹{s.avg_purchase_price}/unit</p>
                {s.purchase_margin !== null
                  ? <p className={`text-xs font-semibold ${s.badge === 'best' ? 'text-green-600' : s.badge === 'worst' ? 'text-red-500' : 'text-gray-600 dark:text-slate-400'}`}>
                      {s.purchase_margin.toFixed(1)}% margin at MRP
                    </p>
                  : <p className="text-xs text-gray-400 dark:text-slate-600">MRP not available</p>
                }
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-400 dark:text-slate-600 pt-1">
            Purchase Margin = (MRP − Purchase Price) / MRP × 100. Higher = better deal for the shop.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
const MarginPlayground = () => {
  const [data, setData]           = useState(null)
  const [loading, setLoading]     = useState(false)
  const [shops, setShops]         = useState([])
  const [selectedShop, setSelectedShop] = useState(null)
  const [filters, setFilters] = useState({
    product_name: '', composition: '', date_from: '', date_to: ''
  })

  useEffect(() => {
    adminApi.getShops()
      .then(res => setShops(res))
      .catch(() => toast.error('Failed to fetch shops'))
  }, [])

  useEffect(() => { fetchData() }, [selectedShop])

  const fetchData = async () => {
    setLoading(true)
    try {
      const params = {}
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v })
      if (selectedShop) params.shop_id = selectedShop
      const res = await adminPurchaseInvoiceAPI.getMarginPlayground(params)
      setData(res.data)
    } catch {
      toast.error('Failed to load margin data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* ── Shop Filter ────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md p-4">
        <div className="flex items-center gap-3">
          <Store className="w-5 h-5 text-gray-600 dark:text-slate-400" />
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Filter by Shop:</label>
          <select
            value={selectedShop || ''}
            onChange={e => setSelectedShop(e.target.value ? parseInt(e.target.value) : null)}
            className="flex-1 max-w-xs px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
          >
            <option value="">All Shops</option>
            {shops.map(s => (
              <option key={s.id} value={s.id}>{s.shop_name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-gray-200 dark:border-slate-700/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <h2 className="font-bold text-gray-800 dark:text-white">Purchase Margin Analysis</h2>
        </div>
        <div className="flex items-center gap-1.5 mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-lg px-3 py-2">
          <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <p className="text-xs text-blue-700">
            Products are <strong>purchased from distributors, not yet sold</strong>.
            All margins are <strong>potential margins at MRP</strong>.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wide">Product Name</label>
            <ProductAutocomplete
              value={filters.product_name}
              onChange={(val) => setFilters(f => ({ ...f, product_name: val }))}
              placeholder="e.g. Paracetamol 500mg"
              className="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-300 w-full dark:bg-slate-700 dark:text-white dark:placeholder-slate-400" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wide">Composition</label>
            <CompositionAutocomplete
              value={filters.composition}
              onChange={(val) => setFilters(f => ({ ...f, composition: val }))}
              placeholder="e.g. Amoxicillin 250mg"
              className="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-300 w-full dark:bg-slate-700 dark:text-white dark:placeholder-slate-400" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wide">Invoice From</label>
            <input type="date" value={filters.date_from}
              onChange={e => setFilters(f => ({ ...f, date_from: e.target.value }))}
              className="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-300 w-full dark:bg-slate-700 dark:text-white" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wide">Invoice To</label>
            <input type="date" value={filters.date_to}
              onChange={e => setFilters(f => ({ ...f, date_to: e.target.value }))}
              className="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-300 w-full dark:bg-slate-700 dark:text-white" />
          </div>
        </div>
        <button onClick={fetchData} disabled={loading}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Loading...' : 'Apply'}
        </button>
      </div>

      {/* ── Loading ─────────────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* ── Empty ───────────────────────────────────────────────────────────── */}
      {!loading && !data && (
        <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-gray-200 dark:border-slate-700/50 p-12 text-center">
          <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-slate-500">No data. Ensure invoices are admin-verified.</p>
        </div>
      )}

      {!loading && data && (
        <>
          {/* ── 1. Summary Cards ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={ShoppingCart}   label="Total Purchase Value"         value={`₹${fmt(data.summary.total_purchase_value)}`}    sub={`${data.summary.total_items} line items`}         color="blue"   />
            <StatCard icon={TrendingUp}     label="Potential Profit at MRP"      value={`₹${fmt(data.summary.total_potential_profit)}`}   sub="If all stock sold at MRP"                         color="green"  />
            <StatCard icon={IndianRupee}    label="Avg Purchase Margin"          value={fmtP(data.summary.avg_purchase_margin)}           sub={`${data.summary.items_with_mrp} items with MRP`}  color="orange" />
            <StatCard icon={ArrowUpDown}    label="Multi-Supplier Products"      value={data.summary.products_with_multiple_suppliers}    sub="Compare & save"                                   color="purple" />
          </div>

          {/* ── 2. Savings alert ─────────────────────────────────────────────── */}
          {data.summary.products_with_multiple_suppliers > 0 && (
            <div className="bg-amber-50 dark:bg-yellow-900/20 border border-amber-200 dark:border-yellow-800/40 rounded-xl p-4 flex items-start gap-3">
              <Award className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-amber-800">Savings Opportunity</p>
                <p className="text-sm text-amber-700 mt-0.5">
                  <strong>{data.summary.products_with_multiple_suppliers} products</strong> are bought from multiple distributors at different prices.
                  Check the <strong>Distributor Comparison</strong> section below to find better deals.
                </p>
              </div>
            </div>
          )}

          {/* ── 3. Margin Distribution ───────────────────────────────────────── */}
          {data.margin_distribution?.some(d => d.count > 0) && (
            <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-gray-200 dark:border-slate-700/50 p-5">
              <SectionTitle icon={BarChart3} title="Purchase Margin Distribution"
                sub="(MRP − Purchase Price) / MRP × 100 — items with known MRP only" />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.margin_distribution} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip formatter={(v) => [`${v} products`, 'Count']} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {data.margin_distribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ── 4. Distributor Comparison ─────────────────────────────────────── */}
          <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-gray-200 dark:border-slate-700/50 p-5">
            <SectionTitle icon={ArrowUpDown} color="text-blue-700"
              title="Distributor Comparison — Same Medicine, Different Prices"
              sub="Only products purchased from 2+ distributors are shown. Click a row to expand." />

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-800 dark:text-blue-300">
                <strong>How to use:</strong> The <span className="text-green-700 font-semibold">★ Best Deal</span> distributor gives you the highest purchase margin on that product.
                Prefer them for future orders. The <strong>% gap</strong> shows how much margin you lose by choosing the costlier distributor.
              </p>
            </div>

            {data.distributor_comparison.length === 0 ? (
              <div className="text-center py-8">
                <ArrowUpDown className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-slate-500">No products yet with 2+ distributors.</p>
                <p className="text-xs text-gray-400 dark:text-slate-600 mt-1">Comparison appears when the same medicine is purchased from different suppliers.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.distributor_comparison.map((item, idx) => (
                  <CompareRow key={idx} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* ── 5. Supplier Rankings ──────────────────────────────────────────── */}
          <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-gray-200 dark:border-slate-700/50 p-5">
            <SectionTitle icon={Store} color="text-green-700"
              title="Distributor Rankings — Best Margin Providers"
              sub="Average Purchase Margin across all products from each distributor. Higher = cheaper prices = more profit for your shop." />

            <div className="space-y-2">
              {data.supplier_breakdown.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/30 rounded-lg border border-gray-200 dark:border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                      idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-400' : 'bg-blue-400'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white text-sm">{s.supplier_name}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-500">{s.product_count} products · {s.item_count} items · ₹{fmt(s.total_purchase_value)} spent</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold ${
                      s.avg_margin_offered >= 30 ? 'text-green-600' :
                      s.avg_margin_offered >= 15 ? 'text-orange-500' : 'text-red-500'
                    }`}>
                      {fmtP(s.avg_margin_offered)} avg margin
                    </p>
                    <p className="text-xs text-gray-400 dark:text-slate-600">
                      ₹{fmt(s.total_potential_profit)} potential profit
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 6. Top Products ───────────────────────────────────────────────── */}
          <div className="bg-white dark:bg-slate-800/80 rounded-xl border border-gray-200 dark:border-slate-700/50 p-5">
            <SectionTitle icon={Package} color="text-purple-700"
              title="Top Products by Purchase Value"
              sub="How much was spent buying each product. Potential Profit = (MRP − Purchase Price) × Quantity." />

            <div className="space-y-2">
              {data.top_products.map((p, idx) => (
                <div key={idx} className="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg border border-gray-200 dark:border-slate-700/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">{p.product_name}</p>
                      {p.composition && <p className="text-xs text-gray-500 dark:text-slate-500 truncate">{p.composition}</p>}
                      {p.suppliers.length > 0 && (
                        <p className="text-xs text-blue-500 mt-1 truncate">
                          {p.suppliers.slice(0, 2).join(' · ')}{p.suppliers.length > 2 ? ` +${p.suppliers.length - 2}` : ''}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gray-800 dark:text-white">₹{fmt(p.purchase_value)}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-600">Purchase Value</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-white dark:bg-slate-800/80 rounded p-2 text-center border border-gray-100 dark:border-slate-700/50">
                      <p className="text-gray-400 dark:text-slate-600 mb-0.5">Qty Purchased</p>
                      <p className="font-bold text-gray-700 dark:text-slate-300">{p.quantity}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800/80 rounded p-2 text-center border border-gray-100 dark:border-slate-700/50">
                      <p className="text-gray-400 dark:text-slate-600 mb-0.5">Potential Profit</p>
                      <p className={`font-bold ${p.potential_profit > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                        {p.potential_profit > 0 ? `₹${fmt(p.potential_profit)}` : 'MRP missing'}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800/80 rounded p-2 text-center border border-gray-100 dark:border-slate-700/50">
                      <p className="text-gray-400 dark:text-slate-600 mb-0.5">Avg Margin</p>
                      <p className={`font-bold ${
                        p.avg_purchase_margin >= 30 ? 'text-green-600' :
                        p.avg_purchase_margin >= 15 ? 'text-orange-500' : 'text-gray-500'
                      }`}>
                        {p.avg_purchase_margin > 0 ? fmtP(p.avg_purchase_margin) : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Footer note ───────────────────────────────────────────────────── */}
          {data.summary.items_without_mrp > 0 && (
            <div className="flex items-start gap-2 px-3 py-2 bg-gray-50 dark:bg-slate-700/30 border border-gray-200 dark:border-slate-700/50 rounded-xl">
              <AlertCircle className="w-4 h-4 text-gray-400 dark:text-slate-600 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-500 dark:text-slate-500">
                <strong>{data.summary.items_without_mrp} items</strong> are missing MRP data — their potential profit and margin can't be calculated.
                Ensure MRP is extracted correctly from invoices.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MarginPlayground
