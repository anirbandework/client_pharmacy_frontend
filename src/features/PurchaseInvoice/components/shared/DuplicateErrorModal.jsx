import React from 'react'
import { X, AlertTriangle } from 'lucide-react'

const DuplicateErrorModal = ({ error, onClose }) => {
  if (!error) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 p-4 md:p-6 text-white rounded-t-2xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 md:gap-3 flex-1">
              <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-lg md:text-2xl font-bold">Duplicate Invoice</h2>
                <p className="text-orange-100 text-xs md:text-sm mt-1">
                  This invoice already exists in the system
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

        <div className="p-4 md:p-6">
          <div className="bg-orange-50 border-l-4 border-orange-500 p-3 md:p-4 rounded-r-lg">
            <p className="text-orange-900 text-sm md:text-base">{error}</p>
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-gray-200 p-4 md:p-6 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm md:text-base"
          >
            OK, Got It
          </button>
        </div>
      </div>
    </div>
  )
}

export default DuplicateErrorModal
