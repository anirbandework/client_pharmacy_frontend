import React from 'react'
import { Menu } from 'lucide-react'
import { useSidebar } from '../contexts/SidebarContext'
import { useAuth } from '../contexts/AuthContext'

const Navigation = () => {
  const { toggleSidebar } = useSidebar()
  const { logout } = useAuth()
  const userType = localStorage.getItem('user_type')
  const userName = localStorage.getItem('user_name')
  const organizationId = localStorage.getItem('organization_id')
  const shopName = localStorage.getItem('shop_name')
  const shopInfo = JSON.parse(localStorage.getItem('shop_info') || '{}')

  return (
    <nav className="fixed top-0 left-0 right-0 bg-slate-900/50 backdrop-blur-xl border-b border-white/10 text-white z-50">
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            {userType === 'super_admin' && userName ? (
              <div className="px-3 py-1.5 bg-slate-700/50 rounded-full">
                <span className="text-sm font-medium">{userName}</span>
              </div>
            ) : userType === 'admin' && organizationId ? (
              <h1 className="text-xl font-bold">{organizationId}</h1>
            ) : userType === 'staff' && (shopName || shopInfo.shop_name) ? (
              <h1 className="text-xl font-bold">
                {shopName || shopInfo.shop_name}
              </h1>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            {userType === 'admin' && userName && (
              <div className="px-3 py-1.5 bg-slate-700/50 rounded-full">
                <span className="text-sm font-medium">{userName}</span>
              </div>
            )}
            {userType === 'staff' && userName && (
              <div className="px-3 py-1.5 bg-slate-700/50 rounded-full">
                <span className="text-sm font-medium">{userName}</span>
              </div>
            )}
            {userType === 'super_admin' && (
              <div className="px-3 py-1.5 bg-slate-700/50 rounded-full">
                <span className="text-sm font-medium">Super Admin</span>
              </div>
            )}
            <button
              onClick={logout}
              className="px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation