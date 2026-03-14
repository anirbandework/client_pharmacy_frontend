import { useState, useEffect, useCallback } from 'react'
import { Search, Layers, List, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react'
import { staffStockAuditAPI } from '../../services/staff_stock_audit_apis'
import { adminStockAuditAPI } from '../../services/admin_stock_audit_apis'
import toast from 'react-hot-toast'

const PER_PAGE = 50

const ConsolidatedStockView = ({ mode = 'staff', selectedShop = null }) => {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showBatches, setShowBatches] = useState(false)
  const [expanded, setExpanded] = useState({})

  const fetchItems = useCallback(async (currentPage) => {
    setLoading(true)
    try {
      const params = { page: currentPage, per_page: PER_PAGE }
      if (search) params.search = search
      if (mode === 'admin' && selectedShop) params.shop_id = selectedShop

      const api = mode === 'admin' ? adminStockAuditAPI : staffStockAuditAPI
      const { data } = await api.getConsolidatedItems(params)
      setItems(data.items || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    } catch {
      toast.error('Failed to load consolidated stock')
    } finally {
      setLoading(false)
    }
  }, [mode, selectedShop, search])

  // Reset to page 1 and refetch when search/shop changes
  useEffect(() => {
    setPage(1)
    setExpanded({})
    const timer = setTimeout(() => fetchItems(1), 400)
    return () => clearTimeout(timer)
  }, [search, selectedShop, mode])

  // Fetch when page changes (without debounce)
  useEffect(() => {
    setExpanded({})
    fetchItems(page)
  }, [page])

  const goTo = (p) => {
    if (p < 1 || p > pages) return
    setPage(p)
  }

  const toggleExpand = (idx) => {
    setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  const isAdmin = mode === 'admin'
  const showShop = isAdmin && !selectedShop

  const start = (page - 1) * PER_PAGE + 1
  const end = Math.min(page * PER_PAGE, total)

  // Build page number list (max 7 shown)
  const pageNumbers = () => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)
    const nums = new Set([1, 2, page - 1, page, page + 1, pages - 1, pages])
    return [...nums].filter(n => n >= 1 && n <= pages).sort((a, b) => a - b)
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search product or composition..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => { setShowBatches(false); setExpanded({}) }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                !showBatches ? 'bg-white shadow text-purple-700' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              Grouped
            </button>
            <button
              onClick={() => { setShowBatches(true); setExpanded({}) }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                showBatches ? 'bg-white shadow text-purple-700' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <List className="w-4 h-4" />
              By Batch
            </button>
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {total} product{total !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {search ? 'No items match your search.' : 'No stock items found.'}
          </div>
        ) : !showBatches ? (
          /* ── GROUPED VIEW ── */
          <table className="w-full text-sm">
            <thead className="bg-purple-50 border-b border-purple-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-purple-700 uppercase tracking-wide w-6"></th>
                {showShop && <th className="px-4 py-3 text-left text-xs font-semibold text-purple-700 uppercase tracking-wide">Shop</th>}
                <th className="px-4 py-3 text-left text-xs font-semibold text-purple-700 uppercase tracking-wide">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-purple-700 uppercase tracking-wide">Composition</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-purple-700 uppercase tracking-wide">Batches</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-purple-700 uppercase tracking-wide">Qty (Software / Physical)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <>
                  <tr
                    key={idx}
                    className="border-b hover:bg-purple-50/40 cursor-pointer transition-colors"
                    onClick={() => toggleExpand(idx)}
                  >
                    <td className="px-4 py-3 text-gray-400">
                      {item.batch_count > 1
                        ? (expanded[idx] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)
                        : <span className="w-4 h-4 inline-block" />
                      }
                    </td>
                    {showShop && (
                      <td className="px-4 py-3 text-gray-600 text-xs">{item.shop_name}</td>
                    )}
                    <td className="px-4 py-3 font-medium text-gray-900">{item.product_name || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-xs truncate">{item.composition || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {item.batch_count}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-gray-900">{item.total_qty_software}</span>
                      <span className="text-gray-400 mx-1">/</span>
                      <span className="text-gray-600">{item.total_qty_physical ?? '-'}</span>
                    </td>
                  </tr>
                  {expanded[idx] && item.batch_count > 1 && item.batches.map((batch, bIdx) => (
                    <tr key={`${idx}-${bIdx}`} className="bg-purple-50/60 border-b">
                      <td className="px-4 py-2"></td>
                      {showShop && <td className="px-4 py-2"></td>}
                      <td className="px-4 py-2 pl-8 text-gray-500 text-xs" colSpan={1}>
                        <span className="text-gray-400 mr-1">Batch:</span>
                        <span className="font-mono bg-white border px-1.5 py-0.5 rounded text-xs">
                          {batch.batch_number || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-400">
                        Exp: {batch.expiry_date ? new Date(batch.expiry_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '-'}
                      </td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2 text-right text-xs">
                        <span className="font-semibold text-gray-800">{batch.qty_software}</span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-gray-500">{batch.qty_physical ?? '-'}</span>
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        ) : (
          /* ── BY BATCH VIEW ── */
          <table className="w-full text-sm">
            <thead className="bg-indigo-50 border-b border-indigo-100">
              <tr>
                {showShop && <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wide">Shop</th>}
                <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wide">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wide">Composition</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wide">Batch</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wide">Expiry</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-indigo-700 uppercase tracking-wide">Qty (Software / Physical)</th>
              </tr>
            </thead>
            <tbody>
              {items.flatMap((item, idx) =>
                item.batches.map((batch, bIdx) => (
                  <tr
                    key={`${idx}-${bIdx}`}
                    className={`border-b hover:bg-indigo-50/40 transition-colors ${bIdx === 0 ? '' : 'bg-gray-50/30'}`}
                  >
                    {showShop && (
                      <td className="px-4 py-3 text-xs text-gray-500">{bIdx === 0 ? item.shop_name : ''}</td>
                    )}
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {bIdx === 0 ? item.product_name || '-' : <span className="text-gray-300">↳</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-xs truncate">
                      {bIdx === 0 ? item.composition || '-' : ''}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-700">
                        {batch.batch_number || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {batch.expiry_date
                        ? new Date(batch.expiry_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-gray-900">{batch.qty_software}</span>
                      <span className="text-gray-400 mx-1">/</span>
                      <span className="text-gray-600">{batch.qty_physical ?? '-'}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && total > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <span className="text-sm text-gray-500">
              Showing {start}–{end} of {total} products
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goTo(page - 1)}
                disabled={page === 1}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {pageNumbers().map((n, i, arr) => (
                <>
                  {i > 0 && arr[i - 1] !== n - 1 && (
                    <span key={`ellipsis-${n}`} className="px-1 text-gray-400 text-sm">…</span>
                  )}
                  <button
                    key={n}
                    onClick={() => goTo(n)}
                    className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                      n === page
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {n}
                  </button>
                </>
              ))}
              <button
                onClick={() => goTo(page + 1)}
                disabled={page === pages}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConsolidatedStockView
