import React, { useState, useEffect } from 'react'
import { rbacAPI } from '../services/rbacApi'
import toast from 'react-hot-toast'
import { Shield, Users, RefreshCw, Search, CheckCircle, XCircle, ChevronDown, ChevronUp, Layers } from 'lucide-react'

const OrganizationPermissions = () => {
  const [organizations, setOrganizations] = useState([])
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedTabs, setExpandedTabs] = useState(new Set()) // module_keys with tabs panel open
  const [moduleTabs, setModuleTabs] = useState({}) // { module_key: [{tab_key, tab_label, enabled}] }
  const [tabsLoading, setTabsLoading] = useState(new Set())

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    try {
      const response = await rbacAPI.getOrganizations()
      setOrganizations(response.data.organizations || [])
    } catch (error) {
      toast.error('Failed to load organizations')
    }
  }

  const fetchModulesAndPermissions = async (orgId) => {
    setLoading(true)
    try {
      const permissionsRes = await rbacAPI.getOrganizationPermissions(orgId)
      setPermissions(permissionsRes.data.permissions || [])
    } catch (error) {
      toast.error('Failed to load permissions')
    } finally {
      setLoading(false)
    }
  }

  const handleOrgSelect = (org) => {
    setSelectedOrg(org)
    fetchModulesAndPermissions(org.id)
  }

  const getPermission = (moduleKey) => {
    return permissions.find(p => p.module_key === moduleKey) || {}
  }

  const togglePermission = async (moduleKey, field) => {
    const perm = getPermission(moduleKey)
    const currentValue = perm[field] === true
    const newValue = !currentValue
    
    try {
      await rbacAPI.updateModulePermission(selectedOrg.id, moduleKey, {
        [field]: newValue
      })
      
      setPermissions(prev => 
        prev.map(p => p.module_key === moduleKey ? { ...p, [field]: newValue } : p)
      )
      
      toast.success('Permission updated')
    } catch (error) {
      toast.error('Failed to update permission')
    }
  }

  const handleResetDefaults = async () => {
    if (!confirm('Reset all permissions to defaults? This will enable all modules.')) return
    
    try {
      await rbacAPI.resetToDefaults(selectedOrg.id)
      await fetchModulesAndPermissions(selectedOrg.id)
      toast.success('Permissions reset to defaults')
    } catch (error) {
      toast.error('Failed to reset permissions')
    }
  }

  const toggleTabsPanel = async (moduleKey) => {
    const next = new Set(expandedTabs)
    if (next.has(moduleKey)) {
      next.delete(moduleKey)
      setExpandedTabs(next)
      return
    }
    next.add(moduleKey)
    setExpandedTabs(next)

    // Fetch tabs only if not already loaded
    if (moduleTabs[moduleKey]) return

    setTabsLoading(prev => new Set(prev).add(moduleKey))
    try {
      const res = await rbacAPI.getModuleTabs(selectedOrg.id, moduleKey)
      setModuleTabs(prev => ({ ...prev, [moduleKey]: res.data.tabs }))
    } catch {
      toast.error('Failed to load tab permissions')
    } finally {
      setTabsLoading(prev => { const s = new Set(prev); s.delete(moduleKey); return s })
    }
  }

  const toggleTab = async (moduleKey, tabKey, currentEnabled) => {
    try {
      await rbacAPI.updateTabPermission(selectedOrg.id, moduleKey, tabKey, !currentEnabled)
      setModuleTabs(prev => ({
        ...prev,
        [moduleKey]: prev[moduleKey].map(t => t.tab_key === tabKey ? { ...t, enabled: !currentEnabled } : t)
      }))
      toast.success('Tab permission updated')
    } catch {
      toast.error('Failed to update tab permission')
    }
  }

  // Modules that have configurable tabs
  const TABBED_MODULES = new Set([
    'purchase_invoice',
    'invoice_analytics',
    'stock_analytics',
    'stock_audit',
    'my_salary',
    'salary_management',
    'attendance_staff',
    'attendance_admin',
    'my_notifications',
    'notifications_admin',
    'billing',
    'billing_analytics',
  ])

  const filteredModules = permissions.filter(p =>
    p.module_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.module_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Separate modules by role - based on backend default settings
  const staffOnlyModules = ['billing', 'customer_tracking', 'purchase_invoice', 'stock_audit', 'attendance_staff', 'my_notifications', 'my_salary']
  const adminOnlyModules = ['admin_panel', 'attendance_admin', 'notifications_admin', 'salary_management', 'invoice_analytics', 'stock_analytics', 'billing_analytics']
  
  const staffModules = filteredModules.filter(m => staffOnlyModules.includes(m.module_key))
  const adminModules = filteredModules.filter(m => adminOnlyModules.includes(m.module_key))

  return (
    <div className="space-y-6">
      {/* Organization Selector */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Select Organization</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {organizations.map(org => (
            <button
              key={org.id}
              onClick={() => handleOrgSelect(org)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedOrg?.id === org.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300 bg-white'
              }`}
            >
              <div className="font-semibold text-gray-900">{org.name}</div>
              <div className="text-sm text-gray-500">{org.shops_count || 0} shops</div>
            </button>
          ))}
        </div>
      </div>

      {/* Permissions Management */}
      {selectedOrg && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary-600" />
                  Module Permissions - {selectedOrg.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">Configure module access for admins and staff</p>
              </div>
              <button
                onClick={handleResetDefaults}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reset to Defaults
              </button>
            </div>

            {/* Search */}
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading permissions...</div>
          ) : (
            <div className="p-6 space-y-8">
              {/* Staff Modules Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-blue-500 rounded"></div>
                  <h3 className="text-lg font-bold text-gray-900">Staff Modules</h3>
                  <span className="text-sm text-gray-500">({staffModules.length})</span>
                </div>
                <div className="space-y-3">
                  {staffModules.map(module => {
                    const staffEnabled = module.staff_enabled === true
                    const hasTabConfig = TABBED_MODULES.has(module.module_key)
                    const tabsOpen = expandedTabs.has(module.module_key)
                    const tabs = moduleTabs[module.module_key] || []
                    const loadingTabs = tabsLoading.has(module.module_key)

                    return (
                      <div key={module.module_key} className="bg-blue-50 rounded-lg border border-blue-200 overflow-hidden">
                        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{module.module_name}</h3>
                            <p className="text-xs text-gray-500 mt-1">Module: {module.module_key}</p>
                          </div>

                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => togglePermission(module.module_key, 'staff_enabled')}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${staffEnabled ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                            >
                              {staffEnabled ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                              <span className="text-sm font-medium">Staff</span>
                            </button>
                            {hasTabConfig && (
                              <button
                                onClick={() => toggleTabsPanel(module.module_key)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all"
                              >
                                <Layers className="w-4 h-4" />
                                <span className="text-sm font-medium">Tabs</span>
                                {tabsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            )}
                          </div>
                        </div>

                        {tabsOpen && (
                          <div className="border-t border-blue-200 bg-white px-4 py-3">
                            {loadingTabs ? (
                              <p className="text-sm text-gray-500 py-2">Loading tabs...</p>
                            ) : (
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {tabs.map(tab => (
                                  <button
                                    key={tab.tab_key}
                                    onClick={() => toggleTab(module.module_key, tab.tab_key, tab.enabled)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border ${tab.enabled ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                                  >
                                    {tab.enabled ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> : <XCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                                    <span className="truncate">{tab.tab_label}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {staffModules.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">No staff modules found</div>
                  )}
                </div>
              </div>

              {/* Admin Modules Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-green-500 rounded"></div>
                  <h3 className="text-lg font-bold text-gray-900">Admin Modules</h3>
                  <span className="text-sm text-gray-500">({adminModules.length})</span>
                </div>
                <div className="space-y-3">
                  {adminModules.map(module => {
                    const adminEnabled = module.admin_enabled === true
                    const hasTabConfig = TABBED_MODULES.has(module.module_key)
                    const tabsOpen = expandedTabs.has(module.module_key)
                    const tabs = moduleTabs[module.module_key] || []
                    const loadingTabs = tabsLoading.has(module.module_key)

                    return (
                      <div key={module.module_key} className="bg-green-50 rounded-lg border border-green-200 overflow-hidden">
                        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{module.module_name}</h3>
                            <p className="text-xs text-gray-500 mt-1">Module: {module.module_key}</p>
                          </div>

                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => togglePermission(module.module_key, 'admin_enabled')}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${adminEnabled ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                            >
                              {adminEnabled ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                              <span className="text-sm font-medium">Admin</span>
                            </button>
                            {hasTabConfig && (
                              <button
                                onClick={() => toggleTabsPanel(module.module_key)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all"
                              >
                                <Layers className="w-4 h-4" />
                                <span className="text-sm font-medium">Tabs</span>
                                {tabsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            )}
                          </div>
                        </div>

                        {tabsOpen && (
                          <div className="border-t border-green-200 bg-white px-4 py-3">
                            {loadingTabs ? (
                              <p className="text-sm text-gray-500 py-2">Loading tabs...</p>
                            ) : (
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {tabs.map(tab => (
                                  <button
                                    key={tab.tab_key}
                                    onClick={() => toggleTab(module.module_key, tab.tab_key, tab.enabled)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border ${tab.enabled ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                                  >
                                    {tab.enabled ? <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" /> : <XCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                                    <span className="truncate">{tab.tab_label}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {adminModules.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">No admin modules found</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OrganizationPermissions
