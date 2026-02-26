import React from 'react'
import { Toaster } from 'react-hot-toast'
import AdminAttendance from './components/AdminAttendance'

const Attendance = () => {
  return (
    <>
      <Toaster position="top-right" />
      <AdminAttendance />
    </>
  )
}

export default Attendance
