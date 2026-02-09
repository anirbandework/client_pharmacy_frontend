import React, { useState } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { Search, Phone, User, Heart, Pill, Calendar, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

const CallScripts = () => {
  const [phone, setPhone] = useState('')
  const [customer, setCustomer] = useState(null)
  const [callDetails, setCallDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [priorityScripts, setPriorityScripts] = useState([])
  const [selectedPriority, setSelectedPriority] = useState('high')

  const searchCustomer = async () => {
    if (!phone) return
    setLoading(true)
    try {
      const res = await customerTrackingAPI.getCustomerByPhone(phone)
      setCustomer(res.data)
      const detailsRes = await customerTrackingAPI.getCallDetails(res.data.customer_id)
      setCallDetails(detailsRes.data)
    } catch (err) {
      alert(err.response?.data?.detail || 'Customer not found')
    } finally {
      setLoading(false)
    }
  }

  const generateScript = async () => {
    setLoading(true)
    try {
      await customerTrackingAPI.generateCallScript(customer.customer_id, 'general')
      alert('Call script generated successfully')
      searchCustomer()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to generate script')
    } finally {
      setLoading(false)
    }
  }

  const loadPriorityScripts = async (priority) => {
    setLoading(true)
    try {
      const res = await customerTrackingAPI.getPriorityCallScripts(priority)
      setPriorityScripts(res.data || [])
      setSelectedPriority(priority)
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to load scripts')
    } finally {
      setLoading(false)
    }
  }

  const updateOutcome = async (scriptId, outcome, notes) => {
    if (!scriptId) {
      alert('Invalid script ID')
      return
    }
    try {
      const callSuccessful = outcome === 'successful'
      await customerTrackingAPI.updateCallOutcome(scriptId, callSuccessful, notes)
      alert('Call outcome updated')
      loadPriorityScripts(selectedPriority)
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update outcome')
    }
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-green-100 text-green-700 border-green-300'
    }
    return colors[priority] || colors.medium
  }

  return (
    <div className="space-y-4">
      {/* Search & Priority Tabs */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-primary-100">
        <div className="flex gap-2 mb-4">
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

        <div className="flex gap-2">
          {['high', 'medium', 'low'].map(priority => (
            <button
              key={priority}
              onClick={() => loadPriorityScripts(priority)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedPriority === priority
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {priority.toUpperCase()} Priority
            </button>
          ))}
        </div>
      </div>

      {/* Customer Call Details */}
      {callDetails && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-primary-100 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600" />
                {callDetails.customer_name} (Age: {callDetails.age || 'N/A'}, {callDetails.gender || 'N/A'})
              </h3>
              <p className="text-sm text-gray-600">{callDetails.phone}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(callDetails.priority)}`}>
                {callDetails.priority?.toUpperCase()} PRIORITY
              </span>
              <button onClick={generateScript} disabled={loading} className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50">
                Regenerate Script
              </button>
            </div>
          </div>

          {/* Customer Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Customer Summary
            </h4>
            <p className="text-gray-700 leading-relaxed">{callDetails.customer_summary}</p>
          </div>

          {/* Medical Summary */}
          {callDetails.medical_summary && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                Medical Summary
              </h4>
              <p className="text-gray-700 leading-relaxed">{callDetails.medical_summary}</p>
            </div>
          )}

          {/* Talking Points */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-600" />
              Key Talking Points
            </h4>
            <ul className="space-y-2">
              {callDetails.talking_points?.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Medicines to Discuss */}
          {callDetails.medicines_due?.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Pill className="w-5 h-5 text-purple-600" />
                Medicines to Discuss
              </h4>
              <div className="space-y-2">
                {callDetails.medicines_due.map((med, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <span className="font-medium text-gray-800">{med.medicine_name}</span>
                    <span className="text-sm text-orange-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Due: {new Date(med.due_date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Reminders */}
          {callDetails.followup_reminders?.length > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Follow-up Reminders
              </h4>
              <ul className="space-y-2">
                {callDetails.followup_reminders.map((reminder, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>{reminder}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Call Script */}
          {callDetails.call_script && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
              <h4 className="font-semibold text-gray-800 mb-2">Generated Call Script</h4>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{callDetails.call_script}</pre>
            </div>
          )}
        </div>
      )}

      {/* Priority Scripts List */}
      {priorityScripts.length > 0 && !callDetails && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-800">{selectedPriority.toUpperCase()} Priority Calls</h3>
          {priorityScripts.map((script) => {
            const scriptId = script.id || script.script_id
            return (
              <div key={scriptId} className={`bg-white rounded-xl shadow-md p-4 border-2 ${getPriorityColor(script.priority)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{script.customer_name || script.name}</h4>
                    <p className="text-sm text-gray-600">{script.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateOutcome(scriptId, 'successful', 'Customer agreed to purchase')} className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Success
                    </button>
                    <button onClick={() => updateOutcome(scriptId, 'no_answer', 'No response')} className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      No Answer
                    </button>
                    <button onClick={() => updateOutcome(scriptId, 'declined', 'Customer declined')} className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      Declined
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{script.customer_summary}</p>
                <p className="text-xs text-gray-500 mt-2">Generated: {script.created_at ? new Date(script.created_at).toLocaleString() : 'N/A'}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CallScripts
