import { useState, useEffect } from 'react'
import { Store } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminPurchaseInvoiceAPI } from '../../services/admin_purchase_invoice_apis'
import { adminApi } from '../../../Admin&SuperAdmin/services/admin&superAminApi'
import DashboardCharts from './DashboardCharts'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)

  useEffect(() => {
    fetchShops()
  }, [])

  useEffect(() => {
    if (shops.length > 0) {
      fetchDashboardData()
    }
  }, [selectedShop, shops])

  const fetchShops = async () => {
    try {
      const response = await adminApi.getShops()
      setShops(response)
    } catch (error) {
      toast.error('Failed to fetch shops')
    }
  }

  const fetchDashboardData = async () => {
    try {
      const params = selectedShop ? { shop_id: selectedShop } : {}
      const response = await adminPurchaseInvoiceAPI.getDashboardAnalytics(params)
      setDashboardData(response.data)
    } catch (error) {
      toast.error('Failed to fetch dashboard data')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-md border border-slate-200 dark:border-slate-700/50 p-4">
        <div className="flex items-center gap-3">
          <Store className="w-5 h-5 text-gray-600 dark:text-slate-400" />
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Filter by Shop:</label>
          <select
            value={selectedShop || ''}
            onChange={(e) => setSelectedShop(e.target.value ? parseInt(e.target.value) : null)}
            className="flex-1 max-w-xs px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Shops</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.shop_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DashboardCharts data={dashboardData} />
    </div>
  )
}

export default Dashboard
