import React, { useState, useEffect } from 'react'
import Layout from '../../../components/Layout'
import { salaryAPI } from '../services/salaryApi'
import { DollarSign, Users, AlertTriangle, Calendar, CheckCircle, XCircle, Clock, QrCode, CreditCard } from 'lucide-react'

const AdminSalaryManagement = () => {
  const [dashboard, setDashboard] = useState(null)
  const [records, setRecords] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [showPayModal, setShowPayModal] = useState(null)
  const [showQRModal, setShowQRModal] = useState(null)
  const [generateResult, setGenerateResult] = useState(null)

  useEffect(() => {
    loadDashboard()
    loadRecords()
    loadAlerts()
  }, [])

  const loadDashboard = async () => {
    try {
      const { data } = await salaryAPI.getDashboard()
      setDashboard(data)
    } catch (err) {
      console.error(err)
    }
  }

  const loadRecords = async () => {
    setLoading(true)
    try {
      const { data } = await salaryAPI.getSalaryRecords({ month: selectedMonth, year: selectedYear })
      setRecords(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadAlerts = async () => {
    try {
      const { data } = await salaryAPI.getAlerts()
      setAlerts(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handlePaySalary = async (recordId, paidBy, notes) => {
    try {
      await salaryAPI.paySalary(recordId, { paid_by_admin: paidBy, notes })
      alert('Salary paid successfully')
      setShowPayModal(null)
      loadDashboard()
      loadRecords()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to pay salary')
    }
  }

  const handleDismissAlert = async (alertId) => {
    try {
      await salaryAPI.dismissAlert(alertId)
      loadAlerts()
    } catch (err) {
      console.error(err)
    }
  }

  const viewQRCode = async (staffId) => {
    try {
      const { data } = await salaryAPI.getStaffPaymentInfo(staffId)
      setShowQRModal(data)
    } catch (err) {
      alert('Failed to load payment info')
    }
  }

  const handleGenerateRecords = async () => {
    try {
      const { data } = await salaryAPI.generateMonthlyRecords(selectedYear, selectedMonth)
      setGenerateResult(data)
      setTimeout(() => setGenerateResult(null), 5000)
      loadDashboard()
      loadRecords()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to generate records')
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
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Salary Management</h1>
              <p className="text-white/90 text-sm">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        {dashboard && (
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
          <div className="flex gap-3 items-center flex-wrap">
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
            <button onClick={loadRecords} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Load Records
            </button>
            <button onClick={handleGenerateRecords} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Generate Monthly Salaries
            </button>
          </div>
          {generateResult && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ Created: {generateResult.created_count} | Skipped: {generateResult.skipped_count} | Total: {generateResult.total_staff}
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
                          <button onClick={() => setShowPayModal(record)} className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Pay
                          </button>
                        )}
                        <button onClick={() => viewQRCode(record.staff_id)} className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 flex items-center gap-1">
                          <QrCode className="w-4 h-4" />
                          QR
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
              <p className="text-gray-600 mb-4">
                Pay ₹{showPayModal.salary_amount} to Staff #{showPayModal.staff_id} for {showPayModal.month}/{showPayModal.year}?
              </p>
              <div className="flex gap-2">
                <button onClick={() => handlePaySalary(showPayModal.id, localStorage.getItem('username') || 'admin', 'Paid via admin')} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Confirm Payment
                </button>
                <button onClick={() => setShowPayModal(null)} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QR Modal */}
        {showQRModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Payment Information</h3>
              <div className="space-y-3">
                {showQRModal.upi_id && (
                  <div>
                    <p className="text-sm text-gray-600">UPI ID</p>
                    <p className="font-semibold">{showQRModal.upi_id}</p>
                  </div>
                )}
                {showQRModal.qr_code_path && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">QR Code</p>
                    <img src={`http://localhost:8000${showQRModal.qr_code_path}`} alt="QR Code" className="w-48 h-48 mx-auto" />
                  </div>
                )}
                {showQRModal.bank_account && (
                  <div>
                    <p className="text-sm text-gray-600">Bank Account</p>
                    <p className="font-semibold">{showQRModal.bank_account}</p>
                    <p className="text-sm text-gray-600">IFSC: {showQRModal.ifsc_code}</p>
                  </div>
                )}
              </div>
              <button onClick={() => setShowQRModal(null)} className="w-full mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default AdminSalaryManagement
