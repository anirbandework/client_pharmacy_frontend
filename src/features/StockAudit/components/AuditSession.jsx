import React, { useState } from 'react'
import { stockAuditAPI } from '../services/stockAudit'
import { Shuffle, CheckCircle, Download } from 'lucide-react'

const AuditSession = () => {
  const [section, setSection] = useState(null)
  const [items, setItems] = useState([])
  const [auditData, setAuditData] = useState({})
  const [auditor, setAuditor] = useState('')

  const startAudit = async () => {
    try {
      const { data } = await stockAuditAPI.getRandomSection()
      setSection(data.section)
      setItems(data.items_to_audit || [])
      await stockAuditAPI.startAuditSession({ session_notes: `Auditing ${data.section.section_name}` })
    } catch (error) {
      console.error('Failed to start audit:', error)
    }
  }

  const handleAudit = async (itemId, softwareQty) => {
    try {
      const physicalCount = auditData[itemId]
      if (physicalCount === undefined || physicalCount === '') return
      await stockAuditAPI.auditItem(itemId, physicalCount, '')
      alert('Item audited successfully')
    } catch (error) {
      console.error('Failed to audit item:', error)
    }
  }

  const handleExport = async () => {
    try {
      const response = await stockAuditAPI.exportAuditRecords({ days: 30 })
      const url = window.URL.createObjectURL(response.data)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit_records_${Date.now()}.xlsx`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert('Failed to export audit records')
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Random Audit Session</h2>
          <div className="flex gap-2">
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              <Download className="w-4 h-4" />Export Records
            </button>
            <button onClick={startAudit} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
              <Shuffle className="w-4 h-4" />Start Random Audit
            </button>
          </div>
        </div>
        {section && (
          <div className="mb-4 p-4 bg-blue-50 rounded">
            <h3 className="font-semibold text-lg">Auditing Section: {section.section_name}</h3>
            <p className="text-sm text-gray-600">Code: {section.section_code}</p>
          </div>
        )}
        {items.length > 0 && (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="border rounded p-4 flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold">{item.item_name}</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                    {item.generic_name && <p className="text-gray-600">Generic: {item.generic_name}</p>}
                    {item.brand_name && <p className="text-gray-600">Brand: {item.brand_name}</p>}
                    <p className="text-gray-600">Batch: {item.batch_number}</p>
                    {item.manufacturer && <p className="text-gray-600">Manufacturer: {item.manufacturer}</p>}
                    <p className="text-gray-600">Software Stock: {item.quantity_software}</p>
                    {item.quantity_physical !== undefined && <p className="text-gray-600">Physical Stock: {item.quantity_physical}</p>}
                    {item.mrp && <p className="text-gray-600">MRP: ₹{item.mrp}</p>}
                    {item.unit_price && <p className="text-gray-600">Unit Price: ₹{item.unit_price}</p>}
                    {item.expiry_date && <p className="text-orange-600">Expiry: {new Date(item.expiry_date).toLocaleDateString()}</p>}
                    {item.audit_discrepancy !== undefined && item.audit_discrepancy !== 0 && <p className="text-red-600 font-semibold">Discrepancy: {item.audit_discrepancy}</p>}
                    {item.last_audit_date && <p className="text-gray-500 text-xs">Last Audit: {new Date(item.last_audit_date).toLocaleString()}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Physical Count" value={auditData[item.id] || ''} onChange={(e) => setAuditData({ ...auditData, [item.id]: e.target.value })} className="w-32 px-3 py-2 border rounded" />
                  <button onClick={() => handleAudit(item.id, item.quantity_software)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    <CheckCircle className="w-4 h-4" />
                  </button>
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
