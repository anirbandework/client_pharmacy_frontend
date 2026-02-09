import React, { useState } from 'react'
import { invoiceAPI } from '../services/invoiceApi'
import { Zap, Upload, RefreshCw, Download } from 'lucide-react'

const WingsIntegration = ({ onSuccess }) => {
  const [syncConfig, setSyncConfig] = useState({
    wings_api_endpoint: '',
    shop_code: ''
  })
  const [salesData, setSalesData] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSync = async () => {
    if (!syncConfig.wings_api_endpoint || !syncConfig.shop_code) {
      alert('Please provide WINGS API endpoint and shop code')
      return
    }
    setLoading(true)
    try {
      await invoiceAPI.syncWithWingsLive(syncConfig.wings_api_endpoint, syncConfig.shop_code)
      alert('Sync completed successfully!')
      onSuccess?.()
    } catch (error) {
      alert('Sync failed: ' + (error.response?.data?.detail || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleImportSales = async () => {
    if (!salesData.trim()) {
      alert('Please provide sales data in JSON format')
      return
    }
    setLoading(true)
    try {
      const data = JSON.parse(salesData)
      await invoiceAPI.importSalesFromWings(data)
      alert('Sales data imported successfully!')
      setSalesData('')
      onSuccess?.()
    } catch (error) {
      alert('Import failed: ' + (error.response?.data?.detail || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-4 md:p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
            <Zap className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold">WINGS POS Integration</h3>
            <p className="text-xs text-white/80">Sync purchase invoices and sales data</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-soft border border-primary-100 space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Live Sync Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">WINGS API Endpoint</label>
              <input type="text" placeholder="https://wings-api.example.com" value={syncConfig.wings_api_endpoint} onChange={(e) => setSyncConfig(prev => ({ ...prev, wings_api_endpoint: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Shop Code</label>
              <input type="text" placeholder="SHOP001" value={syncConfig.shop_code} onChange={(e) => setSyncConfig(prev => ({ ...prev, shop_code: e.target.value }))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all" />
            </div>
          </div>
          <button onClick={handleSync} disabled={loading} className="mt-4 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-semibold py-2.5 px-6 rounded-lg shadow-glow hover:shadow-glow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Syncing...' : 'Sync with WINGS Live'}
          </button>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Import Sales Data</h4>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Sales Data (JSON Array)</label>
            <textarea value={salesData} onChange={(e) => setSalesData(e.target.value)} placeholder='[{"item_id": 1, "quantity_sold": 10, "sale_price": 100}]' rows="4" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all font-mono" />
          </div>
          <button onClick={handleImportSales} disabled={loading} className="mt-3 w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white text-sm font-semibold py-2.5 px-6 rounded-lg shadow-glow hover:shadow-glow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            {loading ? 'Importing...' : 'Import Sales Data'}
          </button>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-800">
              <div className="font-semibold mb-2">📋 Integration Features:</div>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-xs">
                <li>Automatic purchase invoice import from warehouse</li>
                <li>Real-time sales data synchronization</li>
                <li>Batch-wise stock tracking</li>
                <li>Expiry date monitoring</li>
                <li>Store-specific invoice filtering</li>
                <li>Manual sales data import via JSON</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WingsIntegration
