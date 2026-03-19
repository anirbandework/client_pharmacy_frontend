import { useMemo } from 'react'
import { X, AlertTriangle, TrendingUp, Package, Info, ArrowRight } from 'lucide-react'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const parseMRP = (mrp) => {
  if (!mrp) return 0
  const n = parseFloat(String(mrp).replace(/[^\d.]/g, ''))
  return isNaN(n) ? 0 : n
}

/** Markup % from existing prices — fallback to 35 if not set */
const markupFromPrices = (unit_price, selling_price) => {
  if (!unit_price || unit_price <= 0 || !selling_price || selling_price <= 0) return 35
  return Math.round(((selling_price / unit_price) - 1) * 100 * 100) / 100
}

/** Selling price at given markup */
const sellingFromMarkup = (unit_price, markup_pct) => {
  if (!unit_price) return 0
  return Math.round(unit_price * (1 + markup_pct / 100) * 100) / 100
}

/** Profit margin on MRP = (MRP − cost) / MRP × 100 */
const computeMRPMargin = (unit_price, mrp_float) => {
  if (!mrp_float || mrp_float <= 0 || !unit_price || unit_price <= 0) return null
  return Math.round(((mrp_float - unit_price) / mrp_float) * 100 * 100) / 100
}

// ─── Badge ────────────────────────────────────────────────────────────────────

const MarginBadge = ({ value }) => {
  if (value === null || value === undefined)
    return <span className="text-gray-400 dark:text-slate-500 text-xs">—</span>
  const color =
    value >= 30 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    : value >= 15 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {value.toFixed(1)}%
    </span>
  )
}

// ─── Item Row ─────────────────────────────────────────────────────────────────

