import { useState, useEffect } from 'react'
import { adminStockAuditAPI } from '../../services/admin_stock_audit_apis'
import { AlertTriangle, Clock, TrendingDown, Download, Package, Loader2 } from 'lucide-react'
import Pagination from '../shared/Pagination'

const PER_PAGE = 50

const AdminReports = ({ selectedShop }) => {
  const [activeReport, setActiveReport] = useState('low-stock')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [threshold, setThreshold] = useState(10)
  const [daysAhead, setDaysAhead] = useState(30)
  const [appliedThreshold, setAppliedThreshold] = useState(10)
  const [appliedDaysAhead, setAppliedDaysAhead] = useState(30)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setCurrentPage(1)
    fetchReport(1)
  }, [activeReport, selectedShop])

  useEffect(() => {
    fetchReport(currentPage)
  }, [currentPage])

  const fetchReport = async (page = 1) => {
    try {
      setLoading(true)
      const base = { page, per_page: PER_PAGE }
      if (selectedShop) base.shop_id = selectedShop

      let res
      if (activeReport === 'low-stock') {
        res = await adminStockAuditAPI.getAdminLowStock({ ...base, threshold })
        setAppliedThreshold(threshold)
      } else if (activeReport === 'expiring') {
        res = await adminStockAuditAPI.getAdminExpiring({ ...base, days_ahead: daysAhead })
        setAppliedDaysAhead(daysAhead)
      } else if (activeReport === 'discrepancies') {
        res = await adminStockAuditAPI.getAdminDiscrepancyReport({ ...base, threshold: 0 })
      }

      if (res.data.items) {
        setData(res.data.items)
        setTotal(res.data.total || 0)
        setTotalPages(res.data.pages || 1)
      } else if (res.data.discrepancies) {
        setData(res.data.discrepancies)
        setTotal(res.data.total_discrepancies || 0)
        setTotalPages(res.data.pages || 1)
      } else {
        setData([])
        setTotal(0)
        setTotalPages(1)
      }
      setCurrentPage(page)
    } catch (error) {
      console.error('Failed to fetch report:', error)
      setData([])
      setTotal(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFilter = () => {
    setCurrentPage(1)
    fetchReport(1)
  }

  const handleExport = async () => {
    try {
      let response
      if (activeReport === 'low-stock') {
        response = await adminStockAuditAPI.exportStockItems()
      } else if (activeReport === 'expiring') {
        response = await adminStockAuditAPI.exportAuditRecords({ days: appliedDaysAhead })
      } else if (activeReport === 'discrepancies') {
        response = await adminStockAuditAPI.exportAdjustments({ days: 30 })
      }
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${activeReport}_${new Date().toISOString().split('T')[0]}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <button
          onClick={() => setActiveReport('low-stock')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${activeReport === 'low-stock' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'}`}
        >
          Low Stock
        </button>
        <button
          onClick={() => setActiveReport('expiring')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${activeReport === 'expiring' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'}`}
        >
          Expiring Items
        </button>
        <button
          onClick={() => setActiveReport('discrepancies')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${activeReport === 'discrepancies' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'}`}
        >
          Discrepancies
        </button>

        {activeReport === 'low-stock' && (
          <div className="flex items-center gap-2 ml-4 bg-white dark:bg-slate-700 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Threshold:</label>
            <input type="number" value={threshold} onChange={(e) => setThreshold(e.target.value)} className="w-20 px-2 py-1 border border-gray-300 dark:border-slate-600 rounded text-gray-900 dark:text-white dark:bg-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <button onClick={handleApplyFilter} className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded text-sm hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 transition-all">Apply</button>
          </div>
        )}
        {activeReport === 'expiring' && (
          <div className="flex items-center gap-2 ml-4 bg-white dark:bg-slate-700 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Days Ahead:</label>
            <input type="number" value={daysAhead} onChange={(e) => setDaysAhead(e.target.value)} className="w-20 px-2 py-1 border border-gray-300 dark:border-slate-600 rounded text-gray-900 dark:text-white dark:bg-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <button onClick={handleApplyFilter} className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded text-sm hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 transition-all">Apply</button>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg p-4 md:p-6 border border-slate-200 dark:border-slate-700/50">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {activeReport === 'low-stock' && 'Low Stock Items'}
              {activeReport === 'expiring' && 'Expiring Items'}
              {activeReport === 'discrepancies' && 'Stock Discrepancies'}
            </h2>
            {activeReport === 'low-stock' && <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Showing items with quantity below {appliedThreshold}</p>}
            {activeReport === 'expiring' && <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Showing items expiring within {appliedDaysAhead} days</p>}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-600 dark:text-slate-400">{total} items</p>
            <button onClick={handleExport} className="px-3 py-2 bg-green-600 text-white rounded flex items-center gap-1 text-sm hover:bg-green-700 transition-all">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
              <p className="text-gray-600 dark:text-slate-400 font-medium">Loading report data...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {data.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-slate-700/30 rounded-xl">
                  <Package className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-300 dark:text-slate-600" />
                  <p className="text-gray-500 dark:text-slate-400 text-sm md:text-base">No items found</p>
                </div>
              ) : (
                data.map((item, idx) => {
                  const itemData = item.item || item
                  return (
                    <div key={idx} className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-slate-700/30 dark:to-slate-700/30 border-2 border-slate-200 dark:border-slate-600 rounded-xl p-4 hover:shadow-lg transition-all">
                      <div className="flex items-start gap-3">
                        {activeReport === 'low-stock' && <TrendingDown className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />}
                        {activeReport === 'expiring' && <Clock className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />}
                        {activeReport === 'discrepancies' && <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-bold text-gray-800 dark:text-white">{itemData.product_name || itemData.item_name}</h4>
                            {itemData.shop_name && (
                              <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs rounded-full font-medium flex-shrink-0">{itemData.shop_name}</span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                            {itemData.composition && <p className="text-gray-600 dark:text-slate-400"><span className="font-medium">Composition:</span> {itemData.composition}</p>}
                            {itemData.generic_name && <p className="text-gray-600 dark:text-slate-400"><span className="font-medium">Generic:</span> {itemData.generic_name}</p>}
                            {itemData.brand_name && <p className="text-gray-600 dark:text-slate-400"><span className="font-medium">Brand:</span> {itemData.brand_name}</p>}
                            <p className="text-gray-600 dark:text-slate-400"><span className="font-medium">Batch:</span> <span className="font-mono bg-gray-100 dark:bg-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">{itemData.batch_number}</span></p>
                            {itemData.manufacturer && <p className="text-gray-600 dark:text-slate-400"><span className="font-medium">Manufacturer:</span> {itemData.manufacturer}</p>}

                            {activeReport === 'discrepancies' ? (
                              <>
                                <p className="text-blue-700 dark:text-blue-400 font-semibold"><span className="font-medium">Software:</span> {item.software_qty}</p>
                                <p className="text-green-700 dark:text-green-400 font-semibold"><span className="font-medium">Physical:</span> {item.physical_qty}</p>
                                <p className="text-red-600 dark:text-red-400 font-bold"><span className="font-medium">Difference:</span> {item.difference > 0 ? '+' : ''}{item.difference}</p>
                                {item.section_name && <p className="text-gray-600 dark:text-slate-400"><span className="font-medium">Section:</span> {item.section_name}</p>}
                                {item.rack_number && <p className="text-gray-600 dark:text-slate-400"><span className="font-medium">Rack:</span> {item.rack_number}</p>}
                                {item.audited_by_staff_name && <p className="text-gray-500 dark:text-slate-400"><span className="font-medium">Audited by:</span> {item.audited_by_staff_name}</p>}
                              </>
                            ) : (
                              <>
                                {itemData.quantity_software !== undefined && <p className="text-blue-700 dark:text-blue-400 font-semibold"><span className="font-medium">Software Stock:</span> {itemData.quantity_software}</p>}
                                {itemData.quantity_physical !== undefined && itemData.quantity_physical !== null && <p className="text-green-700 dark:text-green-400 font-semibold"><span className="font-medium">Physical Stock:</span> {itemData.quantity_physical}</p>}
                                {itemData.mrp && <p className="text-gray-600 dark:text-slate-400"><span className="font-medium">MRP:</span> ₹{itemData.mrp}</p>}
                                {itemData.unit_price && <p className="text-gray-600 dark:text-slate-400"><span className="font-medium">Unit Price:</span> ₹{itemData.unit_price}</p>}
                                {itemData.expiry_date && <p className="text-orange-600 dark:text-orange-400 font-bold"><span className="font-medium">Expires:</span> {new Date(itemData.expiry_date).toLocaleDateString()}</p>}
                                {itemData.audit_discrepancy !== undefined && itemData.audit_discrepancy !== 0 && <p className="text-red-600 dark:text-red-400 font-bold"><span className="font-medium">Discrepancy:</span> {itemData.audit_discrepancy > 0 ? '+' : ''}{itemData.audit_discrepancy}</p>}
                                {itemData.last_audit_date && <p className="text-gray-500 dark:text-slate-400 text-xs col-span-2 md:col-span-3"><span className="font-medium">Last Audit:</span> {new Date(itemData.last_audit_date).toLocaleString()}</p>}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <Pagination
              page={currentPage}
              totalPages={totalPages}
              total={total}
              perPage={PER_PAGE}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default AdminReports
