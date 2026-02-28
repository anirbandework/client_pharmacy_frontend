import { Package, AlertTriangle, TrendingUp } from 'lucide-react'
import StockCharts from './StockCharts'

export default function StockAnalyticsDashboard({ data }) {
  if (!data) return null
  
  const stock_overview = {
    total_items: data.stock_overview?.total_items || 0,
    total_quantity_software: data.stock_overview?.total_software_quantity || 0,
    total_quantity_physical: data.stock_overview?.total_physical_quantity || 0,
    audit_completion_rate: data.stock_overview?.audit_completion_rate || 0,
    audited_items: data.stock_overview?.items_audited || 0
  }
  
  const discrepancy_analysis = data.discrepancy_analysis || { total_discrepancies: 0, total_value_impact: 0 }
  
  const expiry_analysis = {
    expired: data.expiry_analysis?.categories?.find(c => c.name === 'Expired')?.count || 0,
    expiring_0_30: data.expiry_analysis?.categories?.find(c => c.name === '0-30 Days')?.count || 0
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Total Items</p>
            <Package className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{stock_overview.total_items}</div>
          <p className="text-xs text-gray-500">Software: {stock_overview.total_quantity_software} | Physical: {stock_overview.total_quantity_physical}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Discrepancies</p>
            <AlertTriangle className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{discrepancy_analysis.total_discrepancies}</div>
          <p className="text-xs text-gray-500">Value Impact: ₹{discrepancy_analysis.total_value_impact.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Audit Rate</p>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{stock_overview.audit_completion_rate}%</div>
          <p className="text-xs text-gray-500">Audited: {stock_overview.audited_items}/{stock_overview.total_items}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Expired Items</p>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600">{expiry_analysis.expired}</div>
          <p className="text-xs text-gray-500">Expiring 0-30d: {expiry_analysis.expiring_0_30}</p>
        </div>
      </div>

      <StockCharts 
        discrepancyData={data.discrepancy_analysis}
        expiryData={data.expiry_analysis}
        valueData={data.stock_value_analysis}
        auditData={data.audit_performance}
        movementData={data.stock_movement}
        adjustmentData={data.adjustment_analysis}
      />
    </div>
  )
}
