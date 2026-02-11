import React from 'react'
import Layout from '../../components/Layout'
import StaffAttendance from './components/StaffAttendance'
import AdminAttendance from './components/AdminAttendance'
import { Clock } from 'lucide-react'

const Attendance = () => {
  const userType = localStorage.getItem('user_type')

  // Staff view
  if (userType === 'staff') {
    return (
      <Layout>
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
      </Layout>
    )
  }

  // Admin view
  return <AdminAttendance />
}

export default Attendance
