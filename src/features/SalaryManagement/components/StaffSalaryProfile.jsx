import { useState, useEffect } from 'react'
import Layout from '../../../components/Layout'
import PasswordProtectedRoute from '../../../components/PasswordProtectedRoute'
import ErrorBoundary from '../../../components/ErrorBoundary'
import useTabPermissions from '../../../hooks/useTabPermissions'
import { salaryAPI, API_BASE_URL } from '../services/salaryApi'
import { User, IndianRupee, Calendar, CheckCircle, Clock, AlertTriangle, CreditCard, History } from 'lucide-react'
import toast from 'react-hot-toast'

const StaffSalaryProfile = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState(null)
  const [history, setHistory] = useState(null)
  const [paymentInfo, setPaymentInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [qrFile, setQRFile] = useState(null)
  const [qrPreviewUrl, setQrPreviewUrl] = useState(null)
  const [formData, setFormData] = useState({
    upi_id: '',
    bank_account: '',
    ifsc_code: '',
    account_holder_name: '',
    preferred_payment_method: 'upi'
  })
  const { isTabEnabled, isLoaded } = useTabPermissions('my_salary')

  const allTabs = [
    { id: 'profile', label: 'Profile',       icon: User },
    { id: 'payment', label: 'Payment Info',  icon: CreditCard },
    { id: 'history', label: 'History',       icon: History },
  ]
  const tabs = allTabs.filter(t => isTabEnabled(t.id))

  useEffect(() => {
    if (isLoaded && tabs.length > 0 && !tabs.find(t => t.id === activeTab)) {
      setActiveTab(tabs[0].id)
    }
  }, [isLoaded, tabs.length])

  useEffect(() => {
    loadProfile()
    loadHistory()
    loadPaymentInfo()
  }, [])

  // Revoke object URL on unmount to prevent memory leak
  useEffect(() => {
    return () => { if (qrPreviewUrl) URL.revokeObjectURL(qrPreviewUrl) }
  }, [qrPreviewUrl])

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

  const handleQRFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (qrPreviewUrl) URL.revokeObjectURL(qrPreviewUrl)
    setQRFile(file)
    setQrPreviewUrl(URL.createObjectURL(file))
  }

  const handleUpdatePaymentInfo = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await salaryAPI.updateMyPaymentInfo(formData)
      if (qrFile) await salaryAPI.uploadMyQRCode(qrFile)
      toast.success('Payment information updated successfully')
      setShowEditModal(false)
      setQRFile(null)
      if (qrPreviewUrl) { URL.revokeObjectURL(qrPreviewUrl); setQrPreviewUrl(null) }
      loadPaymentInfo()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update payment info')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => ({
    paid:    'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-100 text-red-700',
  }[status] || 'bg-yellow-100 text-yellow-700')

  return (
    <Layout>
      <PasswordProtectedRoute moduleName="My Salary">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <IndianRupee className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">My Salary</h1>
                <p className="text-white/90 text-xs md:text-sm">View your salary details and payment history</p>
              </div>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="mb-4 overflow-x-auto pb-2">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg p-1.5 inline-flex gap-1 min-w-full md:min-w-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in space-y-4 pb-20">
            <ErrorBoundary key={activeTab}>

              {/* Profile Tab */}
              {activeTab === 'profile' && profile && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <div className="bg-white rounded-xl shadow-lg p-3 md:p-4 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">Monthly Salary</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-800">₹{profile.monthly_salary ?? '-'}</p>
                      </div>
                      <IndianRupee className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-3 md:p-4 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">Paid Months</p>
                        <p className="text-xl md:text-2xl font-bold text-green-700">{profile.paid_months}</p>
                      </div>
                      <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-3 md:p-4 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">Pending Months</p>
                        <p className="text-xl md:text-2xl font-bold text-yellow-700">{profile.pending_months}</p>
                      </div>
                      <Clock className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-3 md:p-4 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">Overdue Months</p>
                        <p className="text-xl md:text-2xl font-bold text-red-700">{profile.overdue_months}</p>
                      </div>
                      <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Info Tab */}
              {activeTab === 'payment' && (
                <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Information
                    </h3>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="px-3 md:px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 text-xs md:text-sm shadow-lg shadow-blue-500/20"
                    >
                      Edit Payment Info
                    </button>
                  </div>
                  {paymentInfo ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">UPI ID</p>
                        <p className="font-semibold text-gray-800">{paymentInfo.upi_id || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Preferred Method</p>
                        <p className="font-semibold text-gray-800 capitalize">{paymentInfo.preferred_payment_method?.replace('_', ' ') || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Bank Account</p>
                        <p className="font-semibold text-gray-800">{paymentInfo.bank_account || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">IFSC Code</p>
                        <p className="font-semibold text-gray-800">{paymentInfo.ifsc_code || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Holder</p>
                        <p className="font-semibold text-gray-800">{paymentInfo.account_holder_name || 'Not set'}</p>
                      </div>
                      {paymentInfo.qr_code_path && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500 mb-2">QR Code</p>
                          <img
                            src={`${API_BASE_URL}${paymentInfo.qr_code_path}`}
                            alt="QR Code"
                            className="w-48 h-48 border rounded-lg"
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No payment information set. Click "Edit Payment Info" to add your details.</p>
                  )}
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && history && (
                <div className="bg-white rounded-xl shadow-lg border border-slate-200">
                  <div className="p-4 border-b">
                    <h3 className="text-sm md:text-base font-semibold text-gray-800 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Salary History
                    </h3>
                    <div className="flex gap-4 mt-2 text-xs md:text-sm">
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
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(record.payment_status)}`}>
                                {record.payment_status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {record.payment_date ? new Date(record.payment_date).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{record.due_date || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </ErrorBoundary>
          </div>

          {/* Edit Payment Info Modal */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-bold mb-4">Update Payment Information</h3>
                <form onSubmit={handleUpdatePaymentInfo} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                    <input type="text" value={formData.upi_id} onChange={(e) => setFormData({ ...formData, upi_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="yourname@upi" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account Number</label>
                    <input type="text" value={formData.bank_account} onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                    <input type="text" value={formData.ifsc_code} onChange={(e) => setFormData({ ...formData, ifsc_code: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                    <input type="text" value={formData.account_holder_name} onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Payment Method</label>
                    <select value={formData.preferred_payment_method} onChange={(e) => setFormData({ ...formData, preferred_payment_method: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option value="upi">UPI</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">QR Code</label>
                    <input type="file" accept="image/*" onChange={handleQRFileChange} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    {qrPreviewUrl && <img src={qrPreviewUrl} alt="Preview" className="mt-2 w-32 h-32 border rounded" />}
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-sm font-semibold">
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-semibold">
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
