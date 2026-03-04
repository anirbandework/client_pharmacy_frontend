import React, { useState } from 'react'
import { Upload, FileText, Loader2, CheckCircle, XCircle, FileSpreadsheet, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { purchaseInvoiceAPI } from '../services/api'
import FieldsGuideModal from './FieldsGuideModal'
import ValidationErrorModal from './ValidationErrorModal'
import DuplicateErrorModal from './DuplicateErrorModal'

const UploadInvoice = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [validationError, setValidationError] = useState(null)
  const [duplicateError, setDuplicateError] = useState(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      const isPDF = droppedFile.type === 'application/pdf'
      const isExcel = droppedFile.name.match(/\.(xlsx|xls)$/i)
      
      if (isPDF || isExcel) {
        setFile(droppedFile)
      } else {
        toast.error('Please upload a PDF or Excel file')
      }
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const isPDF = selectedFile.type === 'application/pdf'
      const isExcel = selectedFile.name.match(/\.(xlsx|xls)$/i)
      
      if (isPDF || isExcel) {
        setFile(selectedFile)
      } else {
        toast.error('Please upload a PDF or Excel file')
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file')
      return
    }

    setUploading(true)
    try {
      const response = await purchaseInvoiceAPI.uploadInvoice(file)
      const fileType = file.name.match(/\.pdf$/i) ? 'PDF' : 'Excel'
      toast.success(
        `${fileType} uploaded successfully! ${response.data.items.length} items extracted. Go to Invoice List to review and verify.`,
        { duration: 5000 }
      )
      setFile(null)
      if (onUploadSuccess) onUploadSuccess(response.data)
    } catch (error) {
      const errorDetail = error.response?.data?.detail
      
      // Check if it's a validation error with detailed feedback
      if (error.response?.status === 400 && typeof errorDetail === 'object' && errorDetail.validation) {
        setValidationError(errorDetail.validation)
        return
      }
      
      // Check if it's a duplicate error
      if (error.response?.status === 409) {
        setDuplicateError(typeof errorDetail === 'string' ? errorDetail : 'Duplicate invoice detected')
        return
      }
      
      // Handle other errors with toast
      const errorMsg = typeof errorDetail === 'string' ? errorDetail : 'Failed to upload file'
      toast.error(errorMsg)
    } finally {
      setUploading(false)
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      const response = await purchaseInvoiceAPI.downloadTemplate()
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'invoice_template.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success('Template downloaded successfully!')
    } catch (error) {
      toast.error('Failed to download template')
    }
  }

  return (
    <>
      <ValidationErrorModal 
        validation={validationError} 
        onClose={() => {
          setValidationError(null)
          setFile(null)
        }} 
      />
      
      <DuplicateErrorModal 
        error={duplicateError} 
        onClose={() => {
          setDuplicateError(null)
          setFile(null)
        }} 
      />
      
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
          <Upload className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
          Upload Purchase Invoice
        </h2>
        <FieldsGuideModal />
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-6 md:p-8 text-center transition-all ${
          dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-green-600">
              {file.name.match(/\.pdf$/i) ? (
                <FileText className="w-12 h-12" />
              ) : (
                <FileSpreadsheet className="w-12 h-12" />
              )}
              <div className="text-left">
                <p className="font-semibold">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 md:px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 text-sm md:text-base"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Upload & Extract
                  </>
                )}
              </button>
              <button
                onClick={() => setFile(null)}
                disabled={uploading}
                className="px-4 md:px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm md:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Upload className="w-16 h-16 text-gray-400" />
              <div className="text-4xl text-gray-300">or</div>
              <FileSpreadsheet className="w-16 h-16 text-green-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700">Drop PDF or Excel here</p>
              <p className="text-sm text-gray-500 mt-1">AI extracts from PDF • Excel for structured data</p>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <label className="inline-block">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="px-4 md:px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg cursor-pointer inline-flex items-center gap-2 text-sm md:text-base transition-all">
                  <FileText className="w-4 h-4" />
                  Select PDF
                </span>
              </label>
              <label className="inline-block">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="px-4 md:px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg cursor-pointer inline-flex items-center gap-2 text-sm md:text-base transition-all">
                  <FileSpreadsheet className="w-4 h-4" />
                  Select Excel
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start gap-2">
              <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs md:text-sm text-blue-800">
                <strong>AI-Powered PDF:</strong> Works with any invoice format. Automatically extracts supplier info, items, quantities, prices, GST, and more!
              </p>
            </div>
            <div className="flex items-start gap-2">
              <FileSpreadsheet className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs md:text-sm text-green-800">
                <strong>Excel Upload:</strong> Use structured Excel files with columns like Product Name, Quantity, Rate, CGST, SGST, etc.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <XCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs md:text-sm text-orange-800">
                <strong>Duplicate Detection:</strong> System checks for duplicate invoices by invoice number AND by supplier + date + amount to prevent accidental re-uploads.
              </p>
            </div>
          </div>
          <button
            onClick={handleDownloadTemplate}
            className="px-3 md:px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg flex items-center gap-2 text-xs md:text-sm whitespace-nowrap transition-all w-full md:w-auto justify-center"
          >
            <Download className="w-4 h-4" />
            Download Template
          </button>
        </div>
      </div>
    </div>
    </>
  )
}

export default UploadInvoice
