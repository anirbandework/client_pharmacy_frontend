import React, { useState, useEffect } from 'react'
import { dailyRecordsAPI } from '../services/dailyRecords'
import { History, User, Clock, Activity, Filter } from 'lucide-react'

const AuditLogs = () => {
  const [logs, setLogs] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState('all')
  const [limit, setLimit] = useState(20)

  useEffect(() => {
    fetchData()
  }, [selectedUser, limit])

  const fetchData = async () => {
    setLoading(true)
    try {
      const filters = { limit }
      if (selectedUser !== 'all') filters.user = selectedUser
      
      const [logsRes, usersRes] = await Promise.all([
        dailyRecordsAPI.getAuditLogs(filters),
        dailyRecordsAPI.getAuditUsers()
      ])
      setLogs(logsRes.data.logs || logsRes.data)
      setUsers(usersRes.data)
    } catch (error) {
      console.error('Error fetching audit data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActionColor = (action) => {
    const colors = {
      CREATE: 'bg-green-100 text-green-700 border-green-300',
      UPDATE: 'bg-blue-100 text-blue-700 border-blue-300',
      DELETE: 'bg-red-100 text-red-700 border-red-300'
    }
    return colors[action] || 'bg-gray-100 text-gray-700 border-gray-300'
  }

  const getActionIcon = (action) => {
    return action === 'CREATE' ? '+' : action === 'UPDATE' ? '✎' : '×'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <History className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Audit Logs</h3>
              <p className="text-sm text-white/80">Track all changes and activities across the system</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
              <Filter className="w-4 h-4" />
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer"
              >
                <option value="all" className="text-gray-900">All Users</option>
                {users.map((user, i) => (
                  <option key={i} value={user} className="text-gray-900">{user}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
              <Activity className="w-4 h-4" />
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer"
              >
                <option value={10} className="text-gray-900">10 logs</option>
                <option value={20} className="text-gray-900">20 logs</option>
                <option value={50} className="text-gray-900">50 logs</option>
                <option value={100} className="text-gray-900">100 logs</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Timeline */}
      {logs.length > 0 ? (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 via-purple-200 to-transparent"></div>
          
          <div className="space-y-4">
            {logs.map((log, index) => (
              <div key={index} className="relative pl-20">
                {/* Timeline Dot */}
                <div className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white shadow-lg ${getActionColor(log.action).split(' ')[0]}`}></div>
                
                {/* Log Card */}
                <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-5 hover:shadow-lg transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${getActionColor(log.action)} flex items-center gap-1.5`}>
                          <span className="text-base">{getActionIcon(log.action)}</span>
                          {log.action}
                        </span>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold">{log.user || 'System'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{new Date(log.timestamp).toLocaleString('en-IN', { 
                            dateStyle: 'medium', 
                            timeStyle: 'short' 
                          })}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {log.description || log.action || 'No description available'}
                      </div>
                      
                      {log.changes && log.changes.length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Changes</div>
                          <div className="text-xs text-gray-600">
                            {log.changes.map((change, i) => (
                              <div key={i} className="mb-1">
                                {Object.entries(change).map(([key, val]) => (
                                  <div key={key}>{key}: {JSON.stringify(val)}</div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-soft border border-primary-100 p-12 text-center">
          <History className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <div className="text-lg font-semibold text-gray-600 mb-2">No audit logs found</div>
          <div className="text-sm text-gray-500">Activity logs will appear here as actions are performed</div>
        </div>
      )}
    </div>
  )
}

export default AuditLogs
