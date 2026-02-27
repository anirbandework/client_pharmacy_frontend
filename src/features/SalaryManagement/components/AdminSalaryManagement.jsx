import React, { useState, useEffect } from 'react'
import Layout from '../../../components/Layout'
import { salaryAPI, API_BASE_URL } from '../services/salaryApi'
import { adminApi } from '../../Admin&SuperAdmin/services/admin&superAminApi'
import { DollarSign, Users, AlertTriangle, Calendar, CheckCircle, XCircle, Clock, QrCode, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminSalaryManagement = () => {
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

  useEffect(() => {
    loadShops()
  }, [])

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
    }
  }

  const loadDashboard = async () => {
    try {
      const { data } = await salaryAPI.getMonthlySummary(selectedYear, selectedMonth, selectedShop)
      setDashboard({
        total_staff: data.total_staff,
        pending_payments: data.pending_count,
        overdue_payments: data.overdue_count,
        upcoming_payments: 0,
        total_pending_amount: data.pending_amount,
        total_overdue_amount: data.total_salary_amount - data.paid_amount - data.pending_amount
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

  const handlePaySalary = async (recordId, paidBy, notes) => {
    try {
      await salaryAPI.paySalary(recordId, { paid_by_admin: paidBy, notes }, selectedShop)
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 rounded-xl shadow-lg p-6 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Salary Management</h1>
                <p className="text-white/90 text-sm">Admin Dashboard</p>
              </div>
            </div>
            <select 
              value={selectedShop || ''} 
              onChange={(e) => setSelectedShop(e.target.value)} 
              className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-3 py-2 rounded-lg text-sm"
            >
              {shops.map(shop => (
                <option key={shop.shop_code} value={shop.shop_code} className="text-gray-900">
                  {shop.shop_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dashboard Stats */}
        {selectedShop && dashboard && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white rounded-xl shadow-md p-4 border border-primary-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Staff</p>
                  <p className="text-2xl font-bold text-gray-800">{dashboard.total_staff}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-yellow-700">{dashboard.pending_payments}</p>
                  <p className="text-xs text-gray-500">₹{dashboard.total_pending_amount?.toFixed(2)}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-700">{dashboard.overdue_payments}</p>
                  <p className="text-xs text-gray-500">₹{dashboard.total_overdue_amount?.toFixed(2)}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming (5 days)</p>
                  <p className="text-2xl font-bold text-green-700">{dashboard.upcoming_payments}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        )}

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
            <h3 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Salary Alerts
            </h3>
            <div className="space-y-2">
              {alerts.map(alert => (
                <div key={alert.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{alert.staff_name}</p>
                    <p className="text-sm text-gray-600">{alert.alert_type} - {alert.month}/{alert.year} - ₹{alert.salary_amount}</p>
                  </div>
                  <button onClick={() => handleDismissAlert(alert.id)} className="text-sm text-orange-600 hover:text-orange-700">
                    Dismiss
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Month/Year Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4 border border-primary-100">
          <div className="flex flex-col gap-3">
            <div className="flex gap-3 items-center flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Select Period:</label>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="px-3 py-2 border rounded-lg">
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i + 1}>{new Date(2024, i).toLocaleString('default', { month: 'long' })}</option>
                  ))}
                </select>
                <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="px-3 py-2 border rounded-lg">
                  {[2024, 2025, 2026].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button 
                onClick={handleGenerateRecords} 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                title="Create salary records for all staff for the selected month"
              >
                <Calendar className="w-4 h-4" />
                Create Salary Records
              </button>
              <div className="text-xs text-gray-500 flex items-center">
                <span>💡 First, create salary records for the month, then mark them as paid</span>
              </div>
            </div>
          </div>
          {generateResult && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ Created: {generateResult.created_count} records | Skipped: {generateResult.skipped_count} (already exist)
              </p>
            </div>
          )}
        </div>

        {/* Salary Records */}
        <div className="bg-white rounded-xl shadow-md border border-primary-100">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-800">Salary Records</h3>
          </div>
          <div className="overflow-x-auto">
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
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.payment_status)}`}>
                        {record.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{record.due_date}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {record.payment_status !== 'paid' && (
                          <button 
                            onClick={() => setShowPayModal(record)} 
                            className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 flex items-center gap-1"
                            title="Mark this salary as paid"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Paid
                          </button>
                        )}
                        <button 
                          onClick={() => viewQRCode(record.staff_id)} 
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 flex items-center gap-1"
                          title="View payment details and QR code"
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
          </div>
        </div>

        {/* Pay Modal */}
        {showPayModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Confirm Payment</h3>
              <div className="mb-4">
                <p className="text-gray-700 mb-3">
                  Have you paid <span className="font-semibold">₹{showPayModal.salary_amount}</span> to <span className="font-semibold">{showPayModal.staff_name || `Staff #${showPayModal.staff_id}`}</span> for <span className="font-semibold">{showPayModal.month}/{showPayModal.year}</span>?
                </p>
                <p className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                  If not, please check their payment information first before confirming.
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => viewQRCode(showPayModal.staff_id)} 
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View Payment Info
                </button>
                <button 
                  onClick={() => handlePaySalary(showPayModal.id, localStorage.getItem('username') || 'admin', 'Paid via admin')} 
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Yes, Confirm
                </button>
                <button 
                  onClick={() => setShowPayModal(null)} 
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QR Modal */}
        {showQRModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-sm flex flex-col" style={{maxHeight: '85vh'}}>
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold">Payment Information</h3>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">UPI ID</p>
                    <p className="font-semibold text-gray-800">{showQRModal.upi_id || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Preferred Payment Method</p>
                    <p className="font-semibold text-gray-800">{showQRModal.preferred_payment_method || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bank Account Number</p>
                    <p className="font-semibold text-gray-800">{showQRModal.bank_account || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">IFSC Code</p>
                    <p className="font-semibold text-gray-800">{showQRModal.ifsc_code || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Holder Name</p>
                    <p className="font-semibold text-gray-800">{showQRModal.account_holder_name || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">QR Code</p>
                    {showQRModal.qr_code_path ? (
                      <img 
                        src={`${API_BASE_URL}${showQRModal.qr_code_path}`} 
                        alt="QR Code" 
                        className="w-full max-w-[200px] h-auto border rounded-lg cursor-pointer hover:opacity-80"
                        onClick={() => setShowQREnlarged(true)}
                      />
                    ) : (
                      <p className="text-sm text-gray-500">No QR code uploaded</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t">
                <button onClick={() => setShowQRModal(null)} className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enlarged QR Modal */}
        {showQREnlarged && showQRModal?.qr_code_path && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4" onClick={() => setShowQREnlarged(false)}>
            <img 
              src={`${API_BASE_URL}${showQRModal.qr_code_path}`} 
              alt="QR Code Enlarged" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>
    </Layout>
  )
}

export default AdminSalaryManagement
