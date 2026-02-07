import React, { useState, useEffect } from 'react'
import { stockAuditAPI } from '../services/stockAudit'
import { AlertTriangle, Clock, TrendingDown } from 'lucide-react'

const Reports = () => {
  const [activeReport, setActiveReport] = useState('low-stock')
  const [data, setData] = useState([])

  useEffect(() => {
    fetchReport()
  }, [activeReport])

  const fetchReport = async () => {
    try {
      let res
      if (activeReport === 'low-stock') res = await stockAuditAPI.getLowStock({ threshold: 10 })
      else if (activeReport === 'expiring') res = await stockAuditAPI.getExpiring({ days_ahead: 30 })
      else if (activeReport === 'discrepancies') res = await stockAuditAPI.getDiscrepancies({ threshold: 0 })
      setData(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error('Failed to fetch report:', error)
      setData([])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setActiveReport('low-stock')} className={`px-4 py-2 rounded ${activeReport === 'low-stock' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}>Low Stock</button>
        <button onClick={() => setActiveReport('expiring')} className={`px-4 py-2 rounded ${activeReport === 'expiring' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}>Expiring Items</button>
        <button onClick={() => setActiveReport('discrepancies')} className={`px-4 py-2 rounded ${activeReport === 'discrepancies' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}>Discrepancies</button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          {activeReport === 'low-stock' && 'Low Stock Items'}
          {activeReport === 'expiring' && 'Expiring Items'}
          {activeReport === 'discrepancies' && 'Stock Discrepancies'}
        </h2>
        <div className="space-y-3">
          {data.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No items found</p>
          ) : (
            data.map((item, idx) => (
              <div key={idx} className="border rounded p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {activeReport === 'low-stock' && <TrendingDown className="w-5 h-5 text-red-600" />}
                  {activeReport === 'expiring' && <Clock className="w-5 h-5 text-orange-600" />}
                  {activeReport === 'discrepancies' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                  <div>
                    <h4 className="font-semibold">{item.item_name || item.name}</h4>
                    <p className="text-sm text-gray-600">Batch: {item.batch_number || item.batch}</p>
                    {item.quantity_software !== undefined && <p className="text-sm">Quantity: {item.quantity_software}</p>}
                    {item.expiry_date && <p className="text-sm">Expires: {item.expiry_date}</p>}
                    {item.audit_discrepancy !== undefined && <p className="text-sm text-red-600">Discrepancy: {item.audit_discrepancy}</p>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Reports
