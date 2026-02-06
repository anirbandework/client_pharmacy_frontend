import React, { useState } from 'react'
import { dailyRecordsAPI } from '../services/dailyRecords'
import { Upload, FileSpreadsheet, CheckCircle, XCircle } from 'lucide-react'

const ExcelUpload = ({ onSuccess }) => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setResult(null)
    try {
      const response = await dailyRecordsAPI.uploadExcel(file)
      const data = response.data
      
      if (data.success) {
        setResult({ success: true, count: data.records_imported })
        onSuccess?.()
        setTimeout(() => {
          setFile(null)
          setResult(null)
        }, 3000)
      }
    } catch (error) {
      setResult({ success: false, message: error.response?.data?.message || error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
            <FileSpreadsheet className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Excel Import</h3>
            <p className="text-sm text-white/80">Upload your Excel file to import multiple records at once</p>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-soft border border-primary-100 p-8">
        <div
          className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            dragActive
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="p-6 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl">
              <Upload className="w-12 h-12 text-green-600" />
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Drop your Excel file here</h4>
              <p className="text-sm text-gray-500 mb-4">or click to browse</p>
            </div>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {file && (
              <div className="flex items-center gap-3 bg-green-50 border-2 border-green-300 px-6 py-3 rounded-xl">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-700">{file.name}</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Result Message */}
        {result && (
          <div className={`mt-6 p-4 rounded-xl border-2 flex items-center gap-3 ${
            result.success
              ? 'bg-green-50 border-green-300 text-green-700'
              : 'bg-red-50 border-red-300 text-red-700'
          }`}>
            {result.success ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <XCircle className="w-6 h-6" />
            )}
            <div>
              <div className="font-semibold">
                {result.success ? 'Import Successful!' : 'Import Failed'}
              </div>
              <div className="text-sm">
                {result.success
                  ? `Successfully imported ${result.count} records`
                  : result.message
                }
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !file}
          className="w-full mt-6 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white text-base font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload Excel File
            </>
          )}
        </button>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="text-sm text-blue-800">
            <div className="font-semibold mb-2">📋 Supported Formats:</div>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>.xlsx (Excel 2007 and later)</li>
              <li>.xls (Excel 97-2003)</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ExcelUpload