import React, { useState } from 'react'
import { Upload, FileText, Loader2, CheckCircle, XCircle } from 'lucide-react'
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
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile)
      } else {
        toast.error('Please upload a PDF file')
      }
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
      } else {
        toast.error('Please upload a PDF file')
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a PDF file')
      return
    }

    setUploading(true)
    try {
      const response = await purchaseInvoiceAPI.uploadInvoice(file)
      toast.success(`Invoice uploaded successfully! ${response.data.items.length} items extracted`)
      setFile(null)
      if (onUploadSuccess) onUploadSuccess(response.data)
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to upload invoice'
      if (error.response?.status === 409) {
        toast.error(errorMsg, { duration: 5000, icon: '⚠️' })
      } else {
        toast.error(errorMsg)
      }
    } finally {
      setUploading(false)
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
              <FileText className="w-12 h-12" />
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
            <Upload className="w-16 h-16 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-semibold text-gray-700">Drop PDF here or click to upload</p>
              <p className="text-sm text-gray-500 mt-1">AI will automatically extract all invoice data</p>
            </div>
            <label className="inline-block">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer inline-block">
                Select PDF File
              </span>
            </label>
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>✨ AI-Powered:</strong> Works with any invoice format. Automatically extracts supplier info, items, quantities, prices, GST, and more!
        </p>
      </div>
    </div>
  )
}

export default UploadInvoice
