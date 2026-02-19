import axios from './axios'

export const analyticsAPI = {
  getOverview: (days) => axios.get('/api/billing/analytics/overview', { params: { days } }),
  getComparison: (days) => axios.get('/api/billing/analytics/comparison', { params: { current_days: days } })
}
