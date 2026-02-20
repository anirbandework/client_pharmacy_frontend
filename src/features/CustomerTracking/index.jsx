import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Layout from '../../components/Layout'
import ContactUpload from './components/ContactUpload'
import ContactList from './components/ContactList'
import CustomerList from './components/CustomerList'
import RefillReminders from './components/RefillReminders'
import ConversionReport from './components/ConversionReport'
import { Upload, Users, Phone, Bell, TrendingUp, UserCheck } from 'lucide-react'

const CustomerTracking = () => {
  const [activeTab, setActiveTab] = useState('contacts')
  const [refresh, setRefresh] = useState(0)

  const tabs = [
    { id: 'contacts', label: 'Contact Records', icon: Phone, color: 'from-blue-500 to-blue-600' },
    { id: 'customers', label: 'Customers', icon: Users, color: 'from-green-500 to-green-600' },
    { id: 'reminders', label: 'Refill Reminders', icon: Bell, color: 'from-orange-500 to-orange-600' },
    { id: 'upload', label: 'Upload Contacts', icon: Upload, color: 'from-purple-500 to-purple-600' },
    { id: 'reports', label: 'Reports', icon: TrendingUp, color: 'from-pink-500 to-pink-600' }
  ]

  return (
    <Layout>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="hidden md:block bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <UserCheck className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Customer Tracking</h1>
                <p className="text-white/90 text-xs md:text-sm">Manage contacts, customers & refill reminders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-3 md:mb-4 overflow-x-auto pb-2 -mx-4 px-4">
          <div className="inline-flex bg-white rounded-xl shadow-md p-1.5 border border-primary-100 gap-1 min-w-full md:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative py-2 px-3 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-1.5 md:gap-2 whitespace-nowrap ${
                  activeTab === tab.id ? 'text-white shadow-lg scale-105' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {activeTab === tab.id && <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-lg`}></div>}
                <tab.icon className={`w-4 h-4 relative z-10 ${activeTab === tab.id ? '' : 'group-hover:scale-110 transition-transform'}`} />
                <span className="relative z-10 hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="animate-fade-in space-y-4">
          {activeTab === 'upload' && <ContactUpload onUploadSuccess={() => { setActiveTab('contacts'); setRefresh(r => r + 1); }} />}
          {activeTab === 'contacts' && <ContactList key={refresh} />}
          {activeTab === 'customers' && <CustomerList />}
          {activeTab === 'reminders' && <RefillReminders />}
          {activeTab === 'reports' && <ConversionReport />}
        </div>
      </div>
    </Layout>
  )
}

export default CustomerTracking
