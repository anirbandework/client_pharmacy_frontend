import React, { useState, useEffect } from 'react'
import { dailyRecordsAPI } from '../services/dailyRecords'
import { History, User, Clock, Activity, Filter } from 'lucide-react'

const AuditLogs = () => {
  const [logs, setLogs] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedUser, setSelectedUser] = useState('all')
  const [limit, setLimit] = useState(20)

  useEffect(() => {
    fetchData()
  }, [selectedUser, limit])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const filters = { limit }
      if (selectedUser !== 'all') filters.user = selectedUser
      
      const logsRes = await dailyRecordsAPI.getAuditLogs(filters)
      setLogs(logsRes.data.logs || [])
      
      try {
        const usersRes = await dailyRecordsAPI.getAuditUsers()
        setUsers(usersRes.data.users || usersRes.data || [])
      } catch (err) {
        setUsers([])
      }
    } catch (error) {
      console.error('Error fetching audit data:', error)
      setError(error.message || 'Failed to load audit logs')
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  const getActionColor = (action) => {
    const actionUpper = (action || '').toUpperCase()
    const colors = {
      CREATE: 'bg-green-100 text-green-700 border-green-300',
      CREATED: 'bg-green-100 text-green-700 border-green-300',
      UPDATE: 'bg-blue-100 text-blue-700 border-blue-300',
      UPDATED: 'bg-blue-100 text-blue-700 border-blue-300',
      DELETE: 'bg-red-100 text-red-700 border-red-300',
      DELETED: 'bg-red-100 text-red-700 border-red-300'
    }
    return colors[actionUpper] || 'bg-gray-100 text-gray-700 border-gray-300'
  }

  const getActionIcon = (action) => {
    const actionUpper = (action || '').toUpperCase()
    if (actionUpper.includes('CREATE')) return '+'
    if (actionUpper.includes('UPDATE')) return '✎'
    if (actionUpper.includes('DELETE')) return '×'
    return '•'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-soft border border-red-200 p-6 text-center">
        <div className="text-red-600 mb-2">⚠️ Error loading audit logs</div>
        <div className="text-sm text-gray-600 mb-4">{error}</div>
        <button onClick={fetchData} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-4 md:p-5 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <History className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold">Audit Logs</h3>
              <p className="text-xs text-white/80">Track changes and activities</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2 md:px-3 py-1.5 rounded-lg border border-white/30">
              <Filter className="w-3 h-3 md:w-4 md:h-4" />
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="bg-transparent text-white text-xs md:text-sm font-medium focus:outline-none cursor-pointer"
              >
                <option value="all" className="text-gray-900">All Users</option>
                {users.map((user, i) => (
                  <option key={i} value={user} className="text-gray-900">{user}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2 md:px-3 py-1.5 rounded-lg border border-white/30">
              <Activity className="w-3 h-3 md:w-4 md:h-4" />
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="bg-transparent text-white text-xs md:text-sm font-medium focus:outline-none cursor-pointer"
              >
                <option value={10} className="text-gray-900">10</option>
                <option value={20} className="text-gray-900">20</option>
                <option value={50} className="text-gray-900">50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Timeline */}
      {logs.length > 0 ? (
        <div className="space-y-3">
          {logs.map((log, index) => (
            <div key={index} className="bg-white rounded-xl shadow-soft border border-primary-100 p-4 hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-lg text-[10px] md:text-xs font-bold border ${getActionColor(log.action)} inline-flex items-center gap-1 w-fit`}>
                  <span>{getActionIcon(log.action)}</span>
                  {log.action}
                </span>
                
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <User className="w-3 h-3 text-gray-400" />
                  <span className="font-semibold">{log.user || 'System'}</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span>{new Date(log.timestamp).toLocaleString('en-IN', { 
                    dateStyle: 'short', 
                    timeStyle: 'short' 
                  })}</span>
                </div>
              </div>
              
              <div className="text-xs md:text-sm text-gray-700">
                {log.description || log.action || 'No description'}
              </div>
              
              {log.changes && log.changes.length > 0 && (
                <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-[10px] text-gray-500 uppercase font-semibold mb-1">Changes</div>
                  <div className="text-xs text-gray-600">
                    {log.changes.map((change, i) => (
                      <div key={i}>
                        {Object.entries(change).map(([key, val]) => (
                          <div key={key}>{key}: {JSON.stringify(val)}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-8 text-center">
          <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <div className="text-sm md:text-base font-semibold text-gray-600 mb-1">No audit logs found</div>
          <div className="text-xs md:text-sm text-gray-500">Activity logs will appear here</div>
        </div>
      )}
    </div>
  )
}

export default AuditLogs
