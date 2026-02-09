import React, { useState } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { Search, Plus, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react'

const MedicalConditions = () => {
  const [phone, setPhone] = useState('')
  const [customer, setCustomer] = useState(null)
  const [conditions, setConditions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    condition_name: '',
    condition_type: 'chronic',
    diagnosed_date: new Date().toISOString().split('T')[0],
    severity: 'moderate',
    requires_monitoring: true,
    monitoring_frequency: 'monthly',
    primary_medicine: '',
    notes: ''
  })

  const searchCustomer = async () => {
    if (!phone) return
    setLoading(true)
    try {
      const res = await customerTrackingAPI.getCustomerByPhone(phone)
      setCustomer(res.data)
      const condRes = await customerTrackingAPI.getMedicalConditions(res.data.customer_id)
      setConditions(condRes.data || [])
    } catch (err) {
      alert(err.response?.data?.detail || 'Customer not found')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await customerTrackingAPI.addMedicalCondition(customer.customer_id, formData)
      alert('Medical condition added successfully')
      setShowForm(false)
      searchCustomer()
      setFormData({
        condition_name: '',
        condition_type: 'chronic',
        diagnosed_date: new Date().toISOString().split('T')[0],
        severity: 'moderate',
        requires_monitoring: true,
        monitoring_frequency: 'monthly',
        primary_medicine: '',
        notes: ''
      })
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add condition')
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity) => {
    const colors = {
      mild: 'bg-green-100 text-green-700',
      moderate: 'bg-yellow-100 text-yellow-700',
      severe: 'bg-red-100 text-red-700'
    }
    return colors[severity] || colors.moderate
  }

  const getTypeColor = (type) => {
    const colors = {
      chronic: 'bg-red-100 text-red-700',
      acute: 'bg-orange-100 text-orange-700',
      preventive: 'bg-blue-100 text-blue-700'
    }
    return colors[type] || colors.chronic
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-primary-100">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchCustomer()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button onClick={searchCustomer} disabled={loading} className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50">
            Search
          </button>
        </div>
      </div>

      {customer && (
        <>
          {/* Customer Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{customer.name}</h3>
                <p className="text-sm text-gray-600">{customer.phone} • Age: {customer.age || 'N/A'}</p>
              </div>
              <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Condition
              </button>
            </div>
          </div>

          {/* Add Form */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-primary-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">New Medical Condition</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition Name</label>
                    <input type="text" value={formData.condition_name} onChange={(e) => setFormData({...formData, condition_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={formData.condition_type} onChange={(e) => setFormData({...formData, condition_type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                      <option value="chronic">Chronic</option>
                      <option value="acute">Acute</option>
                      <option value="preventive">Preventive Care</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosed Date</label>
                    <input type="date" value={formData.diagnosed_date} onChange={(e) => setFormData({...formData, diagnosed_date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                    <select value={formData.severity} onChange={(e) => setFormData({...formData, severity: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                      <option value="mild">Mild</option>
                      <option value="moderate">Moderate</option>
                      <option value="severe">Severe</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monitoring Frequency</label>
                    <select value={formData.monitoring_frequency} onChange={(e) => setFormData({...formData, monitoring_frequency: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Medicine</label>
                    <input type="text" value={formData.primary_medicine} onChange={(e) => setFormData({...formData, primary_medicine: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.requires_monitoring} onChange={(e) => setFormData({...formData, requires_monitoring: e.target.checked})} className="w-4 h-4 text-primary-600 rounded" />
                  <label className="text-sm font-medium text-gray-700">Requires Monitoring</label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"></textarea>
                </div>
                <button type="submit" disabled={loading} className="w-full py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Condition'}
                </button>
              </form>
            </div>
          )}

          {/* Conditions List */}
          <div className="grid gap-3">
            {conditions.map((cond) => (
              <div key={cond.condition_id} className="bg-white rounded-xl shadow-md p-4 border border-primary-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <div>
                      <h4 className="font-semibold text-gray-800">{cond.condition_name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getTypeColor(cond.condition_type)}`}>
                          {cond.condition_type}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getSeverityColor(cond.severity)}`}>
                          {cond.severity}
                        </span>
                      </div>
                    </div>
                  </div>
                  {cond.requires_monitoring && (
                    <div className="flex items-center gap-1 text-sm text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{cond.monitoring_frequency}</span>
                    </div>
                  )}
                </div>
                {cond.primary_medicine && (
                  <div className="bg-blue-50 p-2 rounded-lg text-sm">
                    <span className="font-medium text-blue-900">Primary Medicine:</span>
                    <span className="text-blue-700 ml-2">{cond.primary_medicine}</span>
                  </div>
                )}
                {cond.notes && (
                  <p className="text-sm text-gray-600 mt-2">{cond.notes}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">Diagnosed: {new Date(cond.diagnosed_date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default MedicalConditions
