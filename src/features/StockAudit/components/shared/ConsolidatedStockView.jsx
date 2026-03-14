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
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      {/* Controls */}
      <div className="mb-6 space-y-3 overflow-visible">
        <div className="flex gap-2 relative z-10 p-1">
          <div className="flex-1 relative overflow-visible">
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg p-0.5">
              <input
                type="text"
                placeholder="Search product or composition..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 bg-white rounded-lg focus:outline-none transition-all duration-300"
                style={{
                  boxShadow: search ? 
                    '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)' : 
                    'none',
                  animation: search ? 'ai-pulse 2s ease-in-out infinite' : 'none'
                }}
              />
            </div>
          </div>
          <style>{`
            @keyframes ai-pulse {
              0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1); }
              50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.2); }
            }
          `}</style>
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
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading consolidated stock...</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white">
            <p className="text-gray-500 text-lg">
              {search ? 'No items match your search.' : 'No stock items found.'}
            </p>
          </div>
        ) : !showBatches ? (
          /* ── GROUPED VIEW ── */
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100/80 via-sky-100/80 to-cyan-100/80 backdrop-blur-sm border-b border-blue-200/50">
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider w-6"></th>
                {showShop && <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Shop</th>}
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Composition</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">Batches</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Qty (S/P)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {items.map((item, idx) => (
                <>
                  <tr
                    key={idx}
                    className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-sm cursor-pointer ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                    onClick={() => toggleExpand(idx)}
                  >
                    <td className="px-6 py-4 text-gray-400">
                      {item.batch_count > 1
                        ? (expanded[idx] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)
                        : <span className="w-4 h-4 inline-block" />
                      }
                    </td>
                    {showShop && (
                      <td className="px-6 py-4 text-sm text-gray-600">{item.shop_name}</td>
                    )}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 text-sm leading-tight">{item.product_name || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.composition || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                        {item.batch_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm">
                        <span className="font-bold text-gray-900 text-lg">{item.total_qty_software}</span>
                        <span className="text-gray-500 ml-1">/ {item.total_qty_physical ?? '-'}</span>
                      </div>
                    </td>
                  </tr>
                  {expanded[idx] && item.batch_count > 1 && item.batches.map((batch, bIdx) => (
                    <tr key={`${idx}-${bIdx}`} className="bg-blue-50/40 border-b">
                      <td className="px-6 py-3"></td>
                      {showShop && <td className="px-6 py-3"></td>}
                      <td className="px-6 py-3 pl-10 text-gray-500 text-xs" colSpan={1}>
                        <span className="text-gray-400 mr-1">Batch:</span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                          {batch.batch_number || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-xs text-gray-500">
                        Exp: {batch.expiry_date ? new Date(batch.expiry_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '-'}
                      </td>
                      <td className="px-6 py-3"></td>
                      <td className="px-6 py-3 text-right">
                        <div className="text-sm">
                          <span className="font-semibold text-gray-800">{batch.qty_software}</span>
                          <span className="text-gray-500 ml-1">/ {batch.qty_physical ?? '-'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        ) : (
          /* ── BY BATCH VIEW ── */
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100/80 via-sky-100/80 to-cyan-100/80 backdrop-blur-sm border-b border-blue-200/50">
                {showShop && <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Shop</th>}
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Composition</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Batch</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Qty (S/P)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {items.flatMap((item, idx) =>
                item.batches.map((batch, bIdx) => (
                  <tr
                    key={`${idx}-${bIdx}`}
                    className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-sm ${bIdx === 0 ? (idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50') : 'bg-gray-50/30'}`}
                  >
                    {showShop && (
                      <td className="px-6 py-4 text-sm text-gray-600">{bIdx === 0 ? item.shop_name : ''}</td>
                    )}
                    <td className="px-6 py-4">
                      {bIdx === 0 ? (
                        <div className="font-semibold text-gray-900 text-sm leading-tight">{item.product_name || '-'}</div>
                      ) : (
                        <span className="text-gray-300 text-lg">↳</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {bIdx === 0 ? item.composition || '-' : ''}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                        {batch.batch_number || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {batch.expiry_date
                        ? new Date(batch.expiry_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-sm">
                        <span className="font-bold text-gray-900 text-lg">{batch.qty_software}</span>
                        <span className="text-gray-500 ml-1">/ {batch.qty_physical ?? '-'}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {!loading && total > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t bg-gradient-to-r from-gray-50 to-slate-50">
            <span className="text-sm text-gray-600 font-medium">
              Showing {start}–{end} of {total} products
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goTo(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {pageNumbers().map((n, i, arr) => (
                <>
                  {i > 0 && arr[i - 1] !== n - 1 && (
                    <span key={`ellipsis-${n}`} className="px-2 text-gray-400 text-sm">…</span>
                  )}
                  <button
                    key={n}
                    onClick={() => goTo(n)}
                    className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-semibold transition-all ${
                      n === page
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    {n}
                  </button>
                </>
              ))}
              <button
                onClick={() => goTo(page + 1)}
                disabled={page === pages}
                className="p-2 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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
