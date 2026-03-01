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
import { adminApi } from '../../Admin&SuperAdmin/services/admin&superAminApi'

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
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Attendance System</h1>
                <p className="text-white/90 text-xs md:text-sm">WiFi-based automatic tracking</p>
              </div>
            </div>
            <select 
              value={selectedShop || ''} 
              onChange={(e) => setSelectedShop(e.target.value)} 
              className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-3 py-2 rounded-lg text-xs md:text-sm w-full sm:w-auto"
            >
              {shops.map(shop => (
                <option key={shop.shop_code} value={shop.shop_code} className="text-gray-900">
                  {shop.shop_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4 overflow-x-auto pb-2">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg p-1.5 inline-flex gap-1 min-w-full md:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
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
