import axios from './axios'

export const attendanceAPI = {
  // WiFi Heartbeat (Staff only)
  wifiHeartbeat: (data) => axios.post('/attendance/wifi/heartbeat', data),
  wifiDisconnect: () => axios.post('/attendance/wifi/disconnect'),
  getWiFiStatus: () => axios.get('/attendance/wifi/status'),
  
  // WiFi Setup (Admin only)
  setupWiFi: (shopCode, data) => axios.post(`/attendance/wifi/setup?shop_code=${shopCode}`, data),
  getWifiInfo: (shopCode = null) => axios.get('/attendance/wifi/info' + (shopCode ? `?shop_code=${shopCode}` : '')),
  getConnectedStaff: (shopCode) => axios.get(`/attendance/wifi/connected-staff?shop_code=${shopCode}`),
  
  // Device Management (Staff only)
  registerDevice: (data) => axios.post('/attendance/device/register', data),
  getMyDevices: () => axios.get('/attendance/device/my-devices'),
  
  // Viewing (Admin needs shop_code, Staff doesn't)
  getToday: (shopCode = null) => axios.get('/attendance/today' + (shopCode ? `?shop_code=${shopCode}` : '')),
  getSummary: (shopCode) => axios.get(`/attendance/summary?shop_code=${shopCode}`),
  getRecords: (shopCode = null, staffId, fromDate, toDate) => {
    const params = new URLSearchParams()
    if (shopCode) params.append('shop_code', shopCode)
    if (staffId) params.append('staff_id', staffId)
    if (fromDate) params.append('from_date', fromDate)
    if (toDate) params.append('to_date', toDate)
    return axios.get(`/attendance/records?${params.toString()}`)
  },
  getMyAttendance: (fromDate, toDate) => {
    const params = new URLSearchParams()
    if (fromDate) params.append('from_date', fromDate)
    if (toDate) params.append('to_date', toDate)
    return axios.get(`/attendance/my-attendance?${params.toString()}`)
  },
  getMonthlyReport: (year, month, shopCode) => axios.get(`/attendance/monthly-report/${year}/${month}?shop_code=${shopCode}`),
  
  // Settings
  getSettings: (shopCode = null) => axios.get('/attendance/settings' + (shopCode ? `?shop_code=${shopCode}` : '')),
  updateSettings: (shopCode, data) => axios.put(`/attendance/settings?shop_code=${shopCode}`, data),
  
  // Leave Management
  requestLeave: (data) => axios.post('/attendance/leave/request', data),
  getMyLeaveRequests: () => axios.get('/attendance/leave/my-requests'),
  getAllLeaves: (shopCode, staffId, status) => {
    const params = new URLSearchParams()
    params.append('shop_code', shopCode)
    if (staffId) params.append('staff_id', staffId)
    if (status) params.append('status', status)
    return axios.get(`/attendance/leave/all?${params.toString()}`)
  },
  getPendingLeaves: (shopCode) => axios.get(`/attendance/leave/pending?shop_code=${shopCode}`),
  approveLeave: (id, shopCode) => axios.put(`/attendance/leave/${id}/approve?shop_code=${shopCode}`),
  rejectLeave: (id, shopCode, data) => axios.put(`/attendance/leave/${id}/reject?shop_code=${shopCode}`, data)
}
