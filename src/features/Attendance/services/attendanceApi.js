import axios from './axios'

export const attendanceAPI = {
  // WiFi & Device
  setupWiFi: (data) => axios.post('/attendance/wifi/setup', data),
  registerDevice: (data) => axios.post('/attendance/device/register', data),
  getMyDevices: () => axios.get('/attendance/device/my-devices'),
  
  // Check-in/out
  wifiCheckIn: (data) => axios.post('/attendance/check-in/wifi', data),
  manualCheckIn: (data) => axios.post('/attendance/check-in/manual', data),
  selfCheckIn: (notes) => axios.post('/attendance/check-in/self', null, { params: { notes } }),
  checkOut: (data) => axios.post('/attendance/check-out', data),
  adminCheckOut: (staffId, data) => axios.post(`/attendance/check-out/staff/${staffId}`, data),
  
  // View
  getToday: (shopId) => axios.get(`/attendance/today?shop_id=${shopId}`),
  getSummary: (shopId) => axios.get(`/attendance/summary?shop_id=${shopId}`),
  getRecords: (shopId, staffId, fromDate, toDate) => axios.get('/attendance/records', { params: { shop_id: shopId, staff_id: staffId, from_date: fromDate, to_date: toDate } }),
  getMyAttendance: (fromDate, toDate) => axios.get(`/attendance/my-attendance?from_date=${fromDate}&to_date=${toDate}`),
  getMonthlyReport: (year, month, shopId) => axios.get(`/attendance/monthly-report/${year}/${month}?shop_id=${shopId}`),
  
  // Settings
  getSettings: (shopId) => axios.get(`/attendance/settings/${shopId}`),
  updateSettings: (shopId, data) => axios.put(`/attendance/settings/${shopId}`, data),
  
  // Leave
  requestLeave: (data) => axios.post('/attendance/leave/request', data),
  getMyLeaveRequests: () => axios.get('/attendance/leave/my-requests'),
  getPendingLeaves: (shopId) => axios.get(`/attendance/leave/pending?shop_id=${shopId}`),
  approveLeave: (id) => axios.put(`/attendance/leave/${id}/approve`),
  rejectLeave: (id, data) => axios.put(`/attendance/leave/${id}/reject`, data)
}
