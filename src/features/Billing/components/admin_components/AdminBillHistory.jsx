import React, { useState, useEffect } from 'react'
import { billingAdminAPI } from '../../services/admin_billing_apis'
import { adminApi } from '../../../Admin&SuperAdmin/services/admin&superAminApi'
import { Eye, Search, Printer, Store, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminBillHistory = () => {
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchPhone, setSearchPhone] = useState('')
  const [selectedBill, setSelectedBill] = useState(null)
  const [storeConfig, setStoreConfig] = useState(null)
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })
  const PER_PAGE = 20

  useEffect(() => {
    fetchShops()
  }, [])

  useEffect(() => {
    fetchBills()
  }, [selectedShop, page])

  const fetchShops = async () => {
    try {
      const response = await adminApi.getShops()
      setShops(response)
    } catch {
      toast.error('Failed to fetch shops')
    }
  }

  const fetchBills = async () => {
    setLoading(true)
    try {
      const params = { page, per_page: PER_PAGE }
      if (selectedShop) params.shop_id = selectedShop
      if (searchPhone) params.customer_phone = searchPhone
      const { data } = await billingAdminAPI.getBills(params)
      setBills(data.items)
      setPagination({ total: data.total, pages: data.pages })
    } catch (error) {
      toast.error('Failed to fetch bills')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    fetchBills()
  }

  const handleReset = () => {
    setSearchPhone('')
    setPage(1)
    fetchBills()
  }

  const viewBill = async (bill) => {
    try {
      const [billRes, configRes] = await Promise.all([
        billingAdminAPI.getBill(bill.id),
        billingAdminAPI.getShopBillConfig(bill.shop_id)
      ])
      setSelectedBill(billRes.data)
      setStoreConfig(configRes.data.config)
    } catch {
      toast.error('Failed to load bill details')
    }
  }

  const printBill = () => window.print()

  const shopName = (shopId) => shops.find(s => s.id === shopId)?.shop_name || `Shop ${shopId}`

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-gray-500" />
            <select
              value={selectedShop || ''}
              onChange={(e) => { setSelectedShop(e.target.value ? parseInt(e.target.value) : null); setPage(1) }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
            >
              <option value="">All Shops</option>
              {shops.map(shop => (
                <option key={shop.id} value={shop.id}>{shop.shop_name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by phone number..."
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
            <button onClick={handleSearch} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">
              Search
            </button>
            <button onClick={handleReset} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : bills.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No bills found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Bill No</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Shop</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Payment</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">Staff</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm">{bill.bill_number}</td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(bill.created_at).toLocaleDateString()}<br />
                      <span className="text-xs text-gray-500">{new Date(bill.created_at).toLocaleTimeString('en-GB', { hour12: false })}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">{shopName(bill.shop_id)}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">{bill.customer_name || '-'}</td>
                    <td className="px-4 py-3 text-sm">{bill.customer_phone || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{bill.payment_method}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-sm">₹{bill.total_amount?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">{bill.staff_name}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => viewBill(bill)} className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-gray-600">Total: {pagination.total} bills</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-700">Page {page} of {pagination.pages}</span>
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bill Details Modal */}
      {selectedBill && storeConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto print:max-w-full print:h-auto print:overflow-visible">
            <div className="p-8">
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

              <div className="border-2 border-black p-4">
                <div className="border-b-2 border-black pb-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={storeConfig.logo} alt="" className="w-20 h-20 object-contain" />
                      <div className="text-left">
                        <h2 className="text-lg font-bold uppercase">{storeConfig.storeName}</h2>
                        <p className="text-xs mt-0.5">D.L No. {storeConfig.dlNumbers?.dl20 || '123456'} | {storeConfig.dlNumbers?.dl21 || '12345678'}</p>
                        <p className="text-xs">F.L No. {storeConfig.flNumber || '12345678'}</p>
                        <p className="text-xs mt-0.5">{storeConfig.address?.line1 || 'Address Line 1'}</p>
                        <p className="text-xs">{storeConfig.address?.state || 'State'}, {storeConfig.address?.pincode || '000000'} | Phone: {storeConfig.phone || '-'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h1 className="text-2xl font-bold">TAX INVOICE</h1>
                    </div>
                  </div>
                </div>

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
                    {selectedBill.items?.map((item, index) => (
                      <tr key={index} className="border-b border-gray-300">
                        <td className="py-1">{index + 1}</td>
                        <td className="py-1">{item.item_name}</td>
                        <td className="py-1">{item.batch_number}</td>
                        <td className="py-1 text-right">{item.mrp || '-'}</td>
                        <td className="py-1 text-right">{item.quantity}</td>
                        <td className="py-1 text-right">{item.unit_price?.toFixed(2)}</td>
                        <td className="py-1 text-right">{item.sgst_amount?.toFixed(2)} ({item.sgst_percent}%)</td>
                        <td className="py-1 text-right">{item.cgst_amount?.toFixed(2)} ({item.cgst_percent}%)</td>
                        <td className="py-1 text-right">{item.discount_amount?.toFixed(2) || '0.00'}</td>
                        <td className="py-1 text-right font-semibold">{item.total_price?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="border-t-2 border-black pt-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <p><strong>GST IN:</strong> {storeConfig.gstIn || '-'}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p><strong>Subtotal:</strong> ₹{selectedBill.subtotal?.toFixed(2)}</p>
                      <p><strong>Tax:</strong> ₹{selectedBill.tax_amount?.toFixed(2)}</p>
                      <p><strong>Discount:</strong> ₹{selectedBill.discount_amount?.toFixed(2)}</p>
                      <p className="text-lg font-bold"><strong>Total:</strong> ₹{selectedBill.total_amount?.toFixed(2)}</p>
                      <p className="text-blue-600"><strong>Amount Paid:</strong> ₹{selectedBill.amount_paid?.toFixed(2)}</p>
                      {selectedBill.change_returned > 0 && (
                        <p className="text-green-600"><strong>Change:</strong> ₹{selectedBill.change_returned?.toFixed(2)}</p>
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

export default AdminBillHistory
