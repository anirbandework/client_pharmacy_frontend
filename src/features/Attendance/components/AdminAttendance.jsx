import React, { useState, useEffect } from 'react'
import Layout from '../../../components/Layout'
import Dashboard from './Dashboard'
import WiFiSetup from './WiFiSetup'
import MonthlyReport from './MonthlyReport'
import LeaveManagement from './LeaveManagement'
import Settings from './Settings'
import AttendanceRecords from './AttendanceRecords'
import ConnectedStaff from './ConnectedStaff'
import { LayoutDashboard, Wifi, BarChart3, FileText, Clock, Settings as SettingsIcon, List, Users } from 'lucide-react'
import { adminApi } from '../../Login/services/adminApi'

const AdminAttendance = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)

  useEffect(() => {
    loadShops()
  }, [])

  const loadShops = async () => {
    try {
      const data = await adminApi.getShops()
      setShops(data)
      if (data.length > 0) setSelectedShop(data[0].shop_code) // Use shop_code instead of id
    } catch (err) {
      console.error(err)
    }
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-blue-600' },
    { id: 'connected', label: 'Connected', icon: Users, color: 'from-green-500 to-green-600' },
    { id: 'records', label: 'Records', icon: List, color: 'from-indigo-500 to-indigo-600' },
    { id: 'wifi', label: 'WiFi Setup', icon: Wifi, color: 'from-purple-500 to-purple-600' },
    { id: 'report', label: 'Monthly Report', icon: BarChart3, color: 'from-orange-500 to-orange-600' },
    { id: 'leaves', label: 'Leave Requests', icon: FileText, color: 'from-pink-500 to-pink-600' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, color: 'from-gray-500 to-gray-600' }
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="hidden md:block bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 rounded-xl shadow-lg p-6 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Attendance System</h1>
                <p className="text-white/90 text-sm">WiFi-based automatic tracking</p>
              </div>
            </div>
            <select 
              value={selectedShop || ''} 
              onChange={(e) => setSelectedShop(e.target.value)} 
              className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-3 py-2 rounded-lg text-sm"
            >
              {shops.map(shop => (
                <option key={shop.shop_code} value={shop.shop_code} className="text-gray-900">
                  {shop.shop_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4 overflow-x-auto pb-2 -mx-4 px-4">
          <div className="inline-flex bg-white rounded-xl shadow-md p-1.5 border border-primary-100 gap-1 min-w-full md:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id ? 'text-white shadow-lg scale-105' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {activeTab === tab.id && <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-lg`}></div>}
                <tab.icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10 hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedShop && (
          <div className="animate-fade-in">
            {activeTab === 'dashboard' && <Dashboard shopCode={selectedShop} />}
            {activeTab === 'connected' && <ConnectedStaff shopCode={selectedShop} />}
            {activeTab === 'records' && <AttendanceRecords shopCode={selectedShop} />}
            {activeTab === 'wifi' && <WiFiSetup shopCode={selectedShop} />}
            {activeTab === 'report' && <MonthlyReport shopCode={selectedShop} />}
            {activeTab === 'leaves' && <LeaveManagement shopCode={selectedShop} />}
            {activeTab === 'settings' && <Settings shopCode={selectedShop} />}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default AdminAttendance
