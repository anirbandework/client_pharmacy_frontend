import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FileText, Users, Package, ShoppingCart, Wallet, Settings, Clock, Shield, Bell, MessageCircle, Send, Receipt, UserCheck, TrendingUp } from 'lucide-react'
import { useSidebar } from '../contexts/SidebarContext'
import { feedbackAPI } from '../features/Feedback/services/feedbackApi'
import FeedbackFormModal from '../features/Feedback/components/FeedbackFormModal'
import axios from 'axios'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isOpen, closeSidebar } = useSidebar()
  const userType = localStorage.getItem('user_type')
  const [unreadCount, setUnreadCount] = useState(0)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [navItems, setNavItems] = useState([])
  const [loading, setLoading] = useState(true)

  const showFeedback = userType === 'staff' || userType === 'admin'

  // Icon mapping from backend icon names to Lucide components
  const iconMap = {
    Receipt, UserCheck, ShoppingCart, Package, Clock, Bell, Wallet, Settings, Shield
  }

  const getIcon = (iconName) => iconMap[iconName] || Settings

  useEffect(() => {
    fetchPermissions()
    if (showFeedback) {
      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [showFeedback])

  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      
      // SuperAdmin gets hardcoded items
      if (userType === 'super_admin') {
        setNavItems([
          { id: 'super-admin-panel', label: 'Super Admin', path: '/super-admin', icon: Shield },
          { id: 'rbac', label: 'RBAC', path: '/rbac', icon: Shield },
          { id: 'feedback-management', label: 'Feedback', path: '/feedback-management', icon: Bell }
        ])
        setLoading(false)
        return
      }

      // Fetch RBAC permissions for admin/staff
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rbac/my-permissions`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const modules = response.data.modules || []
      const items = modules.map(m => ({
        id: m.module_key,
        label: m.module_name,
        path: m.path,
        icon: getIcon(m.icon)
      }))

      setNavItems(items)
    } catch (error) {
      console.error('Failed to fetch permissions:', error)
      // Fallback to empty on error
      setNavItems([])
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const res = await feedbackAPI.getUnreadCount()
      setUnreadCount(res.data.unread_responses)
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-glow border-r border-primary-100 z-40 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          <nav className="space-y-2 flex-1">
            {loading ? (
              <div className="text-center py-4 text-gray-500">Loading...</div>
            ) : navItems.length === 0 ? (
              <div className="text-center py-4 text-gray-500 text-sm">No modules available</div>
            ) : (
              navItems.map((item) => (
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
              ))
            )}
          </nav>

          {showFeedback && (
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <button
                onClick={() => navigate('/my-feedback')}
                className="relative w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">My Feedback</span>
                {unreadCount > 0 && (
                  <span className="ml-auto bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowFeedbackForm(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200 transition-all"
              >
                <Send className="w-5 h-5" />
                <span className="font-medium">Send Feedback</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-primary-900/20 backdrop-blur-sm z-30 top-16 animate-fade-in"
        />
      )}

      {/* Feedback Form Modal */}
      <FeedbackFormModal isOpen={showFeedbackForm} onClose={() => setShowFeedbackForm(false)} />
    </>
  )
}

export default Sidebar