import axiosInstance from './axios'

const API_BASE = '/api/invoices'

export const invoiceAPI = {
  // CRUD Operations
  create: (data, shopId) => axiosInstance.post(`${API_BASE}/`, data, { params: { shop_id: shopId } }),
  getMonthly: (year, month, shopId) => axiosInstance.get(`${API_BASE}/monthly/${year}/${month}`, { params: { shop_id: shopId } }),
  getById: (id) => axiosInstance.get(`${API_BASE}/${id}`),
  recordSale: (data) => axiosInstance.post(`${API_BASE}/sales`, data),
  
  // Expiry Management
  getExpiryAlerts: (daysAhead = 45, shopId) => axiosInstance.get(`${API_BASE}/expiry/alerts`, { params: { days_ahead: daysAhead, shop_id: shopId } }),
  acknowledgeAlert: (alertId, acknowledgedBy) => axiosInstance.put(`${API_BASE}/expiry/alerts/${alertId}/acknowledge`, null, { params: { acknowledged_by: acknowledgedBy } }),
  
  // Analytics
  getMonthlyAnalytics: (year, month, shopId) => axiosInstance.get(`${API_BASE}/analytics/${year}/${month}`, { params: { shop_id: shopId } }),
  getMonthlySummary: (year, month, shopId) => axiosInstance.get(`${API_BASE}/analytics/monthly-summary/${year}/${month}`, { params: { shop_id: shopId } }),
  
  // AI Analytics
  getAIComprehensive: (shopId) => axiosInstance.get(`${API_BASE}/ai-analytics/comprehensive`, { params: { shop_id: shopId } }),
  analyzeItemMovement: (itemCode, shopId) => axiosInstance.get(`${API_BASE}/ai-analytics/item-movement/${itemCode}`, { params: { shop_id: shopId } }),
  getStockPredictions: (monthsAhead = 3, shopId) => axiosInstance.get(`${API_BASE}/ai-analytics/stock-predictions`, { params: { months_ahead: monthsAhead, shop_id: shopId } }),
  getSmartExpiryAnalysis: (itemCode, shopId) => axiosInstance.get(`${API_BASE}/ai-analytics/smart-alerts/${itemCode}`, { params: { shop_id: shopId } }),
  
  // Dashboard
  getDashboard: (shopId) => axiosInstance.get(`${API_BASE}/dashboard`, { params: { shop_id: shopId } }),
  getSlowMovingItems: (threshold = 1, shopId) => axiosInstance.get(`${API_BASE}/items/slow-moving`, { params: { threshold, shop_id: shopId } }),
  getExpiringItems: (days = 45, shopId) => axiosInstance.get(`${API_BASE}/items/expiring-soon`, { params: { days, shop_id: shopId } }),
  
  // WINGS Integration
  importPurchaseFromWings: (data, shopId) => axiosInstance.post(`${API_BASE}/wings/import-purchase`, data, { params: { shop_id: shopId } }),
  importSalesFromWings: (data) => axiosInstance.post(`${API_BASE}/wings/import-sales`, data),
  syncWithWingsLive: (wingsApiEndpoint, shopCode) => axiosInstance.post(`${API_BASE}/wings/sync-live`, null, { params: { wings_api_endpoint: wingsApiEndpoint, shop_code: shopCode } })
}
