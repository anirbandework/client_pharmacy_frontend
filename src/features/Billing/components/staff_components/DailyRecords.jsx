import React, { useState, useEffect } from 'react'
import { dailyRecordsAPI } from '../../services/dailyRecords'
import { Calendar, Plus, Trash2, Save, DollarSign, TrendingUp, TrendingDown, Download } from 'lucide-react'
import toast from 'react-hot-toast'

const DailyRecords = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportDates, setExportDates] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [formData, setFormData] = useState({
    unbilled_amount: 0,
    unbilled_notes: '',
    actual_cash_deposited: 0,
    cash_reserve: 0
  })
  const [newExpense, setNewExpense] = useState({
    expense_category: '',
    amount: 0,
    description: ''
  })

  useEffect(() => {
    fetchRecord()
  }, [selectedDate])

  const fetchRecord = async () => {
    setLoading(true)
    try {
      const { data } = await dailyRecordsAPI.getDailyRecord(selectedDate)
      setRecord(data)
      setFormData({
        unbilled_amount: data.unbilled_amount || 0,
        unbilled_notes: data.unbilled_notes || '',
        actual_cash_deposited: data.actual_cash_deposited || 0,
        cash_reserve: data.cash_reserve || 0
      })
    } catch (error) {
      toast.error('Failed to fetch record')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    try {
      await dailyRecordsAPI.updateRecord(selectedDate, formData)
      toast.success('Record updated')
      setEditMode(false)
      fetchRecord()
    } catch (error) {
      toast.error('Failed to update record')
    }
  }

  const handleAddExpense = async () => {
    if (!newExpense.expense_category || newExpense.amount <= 0) {
      toast.error('Please fill expense details')
      return
    }
    try {
      await dailyRecordsAPI.addExpense(selectedDate, newExpense)
      toast.success('Expense added')
      setNewExpense({ expense_category: '', amount: 0, description: '' })
      fetchRecord()
    } catch (error) {
      toast.error('Failed to add expense')
    }
  }

  const handleDeleteExpense = async (expenseId) => {
    if (!confirm('Delete this expense?')) return
    try {
      await dailyRecordsAPI.deleteExpense(expenseId)
      toast.success('Expense deleted')
      fetchRecord()
    } catch (error) {
      toast.error('Failed to delete expense')
    }
  }

  const handleExportExcel = async () => {
    if (exportDates.startDate > exportDates.endDate) {
      toast.error('Start date cannot be after end date')
      return
    }
    try {
      const response = await dailyRecordsAPI.exportExcel(exportDates.startDate, exportDates.endDate)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `daily_records_${exportDates.startDate}_to_${exportDates.endDate}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      setShowExportModal(false)
      toast.success('Excel exported successfully')
    } catch (error) {
      toast.error('Failed to export Excel')
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-primary-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
        </div>
      </div>

      {record && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-90">No. of Bills</p>
                  <p className="text-3xl font-bold mt-1">{record.no_of_bills}</p>
                </div>
                <TrendingUp className="w-8 h-8 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-90">Total Sales</p>
                  <p className="text-3xl font-bold mt-1">₹{record.total_sales.toFixed(2)}</p>
                </div>
                <DollarSign className="w-8 h-8 opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-90">Average Bill</p>
                  <p className="text-3xl font-bold mt-1">₹{record.average_bill.toFixed(2)}</p>
                </div>
                <TrendingUp className="w-8 h-8 opacity-80" />
              </div>
            </div>

            <div className={`bg-gradient-to-br ${record.difference >= 0 ? 'from-orange-500 to-orange-600' : 'from-red-500 to-red-600'} rounded-xl shadow-md p-6 text-white`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-90">Difference</p>
                  <p className="text-3xl font-bold mt-1">₹{record.difference.toFixed(2)}</p>
                </div>
                {record.difference >= 0 ? <TrendingUp className="w-8 h-8 opacity-80" /> : <TrendingDown className="w-8 h-8 opacity-80" />}
              </div>
            </div>
          </div>

          {/* Sales Breakdown */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Sales Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-600">Software Sales</p>
                <p className="text-2xl font-bold text-blue-600">₹{record.software_sales.toFixed(2)}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-600">Cash Sales</p>
                <p className="text-2xl font-bold text-green-600">₹{record.cash_sales.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Depositable (₹2000/500/200/100): ₹{record.depositable_amount.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Small notes/coins: ₹{record.small_denomination.toFixed(2)}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-600">Online Sales</p>
                <p className="text-2xl font-bold text-purple-600">₹{record.online_sales.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Manual Entries */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Manual Entries</h3>
              {!editMode ? (
                <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleUpdate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                    <Save className="w-4 h-4" />Save
                  </button>
                  <button onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Unbilled Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.unbilled_amount}
                  onChange={(e) => setFormData({ ...formData, unbilled_amount: parseFloat(e.target.value) || 0 })}
                  disabled={!editMode}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cash Deposited (₹500, ₹200, ₹100 notes)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.actual_cash_deposited}
                  onChange={(e) => setFormData({ ...formData, actual_cash_deposited: parseFloat(e.target.value) || 0 })}
                  disabled={!editMode}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cash Reserve (₹10, ₹20, ₹50 notes & coins)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cash_reserve}
                  onChange={(e) => setFormData({ ...formData, cash_reserve: parseFloat(e.target.value) || 0 })}
                  disabled={!editMode}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Unbilled Notes</label>
                <input
                  type="text"
                  value={formData.unbilled_notes}
                  onChange={(e) => setFormData({ ...formData, unbilled_notes: e.target.value })}
                  disabled={!editMode}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="border rounded-lg p-4 bg-blue-50">
                <p className="text-sm text-gray-600">Recorded Sales</p>
                <p className="text-xl font-bold text-blue-600">₹{record.recorded_sales.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Software + Unbilled</p>
              </div>
              <div className="border rounded-lg p-4 bg-green-50">
                <p className="text-sm text-gray-600">Reserve Balance</p>
                <p className="text-xl font-bold text-green-600">₹{record.reserve_balance.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Cash Reserve</p>
              </div>
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Expenses (Total: ₹{record.total_expenses.toFixed(2)})</h3>
            
            {/* Add Expense Form */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Category (e.g., Rent, Utilities)"
                  value={newExpense.expense_category}
                  onChange={(e) => setNewExpense({ ...newExpense, expense_category: e.target.value })}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <button onClick={handleAddExpense} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />Add Expense
                </button>
              </div>
            </div>

            {/* Expenses List */}
            {record.expenses && record.expenses.length > 0 ? (
              <div className="space-y-2">
                {record.expenses.map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <p className="font-semibold">{expense.expense_category}</p>
                      {expense.description && <p className="text-sm text-gray-600">{expense.description}</p>}
                      {expense.staff_name && <p className="text-xs text-gray-500 mt-1">Added by: {expense.staff_name}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-red-600">₹{expense.amount.toFixed(2)}</p>
                      <button onClick={() => handleDeleteExpense(expense.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No expenses recorded</p>
            )}
          </div>
        </>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Export Daily Records</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  value={exportDates.startDate}
                  onChange={(e) => setExportDates({ ...exportDates, startDate: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                  type="date"
                  value={exportDates.endDate}
                  onChange={(e) => setExportDates({ ...exportDates, endDate: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleExportExcel}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Excel
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DailyRecords
