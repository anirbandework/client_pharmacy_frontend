import React, { useState } from 'react'
import { stockAuditAPI } from '../services/stockAudit'
import { Shuffle, CheckCircle } from 'lucide-react'

const AuditSession = () => {
  const [section, setSection] = useState(null)
  const [items, setItems] = useState([])
  const [auditData, setAuditData] = useState({})
  const [auditor, setAuditor] = useState('')

  const startAudit = async () => {
    if (!auditor) {
      alert('Please enter auditor name')
      return
    }
    try {
      const { data } = await stockAuditAPI.getRandomSection()
      setSection(data.section)
      setItems(data.items_to_audit || [])
      await stockAuditAPI.startAuditSession({ auditor, session_notes: `Auditing ${data.section.section_name}` })
    } catch (error) {
      console.error('Failed to start audit:', error)
    }
  }

  const handleAudit = async (itemId, softwareQty) => {
    try {
      const physicalCount = auditData[itemId]
      if (physicalCount === undefined || physicalCount === '') return
      await stockAuditAPI.auditItem(itemId, physicalCount, auditor, '')
      alert('Item audited successfully')
    } catch (error) {
      console.error('Failed to audit item:', error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Random Audit Session</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Auditor Name"
              value={auditor}
              onChange={(e) => setAuditor(e.target.value)}
              className="px-3 py-2 border rounded"
            />
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
                <div>
                  <h4 className="font-semibold">{item.item_name}</h4>
                  <p className="text-sm text-gray-600">Batch: {item.batch_number}</p>
                  <p className="text-sm text-gray-600">Software Stock: {item.quantity_software}</p>
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
