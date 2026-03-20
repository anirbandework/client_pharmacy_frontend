import React from 'react'
import { Toaster } from 'react-hot-toast'
import Layout from '../../components/Layout'
import LockedModuleGuard from '../../components/LockedModuleGuard'
import PasswordProtectedRoute from '../../components/PasswordProtectedRoute'
import StaffAttendance from './components/StaffAttendance'
import { Clock } from 'lucide-react'

const MyAttendance = () => {
  return (
    <Layout>
      <Toaster position="top-right" />
      <PasswordProtectedRoute moduleName="My Attendance">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">My Attendance</h1>
                <p className="text-white/90 text-xs md:text-sm">Track your attendance & leaves</p>
              </div>
            </div>
          </div>
          <LockedModuleGuard moduleKey="attendance_staff" moduleName="My Attendance" moduleIcon={Clock}>
            <StaffAttendance />
          </LockedModuleGuard>
        </div>
      </PasswordProtectedRoute>
    </Layout>
  )
}

export default MyAttendance
