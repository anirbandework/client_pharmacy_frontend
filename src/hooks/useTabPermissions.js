import { useState, useEffect } from 'react'
import axiosInstance from '../features/RBAC/services/axios'

/**
 * Hook to get tab-level permissions for a module.
 * Returns isTabEnabled(tabKey) → true if the user can see that tab.
 * Defaults to true (visible) if no permission record exists — fully backwards compatible.
 *
 * Usage:
 *   const { isTabEnabled } = useTabPermissions('invoice_analytics')
 *   const visibleTabs = tabs.filter(t => isTabEnabled(t.id))
 */
const useTabPermissions = (moduleKey) => {
  const [tabPerms, setTabPerms] = useState(null) // null = not loaded yet
  const userType = localStorage.getItem('user_type')

  useEffect(() => {
    if (userType === 'super_admin') {
      setTabPerms({}) // super admin always sees everything
      return
    }

    const fetchPerms = async () => {
      try {
        const res = await axiosInstance.get('/api/rbac/my-permissions')
        const mod = (res.data.modules || []).find(m => m.module_key === moduleKey)
        setTabPerms(mod?.tab_permissions || {})
      } catch {
        setTabPerms({})
      }
    }

    fetchPerms()
  }, [moduleKey])

  const isTabEnabled = (tabKey) => {
    // While loading, show all tabs (no flash of missing content)
    if (tabPerms === null) return true
    // SuperAdmin always sees all tabs
    if (userType === 'super_admin') return true
    // If tab has no explicit record → default enabled
    if (tabPerms[tabKey] === undefined) return true
    return tabPerms[tabKey]
  }

  /**
   * Returns true if a tab is explicitly disabled (set to false) — meaning it requires payment/upgrade.
   * Returns false while loading, for super_admin, or if tab has no record (default allowed).
   */
  const isTabLocked = (tabKey) => {
    if (tabPerms === null) return false
    if (userType === 'super_admin') return false
    return tabPerms[tabKey] === false
  }

  const isLoaded = tabPerms !== null

  return { isTabEnabled, isTabLocked, isLoaded }
}

export default useTabPermissions
