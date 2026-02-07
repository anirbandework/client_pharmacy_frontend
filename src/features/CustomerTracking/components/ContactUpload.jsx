import React, { useState } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'

const ContactUpload = ({ onSuccess }) => {
  const [file, setFile] = useState(null)
  const [uploadedBy, setUploadedBy] = useState('')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile)
        setMessage(null)
      } else {
        setMessage({ type: 'error', text: 'Please upload PDF or Excel file only' })
      }
    }
  }

  const handleUpload = async () => {
    if (!file || !uploadedBy) {
      setMessage({ type: 'error', text: 'Please select a file and enter your name' })
      return
    }
    
    setUploading(true)
    try {
      const { data } = await customerTrackingAPI.uploadContacts(file, uploadedBy)
      setMessage({ 
        type: 'success', 
        text: `Uploaded successfully! Total: ${data.total_processed}, WhatsApp: ${data.whatsapp_contacts}, Non-WhatsApp: ${data.non_whatsapp_contacts}, Duplicates: ${data.duplicates_found}` 
      })
      setFile(null)
      setUploadedBy('')
      onSuccess?.()
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Upload failed' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Upload Contact Records</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Uploaded By</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={uploadedBy}
          onChange={(e) => setUploadedBy(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <input
          type="file"
          accept=".pdf,.xls,.xlsx"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <span className="text-primary-600 hover:text-primary-700 font-medium">
            Choose file
          </span>
          <span className="text-gray-600"> or drag and drop</span>
        </label>
        <p className="text-sm text-gray-500 mt-2">PDF or Excel files only</p>
      </div>

      {file && (
        <div className="mt-4 flex items-center justify-between bg-gray-50 p-4 rounded">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            <span className="text-sm">{file.name}</span>
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}

      {message && (
        <div className={`mt-4 p-4 rounded flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  )
}

export default ContactUpload
