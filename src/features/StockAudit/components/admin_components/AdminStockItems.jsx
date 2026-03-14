import React, { useState, useEffect } from 'react'
import { adminStockAuditAPI } from '../../services/admin_stock_audit_apis'
import { Package, Download, Loader2, AlertCircle, Settings } from 'lucide-react'
import Pagination from '../shared/Pagination'

const PER_PAGE = 50

const AdminStockItems = ({ selectedShop }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    composition: '',
    manufacturer: '',
    batch_number: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Debounce filter/search changes → reset to page 1 and fetch
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchItems(1)
    }, 500)
    return () => clearTimeout(delayDebounce)
  }, [searchTerm, filters, selectedShop])

  // Immediate fetch when page changes
  useEffect(() => {
    fetchItems(currentPage)
  }, [currentPage])

  const fetchItems = async (page = 1) => {
    try {
      setLoading(true)
      setCurrentPage(page)
      
      const params = {
        item_name: searchTerm || undefined,
        composition: filters.composition || undefined,
        manufacturer: filters.manufacturer || undefined,
        batch_number: filters.batch_number || undefined,
        page,
        per_page: PER_PAGE
      }
      
      if (selectedShop) params.shop_id = selectedShop
      
      const res = await adminStockAuditAPI.getAdminItems(params)
      setItems(res.data.items || [])
      setTotal(res.data.total || 0)
      setTotalPages(res.data.pages || 1)
    } catch (error) {
      console.error('Failed to fetch items:', error)
      setItems([])
      setTotal(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const formatExpiry = (expiryDate) => {
    if (!expiryDate) return null
    const date = new Date(expiryDate)
    // If day is 1st, show as MM/YYYY
    if (date.getDate() === 1) {
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${month}/${year}`
    }
    return date.toLocaleDateString()
  }

  const handleExport = async () => {
    try {
      const res = await adminStockAuditAPI.exportStockItems()
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `stock_items_${new Date().toISOString().split('T')[0]}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          Stock Items ({total})
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={handleExport} 
            className="group relative flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Download className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Export</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-3 overflow-visible">
        <div className="flex gap-2 relative z-10 p-1">
          <div className="flex-1 relative overflow-visible">
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg p-0.5">
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-white rounded-lg focus:outline-none transition-all duration-300"
                style={{
                  boxShadow: searchTerm ? 
                    '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)' : 
                    'none',
                  animation: searchTerm ? 'ai-pulse 2s ease-in-out infinite' : 'none'
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
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 flex items-center gap-2 transition-all duration-200"
          >
            <Settings className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {showFilters && (
          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Composition</label>
                <input
                  type="text"
                  placeholder="Filter by composition"
                  value={filters.composition}
                  onChange={(e) => setFilters({...filters, composition: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Manufacturer</label>
                <input
                  type="text"
                  placeholder="Filter by manufacturer"
                  value={filters.manufacturer}
                  onChange={(e) => setFilters({...filters, manufacturer: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Batch Number</label>
                <input
                  type="text"
                  placeholder="Filter by batch"
                  value={filters.batch_number}
                  onChange={(e) => setFilters({...filters, batch_number: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({ composition: '', manufacturer: '', batch_number: '' })}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
        <AlertCircle className="w-4 h-4 text-blue-600" />
        <span>Scroll right to see the full table</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading stock items...</p>
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100/80 via-sky-100/80 to-cyan-100/80 backdrop-blur-sm border-b border-blue-200/50">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Composition</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Mfg</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Batch</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Qty (S/P)</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Purchase ₹</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Selling ₹</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Margin %</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Value</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Rack/Section</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Discrepancy</th>
                {!selectedShop && <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Shop</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {items.map((item, idx) => (
                <tr key={item.id} className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-sm ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 text-sm leading-tight">{item.product_name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.composition || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.manufacturer || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                      {item.batch_number}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.unit || '-'}</td>
                  <td className="px-6 py-4">
                    {item.expiry_date ? (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        new Date(item.expiry_date) < new Date() 
                          ? 'bg-red-100 text-red-800 border border-red-200' 
                          : new Date(item.expiry_date) < new Date(Date.now() + 30*24*60*60*1000)
                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {formatExpiry(item.expiry_date)}
                      </span>
                    ) : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <span className="font-bold text-gray-900 text-lg">{item.quantity_software}</span>
                      {item.quantity_physical !== null && <span className="text-gray-500 ml-1">/ {item.quantity_physical}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-red-600 text-sm">₹{item.unit_price || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-green-600 text-sm">₹{item.selling_price || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    {item.profit_margin ? (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                        item.profit_margin < 10 ? 'bg-red-50 text-red-700 border-red-200' :
                        item.profit_margin < 20 ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        item.profit_margin < 30 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        'bg-green-50 text-green-700 border-green-200'
                      }`}>
                        {item.profit_margin.toFixed(1)}%
                      </span>
                    ) : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-blue-700 text-sm">
                      {item.total_value ? `₹${item.total_value.toLocaleString('en-IN')}` : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.rack_name && item.section_name ? (
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                          {item.rack_name}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                          {item.section_name}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {item.audit_discrepancy !== 0 && item.audit_discrepancy !== null ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                        {item.audit_discrepancy > 0 ? '+' : ''}{item.audit_discrepancy}
                      </span>
                    ) : '-'}
                  </td>
                  {!selectedShop && (
                    <td className="px-6 py-4 text-sm text-gray-600">{item.shop_name || '-'}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && items.length === 0 && (
          <div className="text-center py-16 bg-white">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">No items found</p>
          </div>
        )}
      </div>
      
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        total={total}
        perPage={PER_PAGE}
        onPageChange={(p) => setCurrentPage(p)}
      />
    </div>
  )
}

export default AdminStockItems
