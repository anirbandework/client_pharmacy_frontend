import React, { useState, useEffect } from 'react'
import { billingAPI } from '../services/billing'
import { Eye, Trash2, Search, Printer } from 'lucide-react'
import toast from 'react-hot-toast'

const BillHistory = () => {
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchPhone, setSearchPhone] = useState('')
  const [selectedBill, setSelectedBill] = useState(null)
  const [storeConfig, setStoreConfig] = useState(null)

  useEffect(() => {
    fetchBills()
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const { data } = await billingAPI.getShopConfig()
      setStoreConfig(data.config)
    } catch (error) {
      console.error('Failed to load config:', error)
    }
  }

  const fetchBills = async () => {
    try {
      const { data } = await billingAPI.getBills({ limit: 100 })
      setBills(data)
    } catch (error) {
      console.error('Error fetching bills:', error)
    } finally {
      setLoading(false)
    }
  }

  const searchByPhone = async () => {
    if (!searchPhone) {
      fetchBills()
      return
    }
    try {
      const { data } = await billingAPI.getBills({ customer_phone: searchPhone })
      setBills(data)
    } catch (error) {
      toast.error('Search failed')
    }
  }

  const viewBill = async (billId) => {
    try {
      const { data } = await billingAPI.getBill(billId)
      setSelectedBill(data)
    } catch (error) {
      toast.error('Failed to load bill details')
    }
  }

  const deleteBill = async (billId) => {
    if (!window.confirm('Delete this bill? Stock will be restored.')) return
    
    try {
      await billingAPI.deleteBill(billId)
      toast.success('Bill deleted and stock restored')
      fetchBills()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete bill')
    }
  }

  const printBill = () => {
    window.print()
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by phone number..."
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchByPhone()}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={searchByPhone}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Search
          </button>
          <button
            onClick={fetchBills}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Bills List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Bill No</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Payment</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Subtotal</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Tax</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Total</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Paid</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Change</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Staff</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm">{bill.bill_number}</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(bill.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{bill.customer_name || '-'}</td>
                  <td className="px-4 py-3">{bill.customer_phone || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                      {bill.cash_amount > 0 && 'Cash'}
                      {bill.card_amount > 0 && 'Card'}
                      {bill.online_amount > 0 && 'Online'}
                      {bill.cash_amount > 0 && bill.card_amount > 0 && '+'}
                      {bill.cash_amount > 0 && bill.online_amount > 0 && '+'}
                      {bill.card_amount > 0 && bill.online_amount > 0 && '+'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">₹{bill.subtotal.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">₹{bill.tax_amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-semibold">₹{bill.total_amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-blue-600">₹{bill.amount_paid.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-green-600">₹{bill.change_returned.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm">{bill.staff_name}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => viewBill(bill.id)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      <Eye className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => deleteBill(bill.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill Details Modal */}
      {selectedBill && storeConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto print:max-w-full print:h-auto print:overflow-visible">
            <div className="p-8">
              {/* Header Buttons */}
              <div className="flex justify-end gap-2 mb-4 print:hidden">
                <button
                  onClick={printBill}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button
                  onClick={() => setSelectedBill(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>

              {/* Tax Invoice */}
              <div className="border-2 border-black p-4">
                  <div className="border-b-2 border-black pb-3 mb-3">
                    <div className="flex items-center justify-between">
                      {/* Logo and Store Info - Left Aligned */}
                      <div className="flex items-center gap-3">
                        <img src={storeConfig.logo} alt="" className="w-20 h-20 object-contain" />
                        <div className="text-left">
                          <h2 className="text-lg font-bold uppercase">{storeConfig.storeName}</h2>
                          <p className="text-xs mt-0.5">D.L No. {storeConfig.dlNumbers.dl20} | {storeConfig.dlNumbers.dl21}</p>
                          <p className="text-xs">F.L No. {storeConfig.flNumber}</p>
                          <p className="text-xs mt-0.5">{storeConfig.address.line1}</p>
                          <p className="text-xs">{storeConfig.address.state}, {storeConfig.address.pincode} | Phone: {storeConfig.phone}</p>
                        </div>
                      </div>
                      
                      {/* Tax Invoice Title - Right */}
                      <div className="text-right">
                        <h1 className="text-2xl font-bold">TAX INVOICE</h1>
                      </div>
                    </div>
                  </div>

                  {/* Customer & Bill Info */}
                  <div className="grid grid-cols-2 gap-4 text-xs mb-3 border-b border-black pb-2">
                    <div>
                      <p><strong>Patient Name:</strong> {selectedBill.customer_name || 'N/A'}</p>
                      <p><strong>Mobile:</strong> {selectedBill.customer_phone || 'N/A'}</p>
                      <p><strong>Doctor Name:</strong> {selectedBill.doctor_name || 'SELF'}</p>
                    </div>
                    <div className="text-right">
                      <p><strong>Bill No.:</strong> {selectedBill.bill_number}</p>
                      <p><strong>Date:</strong> {new Date(selectedBill.created_at).toLocaleDateString('en-GB')}</p>
                    </div>
                  </div>

                  {/* Items Table */}
                  <table className="w-full text-xs border-collapse mb-3">
                    <thead>
                      <tr className="border-y-2 border-black">
                        <th className="py-1 text-left">Sr No</th>
                        <th className="py-1 text-left">Name of Drug</th>
                        <th className="py-1 text-left">B. No.</th>
                        <th className="py-1 text-right">MRP</th>
                        <th className="py-1 text-right">Qty</th>
                        <th className="py-1 text-right">Rate</th>
                        <th className="py-1 text-right">SGST(%)</th>
                        <th className="py-1 text-right">CGST(%)</th>
                        <th className="py-1 text-right">Discount</th>
                        <th className="py-1 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBill.items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-300">
                          <td className="py-1">{index + 1}</td>
                          <td className="py-1">{item.item_name}</td>
                          <td className="py-1">{item.batch_number}</td>
                          <td className="py-1 text-right">{item.mrp || '-'}</td>
                          <td className="py-1 text-right">{item.quantity}</td>
                          <td className="py-1 text-right">{item.unit_price.toFixed(2)}</td>
                          <td className="py-1 text-right">{item.sgst_amount.toFixed(2)} ({item.sgst_percent}%)</td>
                          <td className="py-1 text-right">{item.cgst_amount.toFixed(2)} ({item.cgst_percent}%)</td>
                          <td className="py-1 text-right">{item.discount_amount?.toFixed(2) || '0.00'}</td>
                          <td className="py-1 text-right font-semibold">{item.total_price.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Footer */}
                  <div className="border-t-2 border-black pt-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <p><strong>Total MRP Amount:</strong> ₹{selectedBill.items.reduce((sum, item) => {
                          const mrpValue = item.mrp ? parseFloat(item.mrp.toString().match(/[\d.]+/)?.[0] || item.unit_price) : item.unit_price;
                          return sum + mrpValue * item.quantity;
                        }, 0).toFixed(2)}</p>
                        <p className="mt-1"><strong>GST IN:</strong> {storeConfig.gstIn}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p><strong>Subtotal:</strong> ₹{selectedBill.subtotal.toFixed(2)}</p>
                        <p><strong>Tax:</strong> ₹{selectedBill.tax_amount.toFixed(2)}</p>
                        <p><strong>Discount:</strong> ₹{selectedBill.discount_amount.toFixed(2)}</p>
                        <p className="text-lg font-bold"><strong>Total:</strong> ₹{selectedBill.total_amount.toFixed(2)}</p>
                        <p className="text-blue-600"><strong>Amount Paid:</strong> ₹{selectedBill.amount_paid.toFixed(2)}</p>
                        {selectedBill.change_returned > 0 && (
                          <p className="text-green-600"><strong>Change:</strong> ₹{selectedBill.change_returned.toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BillHistory
