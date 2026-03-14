import React, { useState, useEffect } from 'react'
import { billingAPI } from '../../services/staff_billing_apis'
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
      const { data } = await billingAPI.getBills({ limit: 50 })
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
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      {/* Search */}
      <div className="mb-6 space-y-3 overflow-visible">
        <div className="flex gap-2 relative z-10 p-1">
          <div className="flex-1 relative overflow-visible">
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg p-0.5">
              <input
                type="text"
                placeholder="Search by phone number..."
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchByPhone()}
                className="w-full px-4 py-2 bg-white rounded-lg focus:outline-none transition-all duration-300"
                style={{
                  boxShadow: searchPhone ? 
                    '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)' : 
                    'none',
                  animation: searchPhone ? 'ai-pulse 2s ease-in-out infinite' : 'none'
                }}
              />
            </div>
          </div>
          <style>{`
            @keyframes ai-pulse {
              0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1); }
              50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.2); }
            }
          `}</style>
          <button
            onClick={searchByPhone}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium shadow-md hover:shadow-lg transition-all"
          >
            Search
          </button>
          <button
            onClick={fetchBills}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium shadow-md hover:shadow-lg transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Bills List */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading bills...</p>
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100/80 via-sky-100/80 to-cyan-100/80 backdrop-blur-sm border-b border-blue-200/50">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Bill No</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Subtotal</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Tax</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Paid</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Change</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Staff</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {bills.length === 0 ? (
                <tr>
                  <td colSpan="12" className="text-center py-16 bg-white">
                    <p className="text-gray-500 text-lg">No bills found</p>
                  </td>
                </tr>
              ) : (
                bills.map((bill, idx) => (
                  <tr key={bill.id} className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-sm ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="px-6 py-4 font-mono text-sm">{bill.bill_number}</td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(bill.created_at).toLocaleDateString()}<br/>
                      <span className="text-xs text-gray-500">{new Date(bill.created_at).toLocaleTimeString('en-GB', { hour12: false })}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">{bill.customer_name || '-'}</td>
                    <td className="px-6 py-4 text-sm">{bill.customer_phone || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                        {bill.cash_amount > 0 && 'Cash'}
                        {bill.card_amount > 0 && 'Card'}
                        {bill.online_amount > 0 && 'Online'}
                        {bill.cash_amount > 0 && bill.card_amount > 0 && '+'}
                        {bill.cash_amount > 0 && bill.online_amount > 0 && '+'}
                        {bill.card_amount > 0 && bill.online_amount > 0 && '+'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm">₹{bill.subtotal.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-sm">₹{bill.tax_amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-bold text-sm">₹{bill.total_amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-blue-600 font-semibold text-sm">₹{bill.amount_paid.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-green-600 font-semibold text-sm">₹{bill.change_returned.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">{bill.staff_name}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => viewBill(bill.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteBill(bill.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
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
                          <p className="text-xs mt-0.5">D.L No. {storeConfig.dlNumbers?.dl20 || '123456'} | {storeConfig.dlNumbers?.dl21 || '12345678'}</p>
                          <p className="text-xs">F.L No. {storeConfig.flNumber || '12345678'}</p>
                          <p className="text-xs mt-0.5">{storeConfig.address?.line1 || 'Address Line 1'}</p>
                          <p className="text-xs">{storeConfig.address?.state || 'Tirpura'}, {storeConfig.address?.pincode || '123456'} | Phone: {storeConfig.phone || '9876543212'}</p>
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
                      <p><strong>Time:</strong> {new Date(selectedBill.created_at).toLocaleTimeString('en-GB', { hour12: false })}</p>
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
                        <p className="mt-1"><strong>GST IN:</strong> {storeConfig.gstIn || '35465768798'}</p>
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
