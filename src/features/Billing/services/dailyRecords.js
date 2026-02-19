import axios from './axios'

export const dailyRecordsAPI = {
  // Get daily record for specific date
  getDailyRecord: (date) => axios.get(`/api/billing/daily-records/${date}`),
  
  // Get daily records for date range
  getDailyRecords: (startDate, endDate) => 
    axios.get('/api/billing/daily-records', { params: { start_date: startDate, end_date: endDate } }),
  
  // Create or update daily record
  createOrUpdateRecord: (data) => axios.post('/api/billing/daily-records', data),
  
  // Update daily record
  updateRecord: (date, data) => axios.put(`/api/billing/daily-records/${date}`, data),
  
  // Add expense
  addExpense: (date, expense) => axios.post(`/api/billing/daily-records/${date}/expenses`, expense),
  
  // Delete expense
  deleteExpense: (expenseId) => axios.delete(`/api/billing/daily-records/expenses/${expenseId}`),
  
  // Export to Excel
  exportExcel: (startDate, endDate) => 
    axios.get('/api/billing/daily-records/export/excel', { 
      params: { start_date: startDate, end_date: endDate },
      responseType: 'blob'
    })
}
