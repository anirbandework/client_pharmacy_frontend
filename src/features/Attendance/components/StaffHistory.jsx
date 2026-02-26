import React from 'react'
import { Clock } from 'lucide-react'

const StaffHistory = ({ allRecords }) => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-primary-600" />
          <h3 className="text-sm font-bold text-gray-700">My Attendance History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-center">Check-in</th>
                <th className="px-3 py-2 text-center">Check-out</th>
                <th className="px-3 py-2 text-center">Hours</th>
                <th className="px-3 py-2 text-center">Breaks</th>
                <th className="px-3 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {allRecords.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">No attendance records</td>
                </tr>
              ) : (
                allRecords.map((record) => (
                  <tr key={record.id} className="border-t">
                    <td className="px-3 py-2">{record.date}</td>
                    <td className="px-3 py-2 text-center">{record.check_in_time ? new Date(record.check_in_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td className="px-3 py-2 text-center">{record.check_out_time ? new Date(record.check_out_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td className="px-3 py-2 text-center">{record.total_hours ? (record.total_hours / 60).toFixed(1) : '-'}</td>
                    <td className="px-3 py-2 text-center">
                      {record.total_break_minutes > 0 ? (
                        <span className="text-xs text-orange-600">{Math.floor(record.total_break_minutes / 60)}h {record.total_break_minutes % 60}m</span>
                      ) : '-'}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`text-xs px-2 py-1 rounded ${
                        record.is_late ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {record.is_late ? 'Late' : 'On time'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default StaffHistory
