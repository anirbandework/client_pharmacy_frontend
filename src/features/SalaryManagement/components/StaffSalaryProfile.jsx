import React, { useState, useEffect } from 'react'
import Layout from '../../../components/Layout'
import PasswordProtectedRoute from '../../../components/PasswordProtectedRoute'
import { salaryAPI } from '../services/salaryApi'
import { User, DollarSign, Calendar, CheckCircle, Clock, AlertTriangle, Upload, CreditCard, QrCode } from 'lucide-react'
import toast from 'react-hot-toast'

const StaffSalaryProfile = () => {
  const [profile, setProfile] = useState(null)
  const [history, setHistory] = useState(null)
  const [paymentInfo, setPaymentInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({
    upi_id: '',
    bank_account: '',
    ifsc_code: '',
    account_holder_name: '',
    preferred_payment_method: 'upi'
  })

  useEffect(() => {
    loadProfile()
    loadHistory()
    loadPaymentInfo()
  }, [])

  const loadProfile = async () => {
    try {
      const { data } = await salaryAPI.getMyProfile()
      setProfile(data)
    } catch (err) {
      toast.error('Failed to load profile')
    }
  }

  const loadHistory = async () => {
    try {
      const { data } = await salaryAPI.getMyHistory()
      setHistory(data)
    } catch (err) {
      toast.error('Failed to load salary history')
    }
  }

  const loadPaymentInfo = async () => {
    try {
      const { data } = await salaryAPI.getMyPaymentInfo()
      setPaymentInfo(data)
      setFormData({
        upi_id: data.upi_id || '',
        bank_account: data.bank_account || '',
        ifsc_code: data.ifsc_code || '',
        account_holder_name: data.account_holder_name || '',
        preferred_payment_method: data.preferred_payment_method || 'upi'
      })
    } catch (err) {
      toast.error('Failed to load payment info')
    }
  }

  const handleUpdatePaymentInfo = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await salaryAPI.updateMyPaymentInfo(formData)
      toast.success('Payment information updated successfully')
      setShowEditModal(false)
      loadPaymentInfo()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update payment info')
    } finally {
      setLoading(false)
    }
  }

  const handleQRUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)
    try {
      await salaryAPI.uploadMyQRCode(file)
      toast.success('QR code uploaded successfully')
      loadPaymentInfo()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to upload QR code')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      overdue: 'bg-red-100 text-red-700'
    }
    return colors[status] || colors.pending
  }

  return (
    <Layout>
      <PasswordProtectedRoute moduleName="My Salary">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">My Salary Profile</h1>
              <p className="text-white/90 text-sm">View your salary details and payment history</p>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white rounded-xl shadow-md p-4 border border-primary-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Salary</p>
                  <p className="text-2xl font-bold text-gray-800">₹{profile.monthly_salary}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Paid Months</p>
                  <p className="text-2xl font-bold text-green-700">{profile.paid_months}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Months</p>
                  <p className="text-2xl font-bold text-yellow-700">{profile.pending_months}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overdue Months</p>
                  <p className="text-2xl font-bold text-red-700">{profile.overdue_months}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        )}

        {/* Payment Information */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-4 border border-primary-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Information
            </h3>
            <button onClick={() => setShowEditModal(true)} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">
              Edit Payment Info
            </button>
          </div>
          {paymentInfo ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">UPI ID</p>
                <p className="font-semibold text-gray-800">{paymentInfo.upi_id || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Preferred Method</p>
                <p className="font-semibold text-gray-800">{paymentInfo.preferred_payment_method || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bank Account</p>
                <p className="font-semibold text-gray-800">{paymentInfo.bank_account || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">IFSC Code</p>
                <p className="font-semibold text-gray-800">{paymentInfo.ifsc_code || 'Not set'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-2">QR Code</p>
                {paymentInfo.qr_code_path ? (
                  <img src={`http://localhost:8000${paymentInfo.qr_code_path}`} alt="QR Code" className="w-48 h-48 border rounded-lg" />
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">No QR code uploaded</p>
                    <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer inline-flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload QR Code
                      <input type="file" accept="image/*" onChange={handleQRUpload} className="hidden" />
                    </label>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No payment information set</p>
          )}
        </div>

        {/* Salary History */}
        {history && (
          <div className="bg-white rounded-xl shadow-md border border-primary-100">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Salary History
              </h3>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="text-gray-600">Total Paid: <span className="font-semibold text-green-700">₹{history.total_paid}</span></span>
                <span className="text-gray-600">Total Pending: <span className="font-semibold text-yellow-700">₹{history.total_pending}</span></span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Month/Year</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Payment Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {history.records.map(record => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">{record.month}/{record.year}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800">₹{record.salary_amount}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.payment_status)}`}>
                          {record.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {record.payment_date ? new Date(record.payment_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{record.due_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit Payment Info Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold mb-4">Update Payment Information</h3>
              <form onSubmit={handleUpdatePaymentInfo} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                  <input type="text" value={formData.upi_id} onChange={(e) => setFormData({...formData, upi_id: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="yourname@upi" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account Number</label>
                  <input type="text" value={formData.bank_account} onChange={(e) => setFormData({...formData, bank_account: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                  <input type="text" value={formData.ifsc_code} onChange={(e) => setFormData({...formData, ifsc_code: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                  <input type="text" value={formData.account_holder_name} onChange={(e) => setFormData({...formData, account_holder_name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Payment Method</label>
                  <select value={formData.preferred_payment_method} onChange={(e) => setFormData({...formData, preferred_payment_method: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      </PasswordProtectedRoute>
    </Layout>
  )
}

export default StaffSalaryProfile
