import axiosInstance from './axios'

const API_BASE = '/api/rbac'

export const rbacAPI = {
  // Get current user's accessible modules
  getMyPermissions: () => axiosInstance.get(`${API_BASE}/my-permissions`),
  
  // SuperAdmin: Get all organizations
  getOrganizations: () => axiosInstance.get('/api/auth/super-admin/organizations'),
  
  // SuperAdmin: Get organization permissions
  getOrganizationPermissions: (orgId) => 
    axiosInstance.get(`${API_BASE}/organization/${orgId}/permissions`),
  
  // SuperAdmin: Update module permission for organization
  updateModulePermission: (orgId, moduleKey, data) => 
    axiosInstance.put(`${API_BASE}/organization/${orgId}/module/${moduleKey}`, data),
  
  // SuperAdmin: Reset organization to defaults
  resetToDefaults: (orgId) => 
    axiosInstance.post(`${API_BASE}/organization/${orgId}/reset-defaults`)
}
