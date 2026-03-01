import React, { useState } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { Upload, FileSpreadsheet, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const ContactUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase()
      if (['xlsx', 'xls', 'csv'].includes(ext)) {
        setFile(selectedFile)
        setUploadResult(null)
      } else {
        toast.error('Only Excel (.xlsx, .xls) or CSV files allowed')
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
      const { data } = await customerTrackingAPI.uploadContacts(file)
      setUploadResult(data)
      toast.success(`${data.contacts_added} contacts uploaded successfully!`)
      setFile(null)
      onUploadSuccess?.()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 md:p-6">
      <h3 className="text-base md:text-lg font-semibold mb-4">Upload Contact Sheet</h3>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-8 text-center hover:border-purple-400 transition-colors">
          <FileSpreadsheet className="w-10 h-10 md:w-12 md:h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-xs md:text-sm text-gray-600 mb-2">Upload Excel or CSV file with phone numbers</p>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-4 md:px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg cursor-pointer hover:shadow-lg transition-all text-sm md:text-base"
          >
            Choose File
          </label>
          {file && (
            <p className="mt-2 text-xs md:text-sm text-gray-700 font-medium">Selected: {file.name}</p>
          )}
        </div>

        {file && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 md:py-3 rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all text-sm md:text-base"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Contacts'}
          </button>
        )}

        {uploadResult && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-3 text-sm md:text-base">Upload Summary</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Total: {uploadResult.total_contacts}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Added: {uploadResult.contacts_added}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>WhatsApp Active: {uploadResult.whatsapp_active}</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-gray-600" />
                <span>WhatsApp Inactive: {uploadResult.whatsapp_inactive}</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-orange-600" />
                <span>Duplicates: {uploadResult.duplicates_skipped}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContactUpload
