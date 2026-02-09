import React, { useState } from 'react'
import { customerTrackingAPI } from '../services/customerTracking'
import { Search, Plus, Calendar, Pill, User, AlertCircle, CheckCircle } from 'lucide-react'

const Prescriptions = () => {
  const [phone, setPhone] = useState('')
  const [customer, setCustomer] = useState(null)
  const [prescriptions, setPrescriptions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    prescription_date: new Date().toISOString().split('T')[0],
    doctor_name: '',
    doctor_phone: '',
    condition_name: '',
    is_chronic: false,
    next_followup_date: '',
    followup_type: 'doctor_visit',
    medicines: [{ medicine_name: '', dosage: '', frequency: '', duration_days: 30, total_quantity_prescribed: 0 }]
  })

  const searchCustomer = async () => {
    if (!phone) return
    setLoading(true)
    try {
      const res = await customerTrackingAPI.getCustomerByPhone(phone)
      setCustomer(res.data)
      const prescRes = await customerTrackingAPI.getPrescriptions(res.data.customer_id)
      setPrescriptions(prescRes.data || [])
    } catch (err) {
      alert(err.response?.data?.detail || 'Customer not found')
    } finally {
      setLoading(false)
    }
  }

  const addMedicine = () => {
    setFormData(prev => ({
      ...prev,
      medicines: [...prev.medicines, { medicine_name: '', dosage: '', frequency: '', duration_days: 30, total_quantity_prescribed: 0 }]
    }))
  }

  const updateMedicine = (idx, field, value) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines.map((m, i) => i === idx ? { ...m, [field]: value } : m)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await customerTrackingAPI.addPrescription(customer.customer_id, formData)
      alert('Prescription added successfully')
      setShowForm(false)
      searchCustomer()
      setFormData({
        prescription_date: new Date().toISOString().split('T')[0],
        doctor_name: '',
        doctor_phone: '',
        condition_name: '',
        is_chronic: false,
        next_followup_date: '',
        followup_type: 'doctor_visit',
        medicines: [{ medicine_name: '', dosage: '', frequency: '', duration_days: 30, total_quantity_prescribed: 0 }]
      })
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add prescription')
    } finally {
      setLoading(false)
    }
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
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{customer.name}</h3>
                <p className="text-sm text-gray-600">{customer.phone} • Age: {customer.age || 'N/A'}</p>
              </div>
              <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Prescription
              </button>
            </div>
          </div>

          {/* Add Form */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-primary-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">New Prescription</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prescription Date</label>
                    <input type="date" value={formData.prescription_date} onChange={(e) => setFormData({...formData, prescription_date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                    <input type="text" value={formData.doctor_name} onChange={(e) => setFormData({...formData, doctor_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Phone</label>
                    <input type="text" value={formData.doctor_phone} onChange={(e) => setFormData({...formData, doctor_phone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                    <input type="text" value={formData.condition_name} onChange={(e) => setFormData({...formData, condition_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Next Follow-up</label>
                    <input type="date" value={formData.next_followup_date} onChange={(e) => setFormData({...formData, next_followup_date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Type</label>
                    <select value={formData.followup_type} onChange={(e) => setFormData({...formData, followup_type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                      <option value="doctor_visit">Doctor Visit</option>
                      <option value="lab_test">Lab Test</option>
                      <option value="medication_review">Medication Review</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.is_chronic} onChange={(e) => setFormData({...formData, is_chronic: e.target.checked})} className="w-4 h-4 text-primary-600 rounded" />
                  <label className="text-sm font-medium text-gray-700">Chronic Condition</label>
                </div>

                {/* Medicines */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">Medicines</h4>
                    <button type="button" onClick={addMedicine} className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                      <Plus className="w-4 h-4" /> Add Medicine
                    </button>
                  </div>
                  {formData.medicines.map((med, idx) => (
                    <div key={idx} className="grid grid-cols-5 gap-2 mb-2">
                      <input type="text" placeholder="Medicine" value={med.medicine_name} onChange={(e) => updateMedicine(idx, 'medicine_name', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
                      <input type="text" placeholder="Dosage" value={med.dosage} onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
                      <input type="text" placeholder="Frequency" value={med.frequency} onChange={(e) => updateMedicine(idx, 'frequency', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
                      <input type="number" placeholder="Days" value={med.duration_days} onChange={(e) => updateMedicine(idx, 'duration_days', parseInt(e.target.value))} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
                      <input type="number" placeholder="Qty" value={med.total_quantity_prescribed} onChange={(e) => updateMedicine(idx, 'total_quantity_prescribed', parseInt(e.target.value))} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" required />
                    </div>
                  ))}
                </div>

                <button type="submit" disabled={loading} className="w-full py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Prescription'}
                </button>
              </form>
            </div>
          )}

          {/* Prescriptions List */}
          <div className="space-y-3">
            {prescriptions.map((presc) => (
              <div key={presc.prescription_id} className="bg-white rounded-xl shadow-md p-4 border border-primary-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-gray-800">{presc.doctor_name}</span>
                      {presc.is_chronic && <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Chronic</span>}
                    </div>
                    <p className="text-sm text-gray-600">{presc.condition_name}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{new Date(presc.prescription_date).toLocaleDateString()}</p>
                    {presc.next_followup_date && (
                      <div className="flex items-center gap-1 text-orange-600 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>Follow-up: {new Date(presc.next_followup_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  {presc.medicines?.map((med, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-lg">
                      <Pill className="w-4 h-4 text-green-600" />
                      <span className="font-medium">{med.medicine_name}</span>
                      <span className="text-gray-600">• {med.dosage} • {med.frequency} • {med.duration_days} days</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Prescriptions
