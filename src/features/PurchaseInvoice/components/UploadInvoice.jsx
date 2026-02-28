import React, { useState } from 'react'
import { Upload, FileText, Loader2, CheckCircle, XCircle, FileSpreadsheet, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { purchaseInvoiceAPI } from '../services/api'

const UploadInvoice = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

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
      const errorMsg = error.response?.data?.detail || 'Failed to upload file'
      if (error.response?.status === 409) {
        toast.error(errorMsg, { duration: 5000, icon: '⚠️' })
      } else {
        toast.error(errorMsg)
      }
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
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5 text-primary-600" />
        Upload Purchase Invoice
      </h2>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
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
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
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
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
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
            <div className="flex gap-3 justify-center">
              <label className="inline-block">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer inline-flex items-center gap-2">
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
                <span className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer inline-flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  Select Excel
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-blue-800">
              <strong>✨ AI-Powered PDF:</strong> Works with any invoice format. Automatically extracts supplier info, items, quantities, prices, GST, and more!
            </p>
            <p className="text-sm text-green-800 mt-2">
              <strong>📊 Excel Upload:</strong> Use structured Excel files with columns like Product Name, Quantity, Rate, CGST, SGST, etc.
            </p>
          </div>
          <button
            onClick={handleDownloadTemplate}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            Download Template
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadInvoice
