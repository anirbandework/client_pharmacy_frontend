import React from 'react'
import { FileText, Calendar, DollarSign, Package, CheckCircle, AlertCircle, X } from 'lucide-react'

const InvoiceModal = ({ invoice, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-4 md:p-6 flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-bold text-white">Invoice Details</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
        
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Supplier & Invoice Info */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm md:text-base">
                <FileText className="w-4 h-4" />
                Supplier Information
              </h3>
              <div className="space-y-2 text-xs md:text-sm">
                <p><strong>Name:</strong> {invoice.supplier_name}</p>
                {invoice.supplier_gstin && <p><strong>GSTIN:</strong> {invoice.supplier_gstin}</p>}
                {invoice.supplier_phone && <p><strong>Phone:</strong> {invoice.supplier_phone}</p>}
                {invoice.supplier_dl_numbers && <p><strong>DL Numbers:</strong> {invoice.supplier_dl_numbers}</p>}
                {invoice.supplier_address && <p><strong>Address:</strong> {invoice.supplier_address}</p>}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm md:text-base">
                <Calendar className="w-4 h-4" />
                Invoice Information
              </h3>
              <div className="space-y-2 text-xs md:text-sm">
                <p><strong>Invoice Number:</strong> {invoice.invoice_number}</p>
                <p><strong>Invoice Date:</strong> {new Date(invoice.invoice_date).toLocaleDateString()}</p>
                {invoice.due_date && <p><strong>Due Date:</strong> {new Date(invoice.due_date).toLocaleDateString()}</p>}
                <p><strong>Uploaded By:</strong> {invoice.staff_name}</p>
                {invoice.is_admin_verified ? (
                  <div className="mt-2 pt-2 border-t">
                    <p className="flex items-center gap-1 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <strong>Admin Verified by:</strong> {invoice.admin_verified_by_name || 'Admin'}
                    </p>
                    {invoice.admin_verified_at && (
                      <p className="text-gray-600 text-xs mt-1">
                        {new Date(invoice.admin_verified_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                ) : invoice.is_staff_verified ? (
                  <div className="mt-2 pt-2 border-t">
                    <p className="flex items-center gap-1 text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <strong>Staff Verified by:</strong> {invoice.staff_verified_by_name || 'Staff'}
                    </p>
                    {invoice.staff_verified_at && (
                      <p className="text-gray-600 text-xs mt-1">
                        {new Date(invoice.staff_verified_at).toLocaleString()}
                      </p>
                    )}
                    <p className="flex items-center gap-1 text-orange-600 mt-2">
                      <AlertCircle className="w-4 h-4" />
                      <strong>Status:</strong> Awaiting Admin Approval
                    </p>
                  </div>
                ) : (
                  <div className="mt-2 pt-2 border-t">
                    <p className="flex items-center gap-1 text-orange-600">
                      <AlertCircle className="w-4 h-4" />
                      <strong>Status:</strong> Not Verified
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 p-4 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm md:text-base">
              <DollarSign className="w-4 h-4" />
              Financial Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-xs md:text-sm">
              <div>
                <p className="text-gray-600 text-[10px] md:text-xs">Gross Amount</p>
                <p className="text-base md:text-lg font-bold">₹{invoice.gross_amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-[10px] md:text-xs">Discount</p>
                <p className="text-base md:text-lg font-bold text-orange-600">₹{invoice.discount_amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-[10px] md:text-xs">Total GST</p>
                <p className="text-base md:text-lg font-bold text-blue-600">₹{invoice.total_gst.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-[10px] md:text-xs">Net Amount</p>
                <p className="text-lg md:text-xl font-bold text-green-600">₹{invoice.net_amount.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-300 grid grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
              <div>
                <p className="text-gray-600 text-[10px] md:text-xs">Taxable Amount</p>
                <p className="font-semibold">₹{invoice.taxable_amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600 text-[10px] md:text-xs">Round Off</p>
                <p className="font-semibold text-sm md:text-base">₹{invoice.round_off.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm md:text-base">
              <Package className="w-4 h-4" />
              Items ({invoice.items.length})
            </h3>
            <div className="overflow-x-auto border-2 border-slate-200 rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">#</th>
                    <th className="px-3 py-2 text-left">Composition</th>
                    <th className="px-3 py-2 text-left">Product Name</th>
                    <th className="px-3 py-2 text-left">Mfg</th>
                    <th className="px-3 py-2 text-left">HSN</th>
                    <th className="px-3 py-2 text-left">Batch</th>
                    <th className="px-3 py-2 text-right">Qty</th>
                    <th className="px-3 py-2 text-right">Free Qty</th>
                    <th className="px-3 py-2 text-left">Pkg</th>
                    <th className="px-3 py-2 text-left">Unit</th>
                    <th className="px-3 py-2 text-left">Mfg Date</th>
                    <th className="px-3 py-2 text-left">Expiry</th>
                    <th className="px-3 py-2 text-right">MRP</th>
                    <th className="px-3 py-2 text-right">Rate</th>
                    <th className="px-3 py-2 text-right">Selling Price</th>
                    <th className="px-3 py-2 text-right">Profit %</th>
                    <th className="px-3 py-2 text-right">Disc on Purch</th>
                    <th className="px-3 py-2 text-right">Disc on Sales</th>
                    <th className="px-3 py-2 text-right">Before Disc</th>
                    <th className="px-3 py-2 text-right">Disc %</th>
                    <th className="px-3 py-2 text-right">Disc Amt</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                    <th className="px-3 py-2 text-right">CGST</th>
                    <th className="px-3 py-2 text-right">SGST</th>
                    <th className="px-3 py-2 text-right">IGST</th>
                    <th className="px-3 py-2 text-right">Total</th>
                    {(() => {
                      const customCols = new Set()
                      invoice.items.forEach(item => {
                        if (item.custom_fields) {
                          Object.keys(item.custom_fields).forEach(key => customCols.add(key))
                        }
                      })
                      return Array.from(customCols).map(col => (
                        <th key={col} className="px-3 py-2 text-left bg-blue-50 text-blue-700">{col}</th>
                      ))
                    })()}
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, idx) => {
                    const customCols = new Set()
                    invoice.items.forEach(i => {
                      if (i.custom_fields) {
                        Object.keys(i.custom_fields).forEach(key => customCols.add(key))
                      }
                    })
                    return (
                      <tr key={idx} className="border-t hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-500">{idx + 1}</td>
                        <td className="px-3 py-2 text-gray-600">{item.composition || '-'}</td>
                        <td className="px-3 py-2 font-medium">{item.product_name || '-'}</td>
                        <td className="px-3 py-2 text-gray-600">{item.manufacturer || '-'}</td>
                        <td className="px-3 py-2 text-gray-600">{item.hsn_code || '-'}</td>
                        <td className="px-3 py-2 text-gray-600">{item.batch_number || '-'}</td>
                        <td className="px-3 py-2 text-right">{item.quantity || 0}</td>
                        <td className="px-3 py-2 text-right">{item.free_quantity || 0}</td>
                        <td className="px-3 py-2 text-gray-600">{item.package || '-'}</td>
                        <td className="px-3 py-2 text-gray-600">{item.unit || '-'}</td>
                        <td className="px-3 py-2 text-gray-600">{item.manufacturing_date ? (() => {
                          const date = new Date(item.manufacturing_date)
                          if (date.getDate() === 1) {
                            const month = String(date.getMonth() + 1).padStart(2, '0')
                            const year = date.getFullYear()
                            return `${month}/${year}`
                          }
                          return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                        })() : '-'}</td>
                        <td className="px-3 py-2 text-gray-600">{item.expiry_date ? (() => {
                          const date = new Date(item.expiry_date)
                          if (date.getDate() === 1) {
                            const month = String(date.getMonth() + 1).padStart(2, '0')
                            const year = date.getFullYear()
                            return `${month}/${year}`
                          }
                          return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                        })() : '-'}</td>
                        <td className="px-3 py-2 text-right font-semibold text-purple-700">{item.mrp || '-'}</td>
                        <td className="px-3 py-2 text-right">₹{(item.unit_price || 0).toFixed(2)}</td>
                        <td className="px-3 py-2 text-right">₹{(item.selling_price || 0).toFixed(2)}</td>
                        <td className="px-3 py-2 text-right">{(item.profit_margin || 0).toFixed(2)}%</td>
                        <td className="px-3 py-2 text-right">₹{(item.discount_on_purchase || 0).toFixed(2)}</td>
                        <td className="px-3 py-2 text-right">₹{(item.discount_on_sales || 0).toFixed(2)}</td>
                        <td className="px-3 py-2 text-right">₹{(item.before_discount || 0).toFixed(2)}</td>
                        <td className="px-3 py-2 text-right">{(item.discount_percent || 0).toFixed(2)}%</td>
                        <td className="px-3 py-2 text-right">₹{(item.discount_amount || 0).toFixed(2)}</td>
                        <td className="px-3 py-2 text-right">₹{(item.taxable_amount || 0).toFixed(2)}</td>
                        <td className="px-3 py-2 text-right text-blue-600">
                          {(item.cgst_percent || 0)}%<br/>
                          ₹{(item.cgst_amount || 0).toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-right text-blue-600">
                          {(item.sgst_percent || 0)}%<br/>
                          ₹{(item.sgst_amount || 0).toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-right text-orange-600">
                          {(item.igst_percent || 0)}%<br/>
                          ₹{(item.igst_amount || 0).toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-right font-bold text-green-600">₹{(item.total_amount || 0).toFixed(2)}</td>
                        {Array.from(customCols).map(col => (
                          <td key={col} className="px-3 py-2 bg-blue-50 text-blue-900 font-medium">
                            {item.custom_fields?.[col] || '-'}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot className="bg-gray-50 font-bold">
                  <tr className="border-t-2">
                    <td colSpan="21" className="px-3 py-2 text-right">Totals:</td>
                    <td className="px-3 py-2 text-right">₹{invoice.taxable_amount.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right text-blue-600">
                      ₹{invoice.items.reduce((sum, item) => sum + (item.cgst_amount || 0), 0).toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right text-blue-600">
                      ₹{invoice.items.reduce((sum, item) => sum + (item.sgst_amount || 0), 0).toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right text-orange-600">
                      ₹{invoice.items.reduce((sum, item) => sum + (item.igst_amount || 0), 0).toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-right text-green-600">₹{invoice.net_amount.toFixed(2)}</td>
                    {(() => {
                      const customCols = new Set()
                      invoice.items.forEach(item => {
                        if (item.custom_fields) {
                          Object.keys(item.custom_fields).forEach(key => customCols.add(key))
                        }
                      })
                      return Array.from(customCols).map(col => <td key={col}></td>)
                    })()}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceModal
