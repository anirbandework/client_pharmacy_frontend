import { useEffect, useState } from 'react'
import { Lock, Crown, Star } from 'lucide-react'
import axiosInstance from '../features/RBAC/services/axios'

/**
 * LockedModuleGuard
 *
 * Wraps a page's content. If the module is locked for the user's org
 * (returned as locked:true from /api/rbac/my-permissions), renders a
 * full-page upgrade card instead of children.
 *
 * Props:
 *   moduleKey   — RBAC module key e.g. 'invoice_analytics'
 *   moduleName  — Display name shown in the card e.g. 'Invoice Analytics'
 *   moduleIcon  — Lucide icon component to show in the card
 */
const LockedModuleGuard = ({ moduleKey, moduleName, moduleIcon: ModuleIcon, children }) => {
  const [locked, setLocked] = useState(null) // null = loading
  const userType = localStorage.getItem('user_type')

  useEffect(() => {
    if (userType === 'super_admin') {
      setLocked(false)
      return
    }

    axiosInstance.get('/api/rbac/my-permissions')
      .then(res => {
        const mod = (res.data.modules || []).find(m => m.module_key === moduleKey)
        setLocked(mod?.locked === true)
      })
      .catch(() => setLocked(false)) // on error, don't block access
  }, [moduleKey])

  // Still loading — render nothing (page header already visible)
  if (locked === null) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
    </div>
  )

  // Not locked — render page normally
  if (!locked) return <>{children}</>

  // Locked — show upgrade card
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] px-4 py-10">
      <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-2xl p-10 text-center w-full max-w-md">

        {/* Lock + crown icon */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
              <Lock className="w-9 h-9 text-indigo-600" />
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center shadow">
              <Crown className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-1">Premium Feature</h2>

        {/* Module name with icon */}
        <p className="text-sm font-semibold text-indigo-600 mb-4 flex items-center justify-center gap-2">
          {ModuleIcon && <ModuleIcon className="w-4 h-4" />}
          {moduleName}
        </p>

        <p className="text-sm text-gray-500 mb-7 leading-relaxed">
          This module is not included in your current plan. Upgrade to unlock{' '}
          <strong className="text-gray-700">{moduleName}</strong> and get access to powerful analytics & tools.
        </p>

        {/* Feature bullets */}
        <div className="bg-indigo-50 rounded-xl p-5 mb-7 text-left space-y-3">
          {[
            'Full access to all premium modules',
            'Priority support & updates',
            'Advanced analytics & AI insights',
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm text-indigo-700">
              <Star className="w-4 h-4 text-amber-400 flex-shrink-0" fill="currentColor" />
              {f}
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 leading-relaxed">
          Contact your administrator or reach out to us to upgrade your plan.
        </p>
      </div>
    </div>
  )
}

export default LockedModuleGuard
