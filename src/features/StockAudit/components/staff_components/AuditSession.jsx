import React, { useState } from 'react'
import { staffStockAuditAPI } from '../../services/staff_stock_audit_apis'
import { Shuffle, CheckCircle, Download } from 'lucide-react'

const AuditSession = () => {
  const [section, setSection] = useState(null)
  const [items, setItems] = useState([])
  const [auditData, setAuditData] = useState({})
  const [auditor, setAuditor] = useState('')

  const startAudit = async () => {
    try {
      const { data } = await staffStockAuditAPI.getRandomSection()
      setSection(data.section)
      setItems(data.items_to_audit || [])
      await staffStockAuditAPI.startAuditSession({ session_notes: `Auditing ${data.section.section_name}` })
    } catch (error) {
      console.error('Failed to start audit:', error)
    }
  }

  const handleAudit = async (itemId, softwareQty) => {
    try {
      const physicalCount = auditData[itemId]
      if (physicalCount === undefined || physicalCount === '') return
      await staffStockAuditAPI.auditItem(itemId, physicalCount, '')
      setItems(items.map(item => 
        item.id === itemId ? { ...item, quantity_physical: parseInt(physicalCount) } : item
      ))
      alert('Item audited successfully')
    } catch (error) {
      console.error('Failed to audit item:', error)
    }
  }

  const handleExport = async () => {
    try {
      const response = await staffStockAuditAPI.exportAuditRecords({ days: 30 })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `audit_records_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export audit records')
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
            <Shuffle className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
            Random Audit Session
          </h2>
          <div className="flex gap-2">
            <button onClick={handleExport} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all text-sm md:text-base">
              <Download className="w-4 h-4" />Export Records
            </button>
            <button onClick={startAudit} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg transition-all text-sm md:text-base">
              <Shuffle className="w-4 h-4" />Start Random Audit
            </button>
          </div>
        </div>
        {section && (
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
            <h3 className="font-bold text-lg text-blue-900">Auditing Section: {section.section_name}</h3>
            <p className="text-sm text-blue-700">Code: {section.section_code}</p>
          </div>
        )}
        {items.length > 0 && (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-slate-200 rounded-xl p-4 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-base md:text-lg mb-2">{item.product_name || 'N/A'}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm mb-3">
                      <p className="text-blue-700 font-semibold"><span className="font-medium">Software Stock:</span> {item.quantity_software ?? 'N/A'}</p>
                      <p className="text-green-700 font-semibold"><span className="font-medium">Physical Stock:</span> {item.quantity_physical ?? 'N/A'}</p>
                      <p className="text-orange-600 font-semibold"><span className="font-medium">Expiry:</span> {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <details className="text-sm">
                      <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium mb-2">View More Details</summary>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mt-2 pl-4 border-l-2 border-blue-200">
                        <p className="text-gray-600"><span className="font-medium">Composition:</span> {item.composition || 'N/A'}</p>
                        <p className="text-gray-600"><span className="font-medium">Manufacturer:</span> {item.manufacturer || 'N/A'}</p>
                        <p className="text-gray-600"><span className="font-medium">Batch:</span> <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{item.batch_number || 'N/A'}</span></p>
                        <p className="text-gray-600"><span className="font-medium">Package:</span> {item.package || 'N/A'}</p>
                        <p className="text-gray-600"><span className="font-medium">HSN:</span> {item.hsn_code || 'N/A'}</p>
                        <p className="text-gray-600"><span className="font-medium">Unit:</span> {item.unit || 'N/A'}</p>
                        <p className="text-gray-600"><span className="font-medium">MRP:</span> {item.mrp || 'N/A'}</p>
                        <p className="text-gray-600"><span className="font-medium">Unit Price:</span> {item.unit_price ? `₹${item.unit_price}` : 'N/A'}</p>
                        <p className="text-gray-600"><span className="font-medium">Selling Price:</span> {item.selling_price ? `₹${item.selling_price}` : 'N/A'}</p>
                        <p className="text-gray-600"><span className="font-medium">Profit Margin:</span> {item.profit_margin ?? 'N/A'}</p>
                        <p className="text-gray-600"><span className="font-medium">Mfg Date:</span> {item.manufacturing_date ? new Date(item.manufacturing_date).toLocaleDateString() : 'N/A'}</p>
                        <p className={`font-bold ${item.audit_discrepancy > 0 ? 'text-green-600' : item.audit_discrepancy < 0 ? 'text-red-600' : 'text-gray-600'}`}><span className="font-medium">Discrepancy:</span> {item.audit_discrepancy > 0 ? '+' : ''}{item.audit_discrepancy ?? 0}</p>
                        <p className="text-gray-500 text-xs col-span-2 md:col-span-3"><span className="font-medium">Last Audit:</span> {item.last_audit_date ? new Date(item.last_audit_date).toLocaleString() : 'Never'}</p>
                      </div>
                    </details>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <input 
                      type="number" 
                      placeholder="Physical Count" 
                      value={auditData[item.id] || ''} 
                      onChange={(e) => setAuditData({ ...auditData, [item.id]: e.target.value })} 
                      className="w-40 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center font-bold" 
                    />
                    <button 
                      onClick={() => handleAudit(item.id, item.quantity_software)} 
                      className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AuditSession
