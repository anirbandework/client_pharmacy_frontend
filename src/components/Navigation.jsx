import React from 'react'
import { Menu } from 'lucide-react'
import { useSidebar } from '../contexts/SidebarContext'

const Navigation = () => {
  const { toggleSidebar } = useSidebar()

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
              Daily Records System
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-sm">
              <span className="text-sm font-medium">Admin</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation