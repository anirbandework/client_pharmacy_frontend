import React, { useState, useEffect } from 'react'
import { billingAdminAPI } from '../../services/admin_billing_apis'
import { adminApi } from '../../../Admin&SuperAdmin/services/admin&superAminApi'
import { TrendingUp, Download, Store } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminReports = () => {
  const [topSelling, setTopSelling] = useState([])
  const [dailySales, setDailySales] = useState([])
  const [loading, setLoading] = useState(true)
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)
  const [days, setDays] = useState(30)

  useEffect(() => {
    fetchShops()
  }, [])

  useEffect(() => {
    fetchReports()
  }, [selectedShop, days])

  const fetchShops = async () => {
    try {
      const response = await adminApi.getShops()
      setShops(response)
    } catch {
      toast.error('Failed to fetch shops')
    }
  }

  const fetchReports = async () => {
    setLoading(true)
    try {
      const params = { days }
      if (selectedShop) params.shop_id = selectedShop
      const [topData, dailyData] = await Promise.all([
        billingAdminAPI.getTopSelling({ ...params, limit: 10 }),
        billingAdminAPI.getDailySales({ days: 7, ...(selectedShop ? { shop_id: selectedShop } : {}) })
      ])
      setTopSelling(topData.data)
      setDailySales(dailyData.data)
    } catch (error) {
      toast.error('Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  const exportBills = async () => {
    try {
      const params = {}
      if (selectedShop) params.shop_id = selectedShop
      const response = await billingAdminAPI.exportBills(params)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `admin_bills_${new Date().toISOString().split('T')[0]}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Bills exported successfully')
    } catch {
      toast.error('Export failed')
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-gray-500" />
            <select
              value={selectedShop || ''}
              onChange={(e) => setSelectedShop(e.target.value ? parseInt(e.target.value) : null)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
            >
              <option value="">All Shops</option>
              {shops.map(shop => (
                <option key={shop.id} value={shop.id}>{shop.shop_name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Period:</span>
            {[7, 15, 30, 60, 90].map(d => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  days === d ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <button
          onClick={exportBills}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Download className="w-5 h-5" />
          Export Bills to Excel{selectedShop ? ` (${shops.find(s => s.id === selectedShop)?.shop_name})` : ' (All Shops)'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading reports...</div>
      ) : (
        <>
          {/* Top Selling Items */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Top Selling Items (Last {days} Days)
            </h3>
            {topSelling.length === 0 ? (
              <p className="text-gray-500 text-sm">No data available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Rank</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Item Name</th>
                      <th className="px-4 py-2 text-right text-sm font-semibold">Qty Sold</th>
                      <th className="px-4 py-2 text-right text-sm font-semibold">Revenue</th>
                      <th className="px-4 py-2 text-right text-sm font-semibold">Transactions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSelling.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold">{index + 1}</td>
                        <td className="px-4 py-3">{item.item_name}</td>
                        <td className="px-4 py-3 text-right">{item.total_quantity}</td>
                        <td className="px-4 py-3 text-right font-semibold">₹{item.total_revenue?.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">{item.transaction_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Daily Sales */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Daily Sales (Last 7 Days)</h3>
            {dailySales.length === 0 ? (
              <p className="text-gray-500 text-sm">No data available</p>
            ) : (
              <div className="space-y-2">
                {dailySales.map((day, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{new Date(day.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">{day.bill_count} bills</p>
                    </div>
                    <p className="text-lg font-bold text-green-600">₹{day.total_sales?.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default AdminReports
