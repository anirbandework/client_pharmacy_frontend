import React, { useState, useEffect } from 'react'
import { dailyRecordsAPI } from '../services/dailyRecords'
import { Edit2, Trash2, Eye, Calendar, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'

const RecordsList = ({ onEdit, refresh }) => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const limit = 10

  useEffect(() => {
    fetchRecords()
  }, [refresh, page, search])

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const response = await dailyRecordsAPI.getAll({ limit, skip: (page - 1) * limit })
      setRecords(response.data)
    } catch (error) {
      console.error('Error fetching records:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this record? This action cannot be undone.')) return
    try {
      await dailyRecordsAPI.delete(id)
      fetchRecords()
    } catch (error) {
      alert('Error deleting record')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by date, day, or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-2xl shadow-soft border border-primary-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-primary-600 to-accent-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Day</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Bills</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Cash</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Online</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Total Sales</th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Difference</th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <div className="text-lg font-semibold">No records found</div>
                    <div className="text-sm">Start by adding your first daily record</div>
                  </td>
                </tr>
              ) : (
                records.map((record) => {
                  const totalSales = (record.actual_cash || 0) + (record.online_sales || 0) + (record.cash_reserve || 0) + (record.expense_amount || 0)
                  const recordedSales = (record.unbilled_sales || 0) + (record.software_figure || 0)
                  const diff = totalSales - recordedSales
                  
                  return (
                    <tr key={record.id} className="hover:bg-primary-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                            <Calendar className="w-4 h-4 text-primary-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{new Date(record.date).toLocaleDateString('en-IN')}</div>
                            <div className="text-xs text-gray-500">{new Date(record.date).toLocaleDateString('en-IN', { year: 'numeric' })}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {record.day}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-semibold text-gray-900">{record.no_of_bills || 0}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-gray-900">₹{(record.actual_cash || 0).toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-gray-900">₹{(record.online_sales || 0).toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-gray-900">₹{totalSales.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          Math.abs(diff) > 50 
                            ? 'bg-red-100 text-red-700 ring-2 ring-red-400' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {diff > 0 ? <TrendingUp className="w-3 h-3" /> : diff < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                          ₹{Math.abs(diff).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => onEdit(record)} 
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all hover:scale-110"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(record.id)} 
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all hover:scale-110"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {records.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing page {page}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold">{page}</span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={records.length < limit}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecordsList
