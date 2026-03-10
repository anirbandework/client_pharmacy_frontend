import { useState, useEffect } from 'react';
import { FileText, CheckCircle, XCircle, Clock, Eye, Printer } from 'lucide-react';
import { distributorApi } from '../services/api';
import PrintInvoice from './PrintInvoice';

export default function InvoiceHistory() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [printInvoice, setPrintInvoice] = useState(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await distributorApi.getMyInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Failed to load invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (invoice) => {
    setPrintInvoice(invoice);
  };

  const getStatusBadge = (invoice) => {
    // For external shops (not using our software), show N/A
    if (!invoice.shop_id) {
      return <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">N/A</span>;
    }
    
    // For registered shops using our software
    if (invoice.is_admin_verified) {
      return <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs"><CheckCircle className="w-3 h-3" />Review Completed</span>;
    }
    if (invoice.is_staff_verified) {
      return <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"><Clock className="w-3 h-3" />Pending Admin Review</span>;
    }
    return <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs"><Clock className="w-3 h-3" />Pending Shop Review</span>;
  };

  if (loading) {
    return <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div></div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Invoice History
      </h2>

      {invoices.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No invoices created yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Invoice #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Shop</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Items</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Shop Level Review</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{invoice.invoice_number}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{new Date(invoice.invoice_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{invoice.shop?.shop_name || invoice.external_shop_name || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold">₹{invoice.net_amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{invoice.items?.length || 0} items</td>
                  <td className="px-4 py-3">{getStatusBadge(invoice)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => setSelectedInvoice(invoice)} className="text-blue-600 hover:text-blue-800" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handlePrint(invoice)} className="text-green-600 hover:text-green-800" title="Print Invoice">
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {printInvoice && (
        <PrintInvoice invoice={printInvoice} onClose={() => setPrintInvoice(null)} />
      )}

      {selectedInvoice && !printInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">Invoice Details - {selectedInvoice.invoice_number}</h3>
              <button onClick={() => setSelectedInvoice(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-gray-600">Date:</span> <span className="font-semibold">{new Date(selectedInvoice.invoice_date).toLocaleDateString()}</span></div>
                <div><span className="text-gray-600">Status:</span> {getStatusBadge(selectedInvoice)}</div>
                <div><span className="text-gray-600">Shop:</span> <span className="font-semibold">{selectedInvoice.shop?.shop_name || selectedInvoice.external_shop_name || 'N/A'}</span></div>
                <div><span className="text-gray-600">Total Items:</span> <span className="font-semibold">{selectedInvoice.items?.length || 0}</span></div>
              </div>

              {selectedInvoice.is_rejected && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-semibold">Rejection Reason:</p>
                  <p className="text-red-700">{selectedInvoice.rejection_reason}</p>
                </div>
              )}

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Product</th>
                      <th className="px-3 py-2 text-left">Manufacturer</th>
                      <th className="px-3 py-2 text-left">Batch</th>
                      <th className="px-3 py-2 text-left">HSN</th>
                      <th className="px-3 py-2 text-right">Qty</th>
                      <th className="px-3 py-2 text-left">Package</th>
                      <th className="px-3 py-2 text-left">Expiry</th>
                      <th className="px-3 py-2 text-right">MRP</th>
                      <th className="px-3 py-2 text-right">Rate</th>
                      <th className="px-3 py-2 text-right">CGST</th>
                      <th className="px-3 py-2 text-right">SGST</th>
                      <th className="px-3 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedInvoice.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2">
                          {item.product_name || 'N/A'}
                          {item.composition && <><br/><span className="text-xs text-gray-500">{item.composition}</span></>}
                        </td>
                        <td className="px-3 py-2">{item.manufacturer || '-'}</td>
                        <td className="px-3 py-2">{item.batch_number || 'N/A'}</td>
                        <td className="px-3 py-2">{item.hsn_code || '-'}</td>
                        <td className="px-3 py-2 text-right">
                          {item.quantity} {item.unit}
                          {item.free_quantity > 0 && <><br/><span className="text-green-600 text-xs">+{item.free_quantity} free</span></>}
                        </td>
                        <td className="px-3 py-2">{item.package || '-'}</td>
                        <td className="px-3 py-2">{item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : '-'}</td>
                        <td className="px-3 py-2 text-right">{item.mrp || '-'}</td>
                        <td className="px-3 py-2 text-right">₹{item.unit_price?.toFixed(2) || '0.00'}</td>
                        <td className="px-3 py-2 text-right">
                          {item.cgst_percent > 0 ? `${item.cgst_percent}%` : '-'}
                          {item.cgst_amount > 0 && <><br/><span className="text-xs">₹{item.cgst_amount.toFixed(2)}</span></>}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {item.sgst_percent > 0 ? `${item.sgst_percent}%` : '-'}
                          {item.sgst_amount > 0 && <><br/><span className="text-xs">₹{item.sgst_amount.toFixed(2)}</span></>}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold">₹{item.total_amount?.toFixed(2) || '0.00'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between"><span>Gross Amount:</span><span>₹{selectedInvoice.gross_amount.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Discount:</span><span>₹{selectedInvoice.discount_amount.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Taxable:</span><span>₹{selectedInvoice.taxable_amount.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Total GST:</span><span>₹{selectedInvoice.total_gst.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Net Amount:</span><span>₹{selectedInvoice.net_amount.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
