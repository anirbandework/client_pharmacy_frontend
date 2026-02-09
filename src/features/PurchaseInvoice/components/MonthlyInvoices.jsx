import React, { useState, useEffect } from 'react'
import { invoiceAPI } from '../services/invoiceApi'
import { Calendar, Package, Eye } from 'lucide-react'

const MonthlyInvoices = ({ onViewInvoice }) => {
  const [invoices, setInvoices] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  useEffect(() => {
    fetchData()
  }, [year, month])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [invoicesRes, summaryRes] = await Promise.all([
        invoiceAPI.getMonthly(year, month),
        invoiceAPI.getMonthlySummary(year, month)
      ])
      setInvoices(invoicesRes.data)
      setSummary(summaryRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (invoice) => {
    try {
      const response = await invoiceAPI.getById(invoice.id)
      setSelectedInvoice(response.data)
    } catch (error) {
      console.error('Error fetching invoice details:', error)
    }
  }

  const getStatusColor = (soldPercentage) => {
    if (soldPercentage >= 90) return 'bg-green-100 border-green-500 text-green-700'
    if (soldPercentage >= 50) return 'bg-yellow-100 border-yellow-500 text-yellow-700'
    if (soldPercentage >= 20) return 'bg-orange-100 border-orange-500 text-orange-700'
    return 'bg-red-100 border-red-500 text-red-700'
  }

  const getStatusLabel = (soldPercentage) => {
    if (soldPercentage >= 90) return 'Sold Out'
    if (soldPercentage >= 50) return 'Partially Sold'
    if (soldPercentage >= 20) return 'Slow Moving'
    return 'Not Sold'
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-4 md:p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <Calendar className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold">Monthly Invoices</h3>
              <p className="text-xs text-white/80">{monthNames[month - 1]} {year}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="px-3 py-1.5 text-xs md:text-sm bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white font-medium">
              {monthNames.map((name, i) => (
                <option key={i + 1} value={i + 1} className="text-gray-900">{name}</option>
              ))}
            </select>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="px-3 py-1.5 text-xs md:text-sm bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white font-medium">
              {Array.from({ length: 5 }, (_, i) => (
                <option key={i} value={new Date().getFullYear() - i} className="text-gray-900">{new Date().getFullYear() - i}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg shadow-soft border border-primary-100 p-3">
            <div className="text-xl font-bold text-gray-900">{summary.total_invoices || 0}</div>
            <div className="text-xs text-gray-500">Total Invoices</div>
          </div>
          <div className="bg-green-50 rounded-lg shadow-soft border-2 border-green-300 p-3">
            <div className="text-xl font-bold text-green-700">{summary.green_invoices || 0}</div>
            <div className="text-xs text-green-600 font-semibold">Green</div>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow-soft border-2 border-yellow-300 p-3">
            <div className="text-xl font-bold text-yellow-700">{summary.yellow_invoices || 0}</div>
            <div className="text-xs text-yellow-600 font-semibold">Yellow</div>
          </div>
          <div className="bg-red-50 rounded-lg shadow-soft border-2 border-red-300 p-3">
            <div className="text-xl font-bold text-red-700">{summary.red_invoices || 0}</div>
            <div className="text-xs text-red-600 font-semibold">Red</div>
          </div>
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-12 text-center">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <div className="text-lg font-semibold text-gray-600">No invoices found</div>
          <div className="text-sm text-gray-500">No purchase invoices for this period</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {invoices.map((invoice) => (
            <div key={invoice.id} className={`rounded-xl shadow-soft border-2 p-4 hover:shadow-lg transition-all ${getStatusColor(invoice.sold_percentage || 0)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-2xl font-bold text-gray-900">{new Date(invoice.invoice_date).getDate()}</div>
                    <div className="text-[10px] uppercase text-gray-500">{new Date(invoice.invoice_date).toLocaleString('default', { month: 'short' })}</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">{invoice.invoice_number}</div>
                    <div className="text-xs text-gray-600">{invoice.supplier_name}</div>
                    <div className="text-xs text-gray-500 mt-1">{invoice.total_items || 0} items • ₹{(invoice.total_amount || 0).toLocaleString('en-IN')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{(invoice.sold_percentage || 0).toFixed(1)}%</div>
                    <div className="text-xs font-semibold uppercase">{getStatusLabel(invoice.sold_percentage || 0)}</div>
                  </div>
                  <button onClick={() => handleViewDetails(invoice)} className="p-2 bg-white rounded-lg hover:bg-gray-50 transition-all">
                    <Eye className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedInvoice(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selectedInvoice.invoice_number}</h3>
                  <p className="text-sm text-white/80">{selectedInvoice.supplier_name}</p>
                </div>
                <button onClick={() => setSelectedInvoice(null)} className="text-white hover:bg-white/20 rounded-lg p-2">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-gray-500">Invoice Date</div>
                  <div className="font-semibold">{new Date(selectedInvoice.invoice_date).toLocaleDateString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Received Date</div>
                  <div className="font-semibold">{new Date(selectedInvoice.received_date).toLocaleDateString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Total Amount</div>
                  <div className="font-semibold">₹{(selectedInvoice.total_amount || 0).toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Sold</div>
                  <div className="font-semibold">{(selectedInvoice.sold_percentage || 0).toFixed(1)}%</div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Items ({selectedInvoice.items?.length || 0})</h4>
                <div className="space-y-2">
                  {selectedInvoice.items?.map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-sm">{item.item_name}</div>
                          <div className="text-xs text-gray-600">Code: {item.item_code} • Batch: {item.batch_number}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{item.remaining_quantity}/{item.purchased_quantity}</div>
                          <div className="text-xs text-gray-500">Remaining</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MonthlyInvoices
