import React from 'react'
import { X, AlertTriangle, CheckCircle2, XCircle, FileQuestion } from 'lucide-react'

const ValidationErrorModal = ({ validation, onClose, onProceedAnyway }) => {
  if (!validation) return null

  const { missing_fields = [], format_issues = [], suggestions = [], detected_fields = {}, can_extract_anyway = false } = validation

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-4 md:p-6 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 md:gap-3 flex-1">
              <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-lg md:text-2xl font-bold">Invalid Document Format</h2>
                <p className="text-red-100 text-xs md:text-sm mt-1">
                  AI detected issues with your document. Please fix them and try again.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Missing Fields */}
          {missing_fields.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                <h3 className="text-base md:text-lg font-bold text-gray-800">Missing Required Fields</h3>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-3 md:p-4 rounded-r-lg">
                <ul className="space-y-2">
                  {missing_fields.map((field, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-red-800 text-xs md:text-sm">
                      <span className="text-red-500 font-bold flex-shrink-0">•</span>
                      <span className="font-medium">{field}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Format Issues */}
          {format_issues.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileQuestion className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                <h3 className="text-base md:text-lg font-bold text-gray-800">Format Issues</h3>
              </div>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-3 md:p-4 rounded-r-lg">
                <ul className="space-y-2">
                  {format_issues.map((issue, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-orange-800 text-xs md:text-sm">
                      <span className="text-orange-500 font-bold flex-shrink-0">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                <h3 className="text-base md:text-lg font-bold text-gray-800">How to Fix</h3>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 md:p-4 rounded-r-lg">
                <ol className="space-y-3">
                  {suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2 md:gap-3 text-blue-900 text-xs md:text-sm">
                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs md:text-sm font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5">{suggestion}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* Detected Fields Summary */}
          {detected_fields && Object.keys(detected_fields).length > 0 && (
            <div>
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3">What We Found</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                {detected_fields.invoice_number !== undefined && (
                  <div className={`p-2 md:p-3 rounded-lg border-2 ${detected_fields.invoice_number ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs md:text-sm font-medium text-gray-700">Invoice Number</span>
                      {detected_fields.invoice_number ? (
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600 flex-shrink-0" />
                      )}
                    </div>
                    {detected_fields.invoice_number && (
                      <p className="text-[10px] md:text-xs text-gray-600 mt-1 truncate">{detected_fields.invoice_number}</p>
                    )}
                  </div>
                )}
                
                {detected_fields.invoice_date !== undefined && (
                  <div className={`p-2 md:p-3 rounded-lg border-2 ${detected_fields.invoice_date ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs md:text-sm font-medium text-gray-700">Invoice Date</span>
                      {detected_fields.invoice_date ? (
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600 flex-shrink-0" />
                      )}
                    </div>
                    {detected_fields.invoice_date && (
                      <p className="text-[10px] md:text-xs text-gray-600 mt-1">{detected_fields.invoice_date}</p>
                    )}
                  </div>
                )}
                
                {detected_fields.supplier_name !== undefined && (
                  <div className={`p-2 md:p-3 rounded-lg border-2 ${detected_fields.supplier_name ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs md:text-sm font-medium text-gray-700">Supplier Name</span>
                      {detected_fields.supplier_name ? (
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                    {detected_fields.supplier_name && (
                      <p className="text-[10px] md:text-xs text-gray-600 mt-1 truncate">{detected_fields.supplier_name}</p>
                    )}
                  </div>
                )}
                
                {detected_fields.supplier_address !== undefined && detected_fields.supplier_address && (
                  <div className="p-2 md:p-3 rounded-lg border-2 bg-green-50 border-green-300">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs md:text-sm font-medium text-gray-700">Supplier Address</span>
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-600 mt-1 truncate">{detected_fields.supplier_address}</p>
                  </div>
                )}
                
                {detected_fields.supplier_gstin !== undefined && detected_fields.supplier_gstin && (
                  <div className="p-2 md:p-3 rounded-lg border-2 bg-green-50 border-green-300">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs md:text-sm font-medium text-gray-700">Supplier GSTIN</span>
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-600 mt-1 truncate">{detected_fields.supplier_gstin}</p>
                  </div>
                )}
                
                {detected_fields.supplier_dl_numbers !== undefined && detected_fields.supplier_dl_numbers && (
                  <div className="p-2 md:p-3 rounded-lg border-2 bg-green-50 border-green-300">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs md:text-sm font-medium text-gray-700">Supplier DL Numbers</span>
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-600 mt-1 truncate">{detected_fields.supplier_dl_numbers}</p>
                  </div>
                )}
                
                {detected_fields.supplier_phone !== undefined && detected_fields.supplier_phone && (
                  <div className="p-2 md:p-3 rounded-lg border-2 bg-green-50 border-green-300">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs md:text-sm font-medium text-gray-700">Supplier Phone</span>
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-600 mt-1 truncate">{detected_fields.supplier_phone}</p>
                  </div>
                )}
                
                {detected_fields.items_count !== undefined && (
                  <div className={`p-2 md:p-3 rounded-lg border-2 ${detected_fields.items_count > 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs md:text-sm font-medium text-gray-700">Items Found</span>
                      {detected_fields.items_count > 0 ? (
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-600 mt-1">{detected_fields.items_count} items</p>
                  </div>
                )}
                
                {detected_fields.has_product_names !== undefined && (
                  <div className={`p-2 md:p-3 rounded-lg border-2 ${detected_fields.has_product_names ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs md:text-sm font-medium text-gray-700">Product Names</span>
                      {detected_fields.has_product_names ? (
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                )}
                
                {detected_fields.has_batch_numbers !== undefined && (
                  <div className={`p-2 md:p-3 rounded-lg border-2 ${detected_fields.has_batch_numbers ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs md:text-sm font-medium text-gray-700">Batch Numbers</span>
                      {detected_fields.has_batch_numbers ? (
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                )}
                
                {detected_fields.has_gst_details !== undefined && (
                  <div className={`p-2 md:p-3 rounded-lg border-2 ${detected_fields.has_gst_details ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs md:text-sm font-medium text-gray-700">GST Details</span>
                      {detected_fields.has_gst_details ? (
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-gray-200 p-4 md:p-6 bg-gray-50">
          {can_extract_anyway ? (
            <div className="space-y-3">
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm text-yellow-800">
                  <strong>Basic information detected.</strong> You can proceed with extraction, but the data may need manual corrections.
                </p>
              </div>
              <div className="flex gap-2 md:gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 md:px-6 py-2 md:py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold text-sm md:text-base"
                >
                  Cancel & Reupload
                </button>
                <button
                  onClick={onProceedAnyway}
                  className="flex-1 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm md:text-base"
                >
                  Extract Anyway
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm md:text-base"
            >
              OK, I'll Fix It
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ValidationErrorModal
