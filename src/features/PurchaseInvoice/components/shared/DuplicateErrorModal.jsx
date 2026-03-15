import { X, AlertTriangle, FileEdit, ShieldCheck } from 'lucide-react'

const DuplicateErrorModal = ({ error, onClose, onGoToList }) => {
  if (!error) return null

  // Parse Invoice ID from backend message e.g. "... (Invoice ID: 60)."
  const idMatch = error.match(/Invoice ID:\s*(\d+)/i)
  const invoiceId = idMatch ? idMatch[1] : null

  // Detect scenario
  const isApproved = error.toLowerCase().includes('admin-approved') || error.toLowerCase().includes('admin approved')
  const isEditable = !isApproved && (error.toLowerCase().includes('edit it directly') || error.toLowerCase().includes('not been approved'))

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={`p-4 md:p-6 text-white rounded-t-2xl bg-gradient-to-r ${isApproved ? 'from-slate-600 to-slate-700' : 'from-orange-500 to-red-500'}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 md:gap-3 flex-1">
              {isApproved
                ? <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" />
                : <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" />
              }
              <div>
                <h2 className="text-lg md:text-xl font-bold">
                  {isApproved ? 'Invoice Already Approved' : 'Duplicate Invoice'}
                </h2>
                <p className="text-white/80 text-xs md:text-sm mt-1">
                  {isApproved
                    ? 'This invoice is locked and cannot be re-uploaded'
                    : 'This invoice already exists in the system'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors flex-shrink-0">
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 md:p-6 space-y-4">
          <div className={`border-l-4 p-3 md:p-4 rounded-r-lg ${isApproved ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-400' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-500'}`}>
            <p className="text-sm md:text-base text-gray-800 dark:text-slate-300">{error}</p>
          </div>

          {/* Actionable guidance */}
          {isEditable && (
            <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-xl p-3">
              <FileEdit className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-300">
                <p className="font-semibold mb-1">What to do</p>
                <p>Switch to the <strong>Invoice List</strong> tab
                  {invoiceId && <>, find Invoice ID <strong>{invoiceId}</strong>,</>} and use the edit (✏️) button to correct any details.</p>
              </div>
            </div>
          )}

          {isApproved && (
            <div className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl p-3">
              <ShieldCheck className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-800 dark:text-slate-300">
                <p className="font-semibold mb-1">What to do</p>
                <p>Contact your admin to modify or remove this invoice{invoiceId && <> (Invoice ID: <strong>{invoiceId}</strong>)</>}.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-slate-700 p-4 md:p-6 bg-gray-50 dark:bg-slate-800/60 rounded-b-2xl flex gap-3">
          {isEditable && onGoToList && (
            <button
              onClick={() => { onClose(); onGoToList() }}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition-opacity font-semibold text-sm flex items-center justify-center gap-2"
            >
              <FileEdit className="w-4 h-4" />
              Go to Invoice List
            </button>
          )}
          <button
            onClick={onClose}
            className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${isEditable && onGoToList ? 'bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300' : 'flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90'}`}
          >
            {isEditable && onGoToList ? 'Close' : 'OK, Got It'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DuplicateErrorModal
