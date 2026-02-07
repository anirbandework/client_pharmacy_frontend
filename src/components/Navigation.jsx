import React from 'react'
import { Menu } from 'lucide-react'
import { useSidebar } from '../contexts/SidebarContext'
import { useAuth } from '../contexts/AuthContext'

const Navigation = () => {
  const { toggleSidebar } = useSidebar()
  const { logout } = useAuth()
  const userType = localStorage.getItem('user_type')
  const shopName = localStorage.getItem('shop_name')

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-soft z-50 backdrop-blur-sm">
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold font-bauhaus animate-fade-in">
              Genericart
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-sm">
              <span className="text-sm font-medium">{userType === 'admin' ? 'Admin' : shopName || 'Staff'}</span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all duration-200 text-sm font-medium"
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