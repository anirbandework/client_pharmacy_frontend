import React, { useState, useEffect } from 'react'
import { attendanceAPI } from '../services/attendanceApi'
import { Calendar } from 'lucide-react'

const MonthlyReport = ({ shopCode }) => {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (shopCode) fetchReport()
  }, [shopCode, year, month])

  const fetchReport = async () => {
    setLoading(true)
    try {
      const res = await attendanceAPI.getMonthlyReport(year, month, shopCode)
      setReport(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div></div>

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4">
        <div className="flex items-center gap-4 mb-4">
          <Calendar className="w-5 h-5 text-primary-600" />
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="px-3 py-2 text-sm border rounded-lg">
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{new Date(2024, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="px-3 py-2 text-sm border rounded-lg">
            {Array.from({ length: 10 }, (_, i) => {
              const y = new Date().getFullYear() - 5 + i
              return <option key={y} value={y}>{y}</option>
            })}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Staff</th>
                <th className="px-3 py-2 text-center">Present</th>
                <th className="px-3 py-2 text-center">Late</th>
                <th className="px-3 py-2 text-center">Absent</th>
                <th className="px-3 py-2 text-center">%</th>
              </tr>
            </thead>
            <tbody>
              {report?.staff_summaries?.map((s) => (
                <tr key={s.staff_id} className="border-t">
                  <td className="px-3 py-2">{s.staff_name}</td>
                  <td className="px-3 py-2 text-center">{s.present_days}</td>
                  <td className="px-3 py-2 text-center">{s.late_days}</td>
                  <td className="px-3 py-2 text-center">{s.absent_days}</td>
                  <td className="px-3 py-2 text-center font-semibold">{s.attendance_percentage?.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MonthlyReport
