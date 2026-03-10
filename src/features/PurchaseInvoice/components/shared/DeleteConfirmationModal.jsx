import React from 'react'
import { AlertTriangle, X, Trash2, Package } from 'lucide-react'

const DeleteConfirmationModal = ({ invoice, onConfirm, onCancel }) => {
  if (!invoice) return null

  const isVerified = invoice.is_verified || invoice.is_admin_verified

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={`p-4 md:p-6 rounded-t-2xl ${isVerified ? 'bg-gradient-to-r from-red-600 to-orange-600' : 'bg-gradient-to-r from-gray-600 to-gray-700'}`}>
          <div className="flex items-start justify-between gap-2 md:gap-3">
            <div className="flex items-start gap-2 md:gap-3 flex-1">
              <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-white flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-lg md:text-xl font-bold text-white">
                  {isVerified ? 'Delete Verified Invoice?' : 'Delete Invoice?'}
                </h2>
                <p className="text-white/90 text-xs md:text-sm mt-1">
                  {isVerified ? 'This action will affect stock!' : 'This action cannot be undone'}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-white/80 hover:text-white transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-3 md:space-y-4">
          {/* Invoice Details */}
          <div className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-gray-600">Invoice Number:</span>
                <span className="font-semibold text-gray-900 text-right break-all ml-2">{invoice.invoice_number}</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-gray-600">Supplier:</span>
                <span className="font-semibold text-gray-900 text-right break-words ml-2">{invoice.supplier_name}</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-green-600">₹{invoice.net_amount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-gray-600">Items:</span>
                <span className="font-semibold text-gray-900">{invoice.total_items} items</span>
              </div>
            </div>
          </div>

          {/* Warning for verified invoices */}
          {isVerified && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 md:p-4 rounded-r-lg">
              <div className="flex items-start gap-2 md:gap-3">
                <Package className="w-4 h-4 md:w-5 md:h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-xs md:text-sm font-bold text-red-900 mb-2">⚠️ WARNING: Invoice is VERIFIED and synced to stock!</h3>
                  <ul className="space-y-1 text-[10px] md:text-xs text-red-800">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span>Remove {invoice.total_items} items from stock</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span>Reverse quantities in inventory</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span>Cannot be undone</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Simple warning for unverified invoices */}
          {!isVerified && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 md:p-4 rounded-r-lg">
              <p className="text-xs md:text-sm text-yellow-800">
                This invoice will be permanently deleted. You will need to reupload it again if needed.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 md:p-6 bg-gray-50 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 md:py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold text-sm md:text-base"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 md:py-3 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2 text-sm md:text-base ${
                isVerified 
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700' 
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isVerified ? 'Delete & Reverse Stock' : 'Delete Invoice'}</span>
              <span className="sm:hidden">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
