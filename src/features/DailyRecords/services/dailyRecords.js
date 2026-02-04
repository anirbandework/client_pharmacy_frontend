import axiosInstance from './axios'

const API_BASE = '/api/daily-records'

export const dailyRecordsAPI = {
  create: (data) => axiosInstance.post(`${API_BASE}/`, data),
  getAll: (params) => axiosInstance.get(`${API_BASE}/`, { params }),
  update: (id, data) => axiosInstance.put(`${API_BASE}/${id}`, data),
  uploadExcel: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return axiosInstance.post(`${API_BASE}/import/excel`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  getModifications: (id) => axiosInstance.get(`${API_BASE}/${id}/modifications`)
}