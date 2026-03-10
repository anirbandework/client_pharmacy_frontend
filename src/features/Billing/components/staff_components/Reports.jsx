import React, { useState, useEffect } from 'react'
import { billingAPI } from '../../services/staff_billing_apis'
import { TrendingUp, Download } from 'lucide-react'
import toast from 'react-hot-toast'

const Reports = () => {
  const [topSelling, setTopSelling] = useState([])
  const [dailySales, setDailySales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const [topData, dailyData] = await Promise.all([
        billingAPI.getTopSelling({ limit: 10, days: 30 }),
        billingAPI.getDailySales(7)
      ])
      setTopSelling(topData.data)
      setDailySales(dailyData.data)
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportBills = async () => {
    try {
      const response = await billingAPI.exportBills()
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `bills_${new Date().toISOString().split('T')[0]}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Bills exported successfully')
    } catch (error) {
      toast.error('Export failed')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-4">
      {/* Export Button */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <button
          onClick={exportBills}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Download className="w-5 h-5" />
          Export Bills to Excel
        </button>
      </div>

      {/* Top Selling Items */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Top Selling Items (Last 30 Days)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Rank</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Item Name</th>
                <th className="px-4 py-2 text-right text-sm font-semibold">Quantity Sold</th>
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
                  <td className="px-4 py-3 text-right font-semibold">₹{item.total_revenue.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">{item.transaction_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Sales */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Daily Sales (Last 7 Days)</h3>
        <div className="space-y-2">
          {dailySales.map((day, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">{new Date(day.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">{day.bill_count} bills</p>
              </div>
              <p className="text-lg font-bold text-green-600">₹{day.total_sales.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Reports
