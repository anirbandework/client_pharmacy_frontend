import React, { useState } from 'react'
import { dailyRecordsAPI } from '../services/dailyRecords'
import { Upload, FileSpreadsheet } from 'lucide-react'

const ExcelUpload = ({ onSuccess }) => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    try {
      const response = await dailyRecordsAPI.uploadExcel(file)
      const result = response.data
      
      if (result.success) {
        alert(`Successfully imported ${result.records_imported} records`)
        onSuccess?.()
        setFile(null)
      }
    } catch (error) {
      alert('Upload error: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-soft border border-primary-100">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg">
          <FileSpreadsheet className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-800">Excel Upload</h3>
          <p className="text-xs text-gray-500">Import multiple records at once</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-accent-400 transition-colors">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <label className="block text-xs font-medium text-gray-600 mb-2">Select Excel File (.xlsx, .xls)</label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-accent-50 file:text-accent-700 hover:file:bg-accent-100 file:cursor-pointer cursor-pointer"
          />
          {file && (
            <p className="mt-3 text-xs text-accent-600 font-medium bg-accent-50 py-2 px-3 rounded-lg inline-block">
              ✓ {file.name}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !file}
          className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white text-sm font-semibold py-2.5 px-6 rounded-lg shadow-glow hover:shadow-glow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95"
        >
          {loading ? 'Uploading...' : 'Upload Excel File'}
        </button>
      </div>
    </form>
  )
}

export default ExcelUpload