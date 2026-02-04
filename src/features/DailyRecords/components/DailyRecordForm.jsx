import React, { useState, useEffect } from 'react'
import { dailyRecordsAPI } from '../services/dailyRecords'

const DailyRecordForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    day: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
    cash_balance: 1000,
    no_of_bills: '',
    actual_cash: '',
    online_sales: '',
    unbilled_sales: '',
    software_figure: '',
    cash_reserve: '',
    reserve_comments: '',
    expense_amount: '',
    notes: ''
  })

  const [calculations, setCalculations] = useState({
    totalCash: 0,
    totalSales: 0,
    recordedSales: 0,
    salesDifference: 0,
    averageBill: 0
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    calculateFields()
  }, [formData])

  const calculateFields = () => {
    const actualCash = parseFloat(formData.actual_cash) || 0
    const cashReserve = parseFloat(formData.cash_reserve) || 0
    const expenseAmount = parseFloat(formData.expense_amount) || 0
    const onlineSales = parseFloat(formData.online_sales) || 0
    const unbilledSales = parseFloat(formData.unbilled_sales) || 0
    const softwareFigure = parseFloat(formData.software_figure) || 0
    const noBills = parseInt(formData.no_of_bills) || 0

    const totalCash = actualCash + cashReserve + expenseAmount
    const totalSales = onlineSales + totalCash
    const recordedSales = unbilledSales + softwareFigure
    const salesDifference = totalSales - recordedSales
    const averageBill = noBills > 0 ? recordedSales / noBills : 0

    setCalculations({
      totalCash,
      totalSales,
      recordedSales,
      salesDifference,
      averageBill
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const numericData = { ...formData }
      const numericFields = ['cash_balance', 'no_of_bills', 'actual_cash', 'online_sales', 
                           'unbilled_sales', 'software_figure', 'cash_reserve', 'expense_amount']
      
      numericFields.forEach(field => {
        if (numericData[field]) numericData[field] = parseFloat(numericData[field])
      })

      await dailyRecordsAPI.create(numericData)
      onSuccess?.()
      alert('Record saved successfully!')
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'date') {
      const selectedDate = new Date(value)
      const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' })
      setFormData(prev => ({
        ...prev,
        date: value,
        day: dayName
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl shadow-soft border border-primary-100">
      {/* Basic Info Section */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Day</label>
            <input
              type="text"
              name="day"
              value={formData.day}
              readOnly
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Sales Data Section */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Sales Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Number of Bills</label>
            <input
              type="number"
              name="no_of_bills"
              value={formData.no_of_bills}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Actual Cash</label>
            <input
              type="number"
              name="actual_cash"
              value={formData.actual_cash}
              onChange={handleChange}
              step="0.01"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Online Sales</label>
            <input
              type="number"
              name="online_sales"
              value={formData.online_sales}
              onChange={handleChange}
              step="0.01"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Financial Details Section */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Financial Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Unbilled Sales</label>
            <input
              type="number"
              name="unbilled_sales"
              value={formData.unbilled_sales}
              onChange={handleChange}
              step="0.01"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Software Figure</label>
            <input
              type="number"
              name="software_figure"
              value={formData.software_figure}
              onChange={handleChange}
              step="0.01"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Cash Reserve</label>
            <input
              type="number"
              name="cash_reserve"
              value={formData.cash_reserve}
              onChange={handleChange}
              step="0.01"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Reserve Comments</label>
            <input
              type="text"
              name="reserve_comments"
              value={formData.reserve_comments}
              onChange={handleChange}
              placeholder="e.g., 5 candles"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Expense Amount</label>
            <input
              type="number"
              name="expense_amount"
              value={formData.expense_amount}
              onChange={handleChange}
              step="0.01"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="2"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Calculated Fields */}
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-4 rounded-xl border border-primary-200">
        <h3 className="text-sm font-semibold text-primary-800 mb-3">Calculated Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white p-2.5 rounded-lg shadow-sm">
            <div className="text-gray-500 text-[10px] uppercase tracking-wide mb-0.5">Total Cash</div>
            <div className="font-bold text-sm text-primary-700">₹{calculations.totalCash.toFixed(2)}</div>
          </div>
          <div className="bg-white p-2.5 rounded-lg shadow-sm">
            <div className="text-gray-500 text-[10px] uppercase tracking-wide mb-0.5">Total Sales</div>
            <div className="font-bold text-sm text-primary-700">₹{calculations.totalSales.toFixed(2)}</div>
          </div>
          <div className="bg-white p-2.5 rounded-lg shadow-sm">
            <div className="text-gray-500 text-[10px] uppercase tracking-wide mb-0.5">Recorded</div>
            <div className="font-bold text-sm text-primary-700">₹{calculations.recordedSales.toFixed(2)}</div>
          </div>
          <div className={`bg-white p-2.5 rounded-lg shadow-sm ${Math.abs(calculations.salesDifference) > 50 ? 'ring-2 ring-red-400' : ''}`}>
            <div className="text-gray-500 text-[10px] uppercase tracking-wide mb-0.5">Difference</div>
            <div className={`font-bold text-sm ${Math.abs(calculations.salesDifference) > 50 ? 'text-red-600' : 'text-primary-700'}`}>
              ₹{calculations.salesDifference.toFixed(2)}
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-lg shadow-sm">
            <div className="text-gray-500 text-[10px] uppercase tracking-wide mb-0.5">Avg Bill</div>
            <div className="font-bold text-sm text-primary-700">₹{calculations.averageBill.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-semibold py-2.5 px-6 rounded-lg shadow-glow hover:shadow-glow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95"
      >
        {loading ? 'Saving...' : 'Save Record'}
      </button>
    </form>
  )
}

export default DailyRecordForm