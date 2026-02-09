import React, { useState, useEffect } from 'react'
import { invoiceAPI } from '../services/invoiceApi'
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react'

const ExpiryAlerts = () => {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [daysAhead, setDaysAhead] = useState(45)

  useEffect(() => {
    fetchAlerts()
  }, [daysAhead])

  const fetchAlerts = async () => {
    setLoading(true)
    try {
      const response = await invoiceAPI.getExpiryAlerts(daysAhead)
      setAlerts(response.data)
    } catch (error) {
      console.error('Error fetching alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcknowledge = async (alertId) => {
    try {
      await invoiceAPI.acknowledgeAlert(alertId, 'admin')
      fetchAlerts()
    } catch (error) {
      alert('Error acknowledging alert')
    }
  }

  const getAlertColor = (days) => {
    if (days <= 15) return 'bg-red-100 border-red-500 text-red-700'
    if (days <= 30) return 'bg-orange-100 border-orange-500 text-orange-700'
    return 'bg-yellow-100 border-yellow-500 text-yellow-700'
  }

  const getPriorityColor = (priority) => {
    if (priority === 'critical' || priority === 'high') return 'bg-red-100 text-red-700'
    if (priority === 'medium') return 'bg-orange-100 text-orange-700'
    return 'bg-yellow-100 text-yellow-700'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl shadow-lg p-4 md:p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold">Expiry Alerts</h3>
              <p className="text-xs text-white/80">Items expiring within {daysAhead} days</p>
            </div>
          </div>
          <select value={daysAhead} onChange={(e) => setDaysAhead(Number(e.target.value))} className="px-3 py-1.5 text-xs md:text-sm bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white font-medium">
            <option value={15} className="text-gray-900">15 Days</option>
            <option value={30} className="text-gray-900">30 Days</option>
            <option value={45} className="text-gray-900">45 Days</option>
            <option value={60} className="text-gray-900">60 Days</option>
          </select>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-soft border border-primary-100 p-12 text-center">
          <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <div className="text-xl font-bold text-gray-900 mb-2">All Clear!</div>
          <div className="text-gray-500">No items expiring within {daysAhead} days</div>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className={`rounded-xl shadow-soft border-2 p-4 ${getAlertColor(alert.days_to_expiry)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Clock className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-bold text-gray-900">{alert.item_name}</div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${getPriorityColor(alert.priority)}`}>
                        {alert.priority}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">Code: {alert.item_code}</div>
                    <div className="text-xs text-gray-600 mt-1">{alert.message}</div>
                    <div className="text-[10px] text-gray-500 mt-1">{alert.alert_type} • {new Date(alert.alert_date).toLocaleDateString('en-IN')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{alert.days_to_expiry}</div>
                    <div className="text-xs font-semibold uppercase">Days Left</div>
                  </div>
                  {!alert.is_acknowledged && (
                    <button onClick={() => handleAcknowledge(alert.id)} className="px-3 py-1.5 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-xs font-semibold">
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExpiryAlerts
