import React, { useState } from 'react'
import { billingAPI } from '../services/billing'
import { Search, Plus, Trash2, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

const CreateBill = ({ onBillCreated }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [billItems, setBillItems] = useState([])
  const [customerInfo, setCustomerInfo] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    doctor_name: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [paymentReference, setPaymentReference] = useState('')
  const [taxPercent, setTaxPercent] = useState(5.0)
  const [discountPercent, setDiscountPercent] = useState(0)
  const [notes, setNotes] = useState('')
  const [amountPaid, setAmountPaid] = useState('')
  const [loading, setLoading] = useState(false)

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
      item_name: medicine.item_name,
      batch_number: medicine.batch_number,
      quantity_available: medicine.quantity_available,
      unit_price: medicine.unit_price || 0,
      quantity: 1,
      mrp: medicine.mrp || medicine.unit_price || 0,
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
    return { subtotal, discountAmount, tax, total: afterDiscount + tax }
  }

  const handleSubmit = async () => {
    if (billItems.length === 0) {
      toast.error('Add at least one item')
      return
    }
    if (!amountPaid || parseFloat(amountPaid) < calculateTotal().total) {
      toast.error('Amount paid is insufficient')
      return
    }

    setLoading(true)
    try {
      const billData = {
        ...customerInfo,
        payment_method: paymentMethod,
        payment_reference: paymentReference || undefined,
        amount_paid: parseFloat(amountPaid),
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
      
      // Reset form
      setBillItems([])
      setCustomerInfo({ customer_name: '', customer_phone: '', customer_email: '', doctor_name: '' })
      setPaymentReference('')
      setTaxPercent(5.0)
      setDiscountPercent(0)
      setNotes('')
      setAmountPaid('')
      onBillCreated?.()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create bill')
    } finally {
      setLoading(false)
    }
  }

  const { subtotal, discountAmount, tax, total } = calculateTotal()

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
                    <p className="font-semibold">{medicine.item_name}</p>
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
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="cash">Cash</option>
                <option value="online">Online</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payment Reference (Optional)</label>
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="Transaction ID"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Amount Paid</label>
              <input
                type="number"
                step="0.01"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
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

          {amountPaid && parseFloat(amountPaid) >= total && (
            <div className="mt-2 text-sm text-green-600">
              Change: ₹{(parseFloat(amountPaid) - total).toFixed(2)}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Bill'}
          </button>
        </div>
      )}
    </div>
  )
}

export default CreateBill
