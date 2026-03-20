import React from 'react'
import { Toaster } from 'react-hot-toast'
import AdminAttendance from './components/AdminAttendance'
import LockedModuleGuard from '../../components/LockedModuleGuard'
import { Clock } from 'lucide-react'

const Attendance = () => {
  return (
    <>
      <Toaster position="top-right" />
      <LockedModuleGuard moduleKey="attendance_admin" moduleName="Attendance" moduleIcon={Clock}>
        <AdminAttendance />
      </LockedModuleGuard>
    </>
  )
}

export default Attendance
