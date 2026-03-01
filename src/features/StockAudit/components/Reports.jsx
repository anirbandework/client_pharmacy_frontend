import React, { useState, useEffect } from 'react'
import { stockAuditAPI } from '../services/stockAudit'
import { AlertTriangle, Clock, TrendingDown } from 'lucide-react'

const Reports = () => {
  const [activeReport, setActiveReport] = useState('low-stock')
  const [data, setData] = useState([])
  const [threshold, setThreshold] = useState(10)
  const [daysAhead, setDaysAhead] = useState(30)
  const [appliedThreshold, setAppliedThreshold] = useState(10)
  const [appliedDaysAhead, setAppliedDaysAhead] = useState(30)

  useEffect(() => {
    fetchReport()
  }, [activeReport])

  const fetchReport = async () => {
    try {
      let res
      if (activeReport === 'low-stock') {
        res = await stockAuditAPI.getLowStock({ threshold })
        setAppliedThreshold(threshold)
      } else if (activeReport === 'expiring') {
        res = await stockAuditAPI.getExpiring({ days_ahead: daysAhead })
        setAppliedDaysAhead(daysAhead)
      } else if (activeReport === 'discrepancies') {
        res = await stockAuditAPI.getDiscrepancies({ threshold: 0 })
      }
      
      // Handle different response formats
      if (res.data.items) {
        setData(res.data.items) // For expiring items
      } else if (res.data.discrepancies) {
        setData(res.data.discrepancies) // For discrepancies
      } else if (Array.isArray(res.data)) {
        setData(res.data) // For other reports
      } else {
        setData([])
      }
    } catch (error) {
      console.error('Failed to fetch report:', error)
      setData([])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <button onClick={() => setActiveReport('low-stock')} className={`px-4 py-2 rounded-lg font-medium ${activeReport === 'low-stock' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-gray-700 hover:bg-gray-50 border border-slate-200'}`}>Low Stock</button>
        <button onClick={() => setActiveReport('expiring')} className={`px-4 py-2 rounded-lg font-medium ${activeReport === 'expiring' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-gray-700 hover:bg-gray-50 border border-slate-200'}`}>Expiring Items</button>
        <button onClick={() => setActiveReport('discrepancies')} className={`px-4 py-2 rounded-lg font-medium ${activeReport === 'discrepancies' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-gray-700 hover:bg-gray-50 border border-slate-200'}`}>Discrepancies</button>
        
        {activeReport === 'low-stock' && (
          <div className="flex items-center gap-2 ml-4 bg-white px-3 py-2 rounded-lg border border-slate-200">
            <label className="text-sm font-medium text-gray-700">Threshold:</label>
            <input type="number" value={threshold} onChange={(e) => setThreshold(e.target.value)} className="w-20 px-2 py-1 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <button onClick={fetchReport} className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded text-sm hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20">Apply</button>
          </div>
        )}
        
        {activeReport === 'expiring' && (
          <div className="flex items-center gap-2 ml-4 bg-white px-3 py-2 rounded-lg border border-slate-200">
            <label className="text-sm font-medium text-gray-700">Days Ahead:</label>
            <input type="number" value={daysAhead} onChange={(e) => setDaysAhead(e.target.value)} className="w-20 px-2 py-1 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <button onClick={fetchReport} className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded text-sm hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20">Apply</button>
          </div>
        )}
      </div>
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">
              {activeReport === 'low-stock' && 'Low Stock Items'}
              {activeReport === 'expiring' && 'Expiring Items'}
              {activeReport === 'discrepancies' && 'Stock Discrepancies'}
            </h2>
            {activeReport === 'low-stock' && (
              <p className="text-sm text-gray-500 mt-1">Showing items with quantity below {appliedThreshold}</p>
            )}
            {activeReport === 'expiring' && (
              <p className="text-sm text-gray-500 mt-1">Showing items expiring within {appliedDaysAhead} days</p>
            )}
          </div>
          <p className="text-sm font-semibold text-gray-600">{data.length} items</p>
        </div>
        <div className="space-y-3">
          {data.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No items found</p>
          ) : (
            data.map((item, idx) => {
              // Handle discrepancies format (nested item object)
              const itemData = item.item || item;
              return (
                <div key={idx} className="border rounded p-4">
                  <div className="flex items-start gap-3">
                    {activeReport === 'low-stock' && <TrendingDown className="w-5 h-5 text-red-600 mt-1" />}
                    {activeReport === 'expiring' && <Clock className="w-5 h-5 text-orange-600 mt-1" />}
                    {activeReport === 'discrepancies' && <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1" />}
                    <div className="flex-1">
                      <h4 className="font-semibold">{itemData.item_name}</h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                        {itemData.generic_name && <p className="text-gray-600">Generic: {itemData.generic_name}</p>}
                        {itemData.brand_name && <p className="text-gray-600">Brand: {itemData.brand_name}</p>}
                        <p className="text-gray-600">Batch: {itemData.batch_number}</p>
                        {itemData.manufacturer && <p className="text-gray-600">Manufacturer: {itemData.manufacturer}</p>}
                        {activeReport === 'discrepancies' ? (
                          <>
                            <p className="text-gray-700">Software: {item.software_qty}</p>
                            <p className="text-gray-700">Physical: {item.physical_qty}</p>
                            <p className="text-red-600 font-semibold">Difference: {item.difference}</p>
                            <p className="text-gray-600">Section: {item.section_name}</p>
                            <p className="text-gray-600">Rack: {item.rack_number}</p>
                            {item.audited_by_staff_name && <p className="text-gray-500">Audited by: {item.audited_by_staff_name}</p>}
                          </>
                        ) : (
                          <>
                            {itemData.quantity_software !== undefined && <p className="text-gray-700">Software Stock: {itemData.quantity_software}</p>}
                            {itemData.quantity_physical !== undefined && <p className="text-gray-700">Physical Stock: {itemData.quantity_physical}</p>}
                            {itemData.mrp && <p className="text-gray-600">MRP: ₹{itemData.mrp}</p>}
                            {itemData.unit_price && <p className="text-gray-600">Unit Price: ₹{itemData.unit_price}</p>}
                            {itemData.expiry_date && <p className="text-orange-600">Expires: {new Date(itemData.expiry_date).toLocaleDateString()}</p>}
                            {itemData.audit_discrepancy !== undefined && itemData.audit_discrepancy !== 0 && <p className="text-red-600 font-semibold">Discrepancy: {itemData.audit_discrepancy}</p>}
                            {itemData.last_audit_date && <p className="text-gray-500 text-xs">Last Audit: {new Date(itemData.last_audit_date).toLocaleString()}</p>}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default Reports
