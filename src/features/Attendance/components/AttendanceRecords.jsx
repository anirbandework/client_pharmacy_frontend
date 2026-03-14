import { useState, useEffect } from 'react'
import { attendanceAPI } from '../services/attendanceApi'
import { List } from 'lucide-react'
import { adminApi } from '../../Admin&SuperAdmin/services/admin&superAminApi'

const AttendanceRecords = ({ shopCode }) => {
  const [records, setRecords] = useState([])
  const [staff, setStaff] = useState([])
  const [filters, setFilters] = useState({ staff_id: '', from_date: '', to_date: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (shopCode) loadStaff()
  }, [shopCode])

  const loadStaff = async () => {
    try {
      const data = await adminApi.getShopStaff(shopCode)
      setStaff(data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchRecords = async () => {
    setLoading(true)
    try {
      const res = await attendanceAPI.getRecords(shopCode, filters.staff_id, filters.from_date, filters.to_date)
      setRecords(res.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <List className="w-5 h-5 text-primary-600" />
          <h3 className="text-sm font-bold text-gray-700">Attendance Records</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <select value={filters.staff_id} onChange={(e) => setFilters({ ...filters, staff_id: e.target.value })} className="px-3 py-2 text-sm border rounded-lg">
            <option value="">All Staff</option>
            {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input type="date" value={filters.from_date} onChange={(e) => setFilters({ ...filters, from_date: e.target.value })} className="px-3 py-2 text-sm border rounded-lg" />
          <input type="date" value={filters.to_date} onChange={(e) => setFilters({ ...filters, to_date: e.target.value })} className="px-3 py-2 text-sm border rounded-lg" />
          <button onClick={fetchRecords} className="bg-primary-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-primary-700">
            Search
          </button>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Staff</th>
                  <th className="px-3 py-2 text-center">Check-in</th>
                  <th className="px-3 py-2 text-center">Check-out</th>
                  <th className="px-3 py-2 text-center">Hours</th>
                  <th className="px-3 py-2 text-center">Breaks</th>
                  <th className="px-3 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-3 py-2">{r.date}</td>
                    <td className="px-3 py-2">{r.staff_name || 'N/A'}</td>
                    <td className="px-3 py-2 text-center">{r.check_in_time ? new Date(r.check_in_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td className="px-3 py-2 text-center">{r.check_out_time ? new Date(r.check_out_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td className="px-3 py-2 text-center">{r.total_hours ? (r.total_hours / 60).toFixed(1) : '-'}</td>
                    <td className="px-3 py-2 text-center">
                      {r.total_break_minutes > 0 ? (
                        <span className="text-xs text-orange-600">{Math.floor(r.total_break_minutes / 60)}h {r.total_break_minutes % 60}m</span>
                      ) : '-'}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`text-xs px-2 py-1 rounded ${r.is_late ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {r.is_late ? 'Late' : 'On time'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AttendanceRecords
