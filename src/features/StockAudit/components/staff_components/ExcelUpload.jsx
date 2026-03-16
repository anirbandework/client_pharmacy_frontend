import { useState } from 'react'
import { staffStockAuditAPI } from '../../services/staff_stock_audit_apis'
import { Upload, Download, CheckCircle, AlertCircle, FileSpreadsheet, Info, Lightbulb, Shuffle } from 'lucide-react'
import toast from 'react-hot-toast'

const ExcelUpload = () => {
  const [uploadingExcel, setUploadingExcel] = useState(false)
  const [downloadingTemplate, setDownloadingTemplate] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [uploadNotes, setUploadNotes] = useState('')

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    setUploadingExcel(true)
    setUploadResult(null)
    const formData = new FormData()
    formData.append('file', file)
    if (uploadNotes.trim()) {
      formData.append('notes', uploadNotes.trim())
    }
    
    try {
      const response = await staffStockAuditAPI.uploadExcel(formData)
      setUploadResult({ success: true, data: response.data })
      toast.success('Excel uploaded for verification!')
      setUploadNotes('')
    } catch (error) {
      setUploadResult({ success: false, error: error.response?.data?.detail || 'Failed to upload Excel file' })
      toast.error('Upload failed')
    } finally {
      setUploadingExcel(false)
      e.target.value = ''
    }
  }

  const handleExport = async () => {
    setDownloadingTemplate(true)
    try {
      const response = await staffStockAuditAPI.exportStockItems()
      const url = window.URL.createObjectURL(response.data)
      const a = document.createElement('a')
      a.href = url
      a.download = `stock_template_${Date.now()}.xlsx`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Template downloaded')
    } catch (error) {
      toast.error('Failed to download template')
    } finally {
      setDownloadingTemplate(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800/80 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
          <FileSpreadsheet className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Excel Upload</h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-slate-400">Import stock items from Excel files</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800/40">
            <h3 className="text-base md:text-lg font-bold text-blue-900 dark:text-blue-300 mb-4">Upload Stock Data</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Upload Notes (Optional)</label>
                <textarea
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="Add any notes about this upload..."
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                  rows={2}
                />
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={handleExport}
                  disabled={downloadingTemplate}
                  className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-700 border-2 border-blue-300 dark:border-slate-600 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloadingTemplate ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  {downloadingTemplate ? 'Downloading...' : 'Download Template'}
                </button>
                
                <label className={`flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-medium ${uploadingExcel ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                  {uploadingExcel ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                  {uploadingExcel ? 'Uploading...' : 'Select Excel File'}
                  <input 
                    type="file" 
                    accept=".xlsx,.xls" 
                    onChange={handleExcelUpload} 
                    className="hidden" 
                    disabled={uploadingExcel} 
                  />
                </label>
              </div>
              
              {uploadingExcel && (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Processing your file...</span>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/40">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
              <Shuffle className="w-4 h-4" />
              Verification Workflow
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <li><strong>Upload:</strong> Your Excel file is uploaded and staged for review</li>
              <li><strong>Staff Verification:</strong> Staff reviews and can modify items if needed</li>
              <li><strong>Admin Approval:</strong> Admin gives final approval before adding to inventory</li>
              <li><strong>System Update:</strong> Items are added to inventory only after full approval</li>
            </ol>
            <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-700 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-400">
                Check the "Upload Verification" tab to track your upload status
              </p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {uploadResult && (
            <div className={`p-6 rounded-xl border-2 ${
              uploadResult.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-3">
                {uploadResult.success ? (
                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
                )}
                
                <div className="flex-1">
                  <h4 className={`font-semibold mb-2 ${
                    uploadResult.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {uploadResult.success ? 'Upload Successful!' : 'Upload Failed'}
                  </h4>
                  
                  {uploadResult.success ? (
                    <div className="space-y-2">
                      <p className="text-green-800 dark:text-green-300">{uploadResult.data.message}</p>
                      <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>{uploadResult.data.success_count} items staged for verification</span>
                        </div>
                        {uploadResult.data.error_count > 0 && (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>{uploadResult.data.error_count} items failed</span>
                          </div>
                        )}
                        <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 rounded">
                          <div className="text-xs text-green-700 dark:text-green-300 flex items-center gap-2">
                            <Shuffle className="w-3 h-3" />
                            <span>Status: {uploadResult.data.status === 'pending_staff_verification' ? 'Pending Staff Verification' : uploadResult.data.status}</span>
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                            Upload ID: #{uploadResult.data.upload_id}
                          </div>
                        </div>
                      </div>
                      
                      {uploadResult.data.errors && uploadResult.data.errors.length > 0 && (
                        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/40 rounded">
                          <div className="font-medium text-yellow-800 dark:text-yellow-300 mb-1 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>Errors:</span>
                          </div>
                          <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                            {uploadResult.data.errors.map((err, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="text-yellow-600 dark:text-yellow-400">•</span>
                                <span>{err}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-red-800 dark:text-red-400">{uploadResult.error}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="p-6 bg-amber-50 dark:bg-yellow-900/20 rounded-xl border border-amber-200 dark:border-yellow-800/40">
            <h4 className="font-semibold text-amber-900 dark:text-yellow-300 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Tips for Best Results
            </h4>
            <ul className="space-y-2 text-sm text-amber-800 dark:text-yellow-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Ensure Product Name and Batch Number are filled for each row</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Use the exact date format: YYYY-MM-DD</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Keep numeric fields (prices, quantities) as numbers only</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Remove any empty rows at the end of your data</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Maximum file size: 10MB</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExcelUpload