import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FileText, Users, Package } from 'lucide-react'
import { useSidebar } from '../contexts/SidebarContext'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isOpen, closeSidebar } = useSidebar()

  const navItems = [
    { id: 'daily-records', label: 'Daily Records', path: '/daily-records', icon: FileText },
    { id: 'customer-tracking', label: 'Customer Tracking', path: '/customer-tracking', icon: Users },
    { id: 'stock-audit', label: 'Stock Audit', path: '/stock-audit', icon: Package }
  ]

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-glow border-r border-primary-100 z-40 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-primary-900/20 backdrop-blur-sm z-30 top-16 animate-fade-in"
        />
      )}
    </>
  )
}

export default Sidebar