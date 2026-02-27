import React, { useState, useEffect } from 'react'
import { billingAPI } from '../services/billing'
import { Search, Plus, Trash2, Save, X, Printer } from 'lucide-react'
import toast from 'react-hot-toast'

const CreateBill = ({ onBillCreated }) => {
  const [storeConfig, setStoreConfig] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [billItems, setBillItems] = useState([])
  const [customerInfo, setCustomerInfo] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    doctor_name: ''
  })
  const [paymentAmounts, setPaymentAmounts] = useState({
    cash: '',
    card: '',
    online: ''
  })
  const [paymentReference, setPaymentReference] = useState('')
  const [taxPercent, setTaxPercent] = useState(5.0)
  const [discountPercent, setDiscountPercent] = useState(0)
  const [notes, setNotes] = useState('')
  const [amountPaid, setAmountPaid] = useState('')
  const [loading, setLoading] = useState(false)
  const [createdBill, setCreatedBill] = useState(null)
  
  // Customer tracking fields
  const [customerCategory, setCustomerCategory] = useState('first_time_prescription')
  const [wasContactedBefore, setWasContactedBefore] = useState(false)

  useEffect(() => {
    fetchShopConfig()
  }, [])

  const fetchShopConfig = async () => {
    try {
      const { data } = await billingAPI.getShopConfig()
      setStoreConfig(data.config)
    } catch (error) {
      console.error('Failed to load shop config:', error)
    }
  }

  const searchMedicines = async (term) => {
    if (term.length < 2) {
      setSearchResults([])
      return
    }
    try {
      const { data } = await billingAPI.searchMedicines(term)
      setSearchResults(data)
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  const addItemToBill = (medicine) => {
    const existing = billItems.find(item => item.stock_item_id === medicine.id)
    if (existing) {
      toast.error('Item already added')
      return
    }
    setBillItems([...billItems, {
      stock_item_id: medicine.id,
      item_name: medicine.product_name,
      batch_number: medicine.batch_number,
      quantity_available: medicine.quantity_available,
      unit_price: medicine.unit_price || 0,
      quantity: 1,
      mrp: medicine.mrp || '',
      rack_number: medicine.rack_number,
      section_name: medicine.section_name
    }])
    setSearchTerm('')
    setSearchResults([])
  }

  const updateItem = (index, field, value) => {
    const updated = [...billItems]
    updated[index][field] = parseFloat(value) || 0
    setBillItems(updated)
  }

  const removeItem = (index) => {
    setBillItems(billItems.filter((_, i) => i !== index))
  }

  const calculateTotal = () => {
    const subtotal = billItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
    const discountAmount = subtotal * (discountPercent / 100)
    const afterDiscount = subtotal - discountAmount
    const tax = afterDiscount * (taxPercent / 100)
    const total = afterDiscount + tax
    const totalPaid = (parseFloat(paymentAmounts.cash) || 0) + (parseFloat(paymentAmounts.card) || 0) + (parseFloat(paymentAmounts.online) || 0)
    return { subtotal, discountAmount, tax, total, totalPaid }
  }

  const handleSubmit = async () => {
    if (billItems.length === 0) {
      toast.error('Add at least one item')
      return
    }
    
    const { total, totalPaid } = calculateTotal()
    
    if (totalPaid < total) {
      toast.error(`Insufficient payment. Total: ₹${total.toFixed(2)}, Paid: ₹${totalPaid.toFixed(2)}`)
      return
    }

    setLoading(true)
    try {
      const billData = {
        ...customerInfo,
        customer_category: customerCategory,
        was_contacted_before: wasContactedBefore,
        cash_amount: parseFloat(paymentAmounts.cash) || 0,
        card_amount: parseFloat(paymentAmounts.card) || 0,
        online_amount: parseFloat(paymentAmounts.online) || 0,
        payment_reference: paymentReference || undefined,
        discount_percent: discountPercent,
        notes: notes || undefined,
        items: billItems.map(item => ({
          stock_item_id: item.stock_item_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          mrp: item.mrp,
          tax_percent: taxPercent
        }))
      }
      
      const { data } = await billingAPI.createBill(billData)
      toast.success(`Bill created: ${data.bill_number}`)
      
      setCreatedBill(data)
      
      // Reset form
      setBillItems([])
      setCustomerInfo({ customer_name: '', customer_phone: '', customer_email: '', doctor_name: '' })
      setPaymentAmounts({ cash: '', card: '', online: '' })
      setPaymentReference('')
      setTaxPercent(5.0)
      setDiscountPercent(0)
      setNotes('')
      onBillCreated?.()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create bill')
    } finally {
      setLoading(false)
    }
  }

  const { subtotal, discountAmount, tax, total, totalPaid } = calculateTotal()

  const printBill = () => {
    window.print()
  }

  return (
    <div className="space-y-4">
      {/* Customer Info */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Customer Name (Optional)"
            value={customerInfo.customer_name}
            onChange={(e) => setCustomerInfo({...customerInfo, customer_name: e.target.value})}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="text"
            placeholder="Phone Number (Optional)"
            value={customerInfo.customer_phone}
            onChange={(e) => setCustomerInfo({...customerInfo, customer_phone: e.target.value})}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="email"
            placeholder="Email (Optional)"
            value={customerInfo.customer_email}
            onChange={(e) => setCustomerInfo({...customerInfo, customer_email: e.target.value})}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="text"
            placeholder="Doctor Name (Optional)"
            value={customerInfo.doctor_name}
            onChange={(e) => setCustomerInfo({...customerInfo, doctor_name: e.target.value})}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        {/* Customer Tracking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-2">Customer Category</label>
            <select
              value={customerCategory}
              onChange={(e) => setCustomerCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="first_time_prescription">First Time with Prescription</option>
              <option value="regular_branded">Regular (Branded Medicines)</option>
              <option value="generic_informed">Generic Informed</option>
              <option value="contact_sheet">From Contact Sheet</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={wasContactedBefore}
                onChange={(e) => setWasContactedBefore(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="ml-2 text-sm font-medium">Was contacted by store before?</span>
            </label>
          </div>
        </div>
      </div>

      {/* Medicine Search */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Search Medicine</h3>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, generic name, brand, or batch..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              searchMedicines(e.target.value)
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        {searchResults.length > 0 && (
          <div className="mt-2 max-h-60 overflow-y-auto border rounded-lg">
            {searchResults.map((medicine) => (
              <div
                key={medicine.id}
                onClick={() => addItemToBill(medicine)}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{medicine.product_name}</p>
                    <p className="text-sm text-gray-600">
                      Batch: {medicine.batch_number} | Stock: {medicine.quantity_available} | 
                      Location: {medicine.rack_number} - {medicine.section_name}
                    </p>
                  </div>
                  <p className="font-semibold text-primary-600">₹{medicine.unit_price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bill Items */}
      {billItems.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Bill Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Item</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Batch</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Available</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Qty</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Price</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Total</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {billItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{item.item_name}</td>
                    <td className="px-4 py-2 text-sm">{item.batch_number}</td>
                    <td className="px-4 py-2 text-sm">{item.quantity_available}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="1"
                        max={item.quantity_available}
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        className="w-20 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                        className="w-24 px-2 py-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2 font-semibold">₹{(item.quantity * item.unit_price).toFixed(2)}</td>
                    <td className="px-4 py-2">
                      <button onClick={() => removeItem(index)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-4 border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span>Discount:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 border rounded text-xs"
                />
                <span>%</span>
              </div>
              <span>₹{discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span>Tax:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 border rounded text-xs"
                />
                <span>%</span>
              </div>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="mt-4 space-y-4">
            <h4 className="font-semibold">Payment Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Cash Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentAmounts.cash}
                  onChange={(e) => setPaymentAmounts({...paymentAmounts, cash: e.target.value})}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Card Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentAmounts.card}
                  onChange={(e) => setPaymentAmounts({...paymentAmounts, card: e.target.value})}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Online Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentAmounts.online}
                  onChange={(e) => setPaymentAmounts({...paymentAmounts, online: e.target.value})}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payment Reference (Optional)</label>
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="Transaction ID / Card Reference"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Total Paid:</span>
                <span className="font-semibold">₹{totalPaid.toFixed(2)}</span>
              </div>
              {totalPaid >= total && totalPaid > 0 && (
                <div className="flex justify-between text-sm text-green-600 mt-1">
                  <span>Change:</span>
                  <span className="font-semibold">₹{(totalPaid - total).toFixed(2)}</span>
                </div>
              )}
              {totalPaid < total && totalPaid > 0 && (
                <div className="flex justify-between text-sm text-red-600 mt-1">
                  <span>Remaining:</span>
                  <span className="font-semibold">₹{(total - totalPaid).toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes..."
              rows="2"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Bill'}
          </button>
        </div>
      )}

      {/* Bill Preview Modal */}
      {createdBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto print:max-w-full print:h-auto print:overflow-visible">
            {!storeConfig ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">Loading configuration...</p>
              </div>
            ) : (
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
                  onClick={() => setCreatedBill(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>

              {/* Tax Invoice */}
              <div className="border-2 border-black p-4">
                <div className="border-b-2 border-black pb-3 mb-3">
                  <div className="flex items-center justify-between">
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
                    <div className="text-right">
                      <h1 className="text-2xl font-bold">TAX INVOICE</h1>
                    </div>
                  </div>
                </div>

                {/* Customer & Bill Info */}
                <div className="grid grid-cols-2 gap-4 text-xs mb-3 border-b border-black pb-2">
                  <div>
                    <p><strong>Patient Name:</strong> {createdBill.customer_name || 'N/A'}</p>
                    <p><strong>Mobile:</strong> {createdBill.customer_phone || 'N/A'}</p>
                    <p><strong>Doctor Name:</strong> {createdBill.doctor_name || 'SELF'}</p>
                  </div>
                  <div className="text-right">
                    <p><strong>Bill No.:</strong> {createdBill.bill_number}</p>
                    <p><strong>Date:</strong> {new Date(createdBill.created_at).toLocaleDateString('en-GB')}</p>
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
                    {createdBill.items.map((item, index) => (
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
                      <p><strong>Total MRP Amount:</strong> ₹{createdBill.items.reduce((sum, item) => {
                        const mrpValue = item.mrp ? parseFloat(item.mrp.toString().match(/[\d.]+/)?.[0] || item.unit_price) : item.unit_price;
                        return sum + mrpValue * item.quantity;
                      }, 0).toFixed(2)}</p>
                      <p className="mt-1"><strong>GST IN:</strong> {storeConfig.gstIn}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p><strong>Subtotal:</strong> ₹{createdBill.subtotal.toFixed(2)}</p>
                      <p><strong>Tax:</strong> ₹{createdBill.tax_amount.toFixed(2)}</p>
                      <p><strong>Discount:</strong> ₹{createdBill.discount_amount.toFixed(2)}</p>
                      <p className="text-lg font-bold"><strong>Total:</strong> ₹{createdBill.total_amount.toFixed(2)}</p>
                      <p className="text-blue-600"><strong>Amount Paid:</strong> ₹{createdBill.amount_paid.toFixed(2)}</p>
                      {createdBill.change_returned > 0 && (
                        <p className="text-green-600"><strong>Change:</strong> ₹{createdBill.change_returned.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateBill
