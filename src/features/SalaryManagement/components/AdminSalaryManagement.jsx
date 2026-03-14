import { useState, useEffect } from 'react'
import Layout from '../../../components/Layout'
import ErrorBoundary from '../../../components/ErrorBoundary'
import useTabPermissions from '../../../hooks/useTabPermissions'
import { salaryAPI, API_BASE_URL } from '../services/salaryApi'
import { adminApi } from '../../Admin&SuperAdmin/services/admin&superAminApi'
import { IndianRupee, Users, AlertTriangle, Calendar, CheckCircle, Clock, CreditCard, Lightbulb, LayoutDashboard, List, Store } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminSalaryManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)
  const [dashboard, setDashboard] = useState(null)
  const [records, setRecords] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [showPayModal, setShowPayModal] = useState(null)
  const [showQRModal, setShowQRModal] = useState(null)
  const [showQREnlarged, setShowQREnlarged] = useState(false)
  const [generateResult, setGenerateResult] = useState(null)
  const { isTabEnabled, isLoaded } = useTabPermissions('salary_management')

  const allTabs = [
    { id: 'dashboard', label: 'Dashboard',      icon: LayoutDashboard },
    { id: 'records',   label: 'Salary Records', icon: List },
  ]
  const tabs = allTabs.filter(t => isTabEnabled(t.id))

  useEffect(() => {
    loadShops()
  }, [])

  useEffect(() => {
    if (isLoaded && tabs.length > 0 && !tabs.find(t => t.id === activeTab)) {
      setActiveTab(tabs[0].id)
    }
  }, [isLoaded, tabs.length])

  useEffect(() => {
    if (selectedShop) {
      loadDashboard()
      loadRecords()
      loadAlerts()
    }
  }, [selectedShop, selectedMonth, selectedYear])

  const loadShops = async () => {
    try {
      const data = await adminApi.getShops()
      setShops(data)
      if (data.length > 0) setSelectedShop(data[0].shop_code)
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch shops')
    }
  }

  const loadDashboard = async () => {
    try {
      const { data } = await salaryAPI.getMonthlySummary(selectedYear, selectedMonth, selectedShop)
      setDashboard({
        total_staff: data.total_staff,
        pending_payments: data.pending_count,
        overdue_payments: data.overdue_count,
        total_pending_amount: data.pending_amount,
        total_overdue_amount: data.overdue_amount,
      })
    } catch (err) {
      toast.error('Failed to load dashboard')
    }
  }

  const loadRecords = async () => {
    setLoading(true)
    try {
      const { data } = await salaryAPI.getSalaryRecords({ month: selectedMonth, year: selectedYear }, selectedShop)
      setRecords(data)
    } catch (err) {
      toast.error('Failed to load salary records')
    } finally {
      setLoading(false)
    }
  }

  const loadAlerts = async () => {
    try {
      const { data } = await salaryAPI.getAlerts(selectedShop)
      setAlerts(data)
    } catch (err) {
      toast.error('Failed to load alerts')
    }
  }

  const handlePaySalary = async (recordId, notes) => {
    try {
      await salaryAPI.paySalary(recordId, { notes }, selectedShop)
      toast.success('Salary paid successfully')
      setShowPayModal(null)
      loadDashboard()
      loadRecords()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to pay salary')
    }
  }

  const handleDismissAlert = async (alertId) => {
    try {
      await salaryAPI.dismissAlert(alertId, selectedShop)
      toast.success('Alert dismissed')
      loadAlerts()
    } catch (err) {
      toast.error('Failed to dismiss alert')
    }
  }

  const viewQRCode = async (staffId) => {
    try {
      const { data } = await salaryAPI.getStaffPaymentInfo(staffId, selectedShop)
      setShowQRModal(data)
    } catch (err) {
      toast.error('Failed to load payment info')
    }
  }

  const handleGenerateRecords = async () => {
    try {
      const { data } = await salaryAPI.generateMonthlyRecords(selectedYear, selectedMonth, selectedShop)
      setGenerateResult(data)
      toast.success(`Generated ${data.created} salary records`)
      setTimeout(() => setGenerateResult(null), 5000)
      loadDashboard()
      loadRecords()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to generate records')
    }
  }

  const getStatusColor = (status) => ({
    paid:    'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-100 text-red-700',
  }[status] || 'bg-yellow-100 text-yellow-700')

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg p-4 md:p-6 mb-4 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-2 md:gap-3">
            <div className="p-2 md:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <IndianRupee className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Salary Management</h1>
              <p className="text-white/90 text-xs md:text-sm">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Shared Shop Filter */}
        <div className="bg-white rounded-xl shadow border border-slate-200 p-3 mb-4 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Store className="w-4 h-4 text-indigo-600" />
          </div>
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by Shop:</label>
          <select
            value={selectedShop || ''}
            onChange={(e) => setSelectedShop(e.target.value)}
            className="flex-1 max-w-xs px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            {shops.map((shop) => (
              <option key={shop.shop_code} value={shop.shop_code}>{shop.shop_name}</option>
            ))}
          </select>
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
        {selectedShop && (
          <div className="animate-fade-in space-y-4 pb-20">
            <ErrorBoundary key={activeTab}>

              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <>
                  {dashboard && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-3 md:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs md:text-sm text-gray-600">Total Staff</p>
                            <p className="text-xl md:text-2xl font-bold text-gray-800">{dashboard.total_staff}</p>
                          </div>
                          <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                        </div>
                      </div>
                      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-3 md:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs md:text-sm text-gray-600">Pending</p>
                            <p className="text-xl md:text-2xl font-bold text-yellow-700">{dashboard.pending_payments}</p>
                            <p className="text-[10px] md:text-xs text-gray-500">₹{dashboard.total_pending_amount?.toFixed(2)}</p>
                          </div>
                          <Clock className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />
                        </div>
                      </div>
                      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-3 md:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs md:text-sm text-gray-600">Overdue</p>
                            <p className="text-xl md:text-2xl font-bold text-red-700">{dashboard.overdue_payments}</p>
                            <p className="text-[10px] md:text-xs text-gray-500">₹{dashboard.total_overdue_amount?.toFixed(2)}</p>
                          </div>
                          <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
                        </div>
                      </div>
                      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-3 md:p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs md:text-sm text-gray-600">Period</p>
                            <p className="text-base md:text-lg font-bold text-gray-800">
                              {new Date(2024, selectedMonth - 1).toLocaleString('default', { month: 'short' })} {selectedYear}
                            </p>
                          </div>
                          <Calendar className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                        </div>
                      </div>
                    </div>
                  )}

                  {alerts.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                      <h3 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Salary Alerts
                      </h3>
                      <div className="space-y-2">
                        {alerts.map(alert => (
                          <div key={alert.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800">{alert.staff_name}</p>
                              <p className="text-sm text-gray-600 capitalize">{alert.alert_type} — {alert.month}/{alert.year} — ₹{alert.salary_amount}</p>
                            </div>
                            <button onClick={() => handleDismissAlert(alert.id)} className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                              Dismiss
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Records Tab */}
              {activeTab === 'records' && (
                <>
                  {/* Filters + Generate */}
                  <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-200">
                    <div className="flex flex-wrap gap-3 items-center">
                      <label className="text-xs md:text-sm font-medium text-gray-700">Period:</label>
                      <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="px-2 md:px-3 py-2 border rounded-lg text-sm">
                        {[...Array(12)].map((_, i) => (
                          <option key={i} value={i + 1}>{new Date(2024, i).toLocaleString('default', { month: 'long' })}</option>
                        ))}
                      </select>
                      <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="px-2 md:px-3 py-2 border rounded-lg text-sm">
                        {[2024, 2025, 2026].map(year => <option key={year} value={year}>{year}</option>)}
                      </select>
                      <button
                        onClick={handleGenerateRecords}
                        className="px-3 md:px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2 text-sm shadow-lg shadow-blue-500/20"
                      >
                        <Calendar className="w-4 h-4" />
                        Create Records
                      </button>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" />
                        Create records first, then mark as paid
                      </span>
                    </div>
                    {generateResult && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-xs md:text-sm text-green-800">
                          ✓ Created: {generateResult.created} records | Skipped: {generateResult.skipped} (already exist)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Records Table */}
                  <div className="bg-white rounded-xl shadow-lg border border-slate-200">
                    <div className="p-4 border-b">
                      <h3 className="text-sm md:text-base font-semibold text-gray-800">Salary Records</h3>
                    </div>
                    <div className="overflow-x-auto">
                      {loading ? (
                        <div className="flex justify-center py-12">
                          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500/20 border-t-blue-500"></div>
                        </div>
                      ) : records.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 text-sm">No records found for this period</div>
                      ) : (
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Staff</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Month/Year</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {records.map(record => (
                              <tr key={record.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-800">{record.staff_name || `Staff #${record.staff_id}`}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{record.month}/{record.year}</td>
                                <td className="px-4 py-3 text-sm font-semibold text-gray-800">₹{record.salary_amount}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(record.payment_status)}`}>
                                    {record.payment_status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{record.due_date || '-'}</td>
                                <td className="px-4 py-3">
                                  <div className="flex gap-2">
                                    {record.payment_status !== 'paid' && (
                                      <button
                                        onClick={() => setShowPayModal(record)}
                                        className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 flex items-center gap-1"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                        Mark Paid
                                      </button>
                                    )}
                                    <button
                                      onClick={() => viewQRCode(record.staff_id)}
                                      className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 flex items-center gap-1"
                                    >
                                      <CreditCard className="w-4 h-4" />
                                      Payment Info
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </>
              )}

            </ErrorBoundary>
          </div>
        )}

        {/* Pay Modal */}
        {showPayModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Confirm Payment</h3>
              <p className="text-gray-700 mb-3">
                Have you paid <span className="font-semibold">₹{showPayModal.salary_amount}</span> to{' '}
                <span className="font-semibold">{showPayModal.staff_name || `Staff #${showPayModal.staff_id}`}</span> for{' '}
                <span className="font-semibold">{showPayModal.month}/{showPayModal.year}</span>?
              </p>
              <p className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg mb-4">
                If not, please check their payment information first before confirming.
              </p>
              <div className="flex gap-2">
                <button onClick={() => viewQRCode(showPayModal.staff_id)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  View Payment Info
                </button>
                <button onClick={() => handlePaySalary(showPayModal.id, 'Paid via admin')} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                  Yes, Confirm
                </button>
                <button onClick={() => setShowPayModal(null)} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Info Modal */}
        {showQRModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-sm flex flex-col" style={{ maxHeight: '85vh' }}>
              <div className="p-5 border-b">
                <h3 className="text-lg font-bold">Payment Information</h3>
              </div>
              <div className="p-5 overflow-y-auto flex-1 space-y-3">
                {[
                  ['UPI ID', showQRModal.upi_id],
                  ['Preferred Method', showQRModal.preferred_payment_method],
                  ['Bank Account', showQRModal.bank_account],
                  ['IFSC Code', showQRModal.ifsc_code],
                  ['Account Holder', showQRModal.account_holder_name],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="font-semibold text-gray-800">{value || 'Not set'}</p>
                  </div>
                ))}
                {showQRModal.qr_code_path && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">QR Code</p>
                    <img
                      src={`${API_BASE_URL}${showQRModal.qr_code_path}`}
                      alt="QR Code"
                      className="w-40 h-40 border rounded-lg cursor-pointer hover:opacity-80"
                      onClick={() => setShowQREnlarged(true)}
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  </div>
                )}
              </div>
              <div className="p-5 border-t">
                <button onClick={() => setShowQRModal(null)} className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-semibold">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enlarged QR */}
        {showQREnlarged && showQRModal?.qr_code_path && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4" onClick={() => setShowQREnlarged(false)}>
            <img src={`${API_BASE_URL}${showQRModal.qr_code_path}`} alt="QR Code" className="max-w-full max-h-full object-contain" />
          </div>
        )}
      </div>
    </Layout>
  )
}

export default AdminSalaryManagement