const ItemRow = ({ item, overMRP }) => {
  const mrp_f = parseMRP(item.mrp)
  const markup = markupFromPrices(item.unit_price, item.selling_price)
  const selling = item.selling_price > 0 ? item.selling_price : sellingFromMarkup(item.unit_price, 35)
  const mrp_m = computeMRPMargin(item.unit_price, mrp_f)
  const displayMarkup = item.selling_price > 0 ? markup : 35

  return (
    <div className={`grid grid-cols-12 gap-2 items-center px-4 py-3 text-sm
      ${overMRP
        ? 'bg-red-50 dark:bg-red-900/10 border-l-2 border-red-400'
        : 'hover:bg-gray-50 dark:hover:bg-slate-700/30'}`}
    >
      {/* Product */}
      <div className="col-span-4 min-w-0">
        <p className="font-medium text-gray-800 dark:text-white truncate text-xs" title={item.product_name}>
          {item.product_name || '—'}
        </p>
        {item.batch_number && (
          <p className="text-[10px] text-gray-400 dark:text-slate-500 truncate">Batch: {item.batch_number}</p>
        )}
      </div>

      {/* Cost */}
      <div className="col-span-2 text-right">
        <p className="text-gray-600 dark:text-slate-400 font-mono text-xs">
          ₹{item.unit_price?.toFixed(2) ?? '0.00'}
        </p>
      </div>

      {/* MRP */}
      <div className="col-span-1 text-right">
        <p className="text-gray-600 dark:text-slate-400 font-mono text-xs">
          {mrp_f > 0 ? `₹${mrp_f.toFixed(2)}` : '—'}
        </p>
      </div>

      {/* Markup % */}
      <div className="col-span-1 text-center">
        <MarginBadge value={displayMarkup} />
      </div>

      {/* Selling price */}
      <div className="col-span-2 text-right">
        <p className={`font-mono text-xs font-semibold
          ${overMRP ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white'}`}>
          ₹{selling.toFixed(2)}
        </p>
        {overMRP && <p className="text-[10px] text-red-500 font-semibold">Over MRP!</p>}
      </div>

      {/* MRP Margin */}
      <div className="col-span-2 text-right">
        <MarginBadge value={mrp_m} />
        {mrp_m !== null && <p className="text-[9px] text-gray-400 dark:text-slate-500 mt-0.5">on MRP</p>}
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

/**
 * MarginReviewCard — view-only margin info card shown before the main action.
 *
 * Props:
 *   invoice    — full invoice object with items[]
 *   actionLabel — label on the proceed button (e.g. "Open Invoice", "Open Editor", "Approve")
 *   onProceed  — called when user clicks the proceed button
 *   onClose    — called when user clicks Cancel / ✕
 */
const MarginReviewCard = ({ invoice, actionLabel = 'OK, Proceed', onProceed, onClose }) => {
  const items = invoice.items || []

  const { normal, flagged } = useMemo(() => {
    const n = [], f = []
    for (const item of items) {
      const mrp_f = parseMRP(item.mrp)
      const selling = item.selling_price > 0 ? item.selling_price : sellingFromMarkup(item.unit_price, 35)
      if (mrp_f > 0 && selling > mrp_f) f.push(item)
      else n.push(item)
    }
    return { normal: n, flagged: f }
  }, [items])

  const avgMarkup = items.length > 0
    ? items.reduce((s, it) => s + markupFromPrices(it.unit_price, it.selling_price), 0) / items.length
    : 0

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-700">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                Margin Overview
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-slate-400">
                  {invoice.invoice_number}
                </span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {invoice.supplier_name} · {items.length} item{items.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Summary bar */}
        <div className="flex items-center gap-6 px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex-shrink-0 flex-wrap">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Avg Markup</p>
            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{avgMarkup.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Items Over MRP</p>
            <p className={`text-sm font-bold ${flagged.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {flagged.length}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Invoice Value</p>
            <p className="text-sm font-bold text-gray-700 dark:text-slate-300">₹{invoice.net_amount?.toLocaleString()}</p>
          </div>
        </div>

        {/* Info note */}
        <div className="px-6 py-2 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30 flex-shrink-0">
          <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
          <p className="text-[11px] text-blue-600 dark:text-blue-400">
            <strong>Markup %</strong> is based on cost price. &nbsp;|&nbsp;
            <strong>MRP Margin</strong> = (MRP − Cost) / MRP × 100 — max profit possible if sold at MRP.&nbsp;
            Items showing 35% are using the default (no selling price set yet).
          </p>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-900/40 text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-500 flex-shrink-0">
          <div className="col-span-4">Product</div>
          <div className="col-span-2 text-right">Cost/Unit</div>
          <div className="col-span-1 text-right">MRP</div>
          <div className="col-span-1 text-center">Markup</div>
          <div className="col-span-2 text-right">Selling Price</div>
          <div className="col-span-2 text-right">MRP Margin</div>
        </div>

        {/* Rows */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700/50">
          {normal.map(item => <ItemRow key={item.id} item={item} overMRP={false} />)}

          {flagged.length > 0 && (
            <>
              <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 flex items-center gap-2 border-t-2 border-red-300 dark:border-red-800">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                  {flagged.length} item{flagged.length !== 1 ? 's' : ''} — Selling Price exceeds MRP. Adjust in the editor.
                </p>
              </div>
              {flagged.map(item => <ItemRow key={item.id} item={item} overMRP={true} />)}
            </>
          )}

          {items.length === 0 && (
            <div className="flex items-center justify-center py-12 text-gray-400 dark:text-slate-500">
              <Package className="w-8 h-8 mr-2" /> No items found
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3 flex-shrink-0 bg-white dark:bg-slate-800">
          {flagged.length > 0 && (
            <p className="text-xs text-red-500 flex items-center gap-1 mr-auto">
              <AlertTriangle className="w-3.5 h-3.5" />
              {flagged.length} item{flagged.length !== 1 ? 's' : ''} priced above MRP — review in editor
            </p>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium rounded-xl border border-gray-300 dark:border-slate-600
              text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onProceed}
            className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white
              transition-colors flex items-center gap-2"
          >
            {actionLabel}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MarginReviewCard
