import React from 'react'
import { Toaster } from 'react-hot-toast'
import Layout from '../../components/Layout'
import PasswordProtectedRoute from '../../components/PasswordProtectedRoute'
import StaffAttendance from './components/StaffAttendance'
import { Clock } from 'lucide-react'

const MyAttendance = () => {
  return (
    <Layout>
      <Toaster position="top-right" />
      <PasswordProtectedRoute moduleName="My Attendance">
        <div className="max-w-7xl mx-auto">
          <div className="hidden md:block bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 rounded-xl shadow-lg p-6 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">My Attendance</h1>
                <p className="text-white/90 text-sm">Track your attendance & leaves</p>
              </div>
            </div>
          </div>
          <StaffAttendance />
        </div>
      </PasswordProtectedRoute>
    </Layout>
  )
}

export default MyAttendance
