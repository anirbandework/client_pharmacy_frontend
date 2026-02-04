import React, { useState } from 'react'
import Layout from '../../components/Layout'
import DailyRecordForm from './components/DailyRecordForm'
import ExcelUpload from './components/ExcelUpload'
import { FileText, Upload } from 'lucide-react'

const DailyRecords = () => {
  const [activeTab, setActiveTab] = useState('form')

  const handleSuccess = () => {
    console.log('Record saved successfully')
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-6 border border-primary-100 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-800">Daily Records</h1>
              <p className="text-sm text-gray-500">Track and manage your daily business records</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mb-6">
          <div className="inline-flex bg-white rounded-xl shadow-soft p-1 border border-primary-100">
            <button
              onClick={() => setActiveTab('form')}
              className={`py-2 px-5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'form' 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              Manual Entry
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-2 px-5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'upload' 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
              }`}
            >
              <Upload className="w-4 h-4" />
              Excel Upload
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="animate-scale-in">
          {activeTab === 'form' && (
            <DailyRecordForm onSuccess={handleSuccess} />
          )}
          {activeTab === 'upload' && (
            <ExcelUpload onSuccess={handleSuccess} />
          )}
        </div>
      </div>
    </Layout>
  )
}

export default DailyRecords