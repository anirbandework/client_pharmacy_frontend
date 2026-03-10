import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FileText, Users, Package, ShoppingCart, Wallet, Settings, Clock, Shield, Bell, MessageCircle, Send, Receipt, UserCheck, TrendingUp, Brain, BarChart3, LineChart, Building2, Truck, User } from 'lucide-react'
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
  const [profileIncomplete, setProfileIncomplete] = useState(false)

  const showFeedback = userType === 'staff' || userType === 'admin'

  const iconMap = {
    Receipt, UserCheck, ShoppingCart, Package, Clock, Bell, Wallet, Settings, Shield, Brain, BarChart3, LineChart
  }

  const getIcon = (iconName) => iconMap[iconName] || Settings

  useEffect(() => {
    fetchPermissions()
    if (showFeedback) {
      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
    if (userType === 'distributor') {
      checkProfileCompletion()
    }
  }, [showFeedback, userType])

  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      
      if (userType === 'super_admin') {
        setNavItems([
          { id: 'super-admin-panel', label: 'Super Admin', path: '/super-admin', icon: Shield },
          { id: 'rbac', label: 'RBAC', path: '/rbac', icon: Shield },
          { id: 'feedback-management', label: 'Feedback', path: '/feedback-management', icon: Bell }
        ])
        setLoading(false)
        return
      }

      if (userType === 'distributor') {
        setNavItems([
          { id: 'shop-management', label: 'Shop Management', path: '/distributor', icon: Building2 },
          { id: 'profile', label: 'Profile', path: '/distributor/profile', icon: User }
        ])
        setLoading(false)
        return
      }

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

  const checkProfileCompletion = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/distributors/profile/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const profile = response.data
      const isIncomplete = !profile.email || !profile.address || !profile.city || !profile.state
      setProfileIncomplete(isIncomplete)
    } catch (error) {
      console.error('Failed to check profile:', error)
    }
  }

  return (
    <>
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 z-40 transform transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          <nav className="space-y-2 flex-1">
            {loading ? (
              <div className="text-center py-4 text-slate-400">Loading...</div>
            ) : navItems.length === 0 ? (
              <div className="text-center py-4 text-slate-400 text-sm">No modules available</div>
            ) : (
              <>
                {profileIncomplete && userType === 'distributor' && (
                  <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                    <div className="flex items-start gap-2">
                      <Bell className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <p className="text-xs font-semibold text-orange-400">Complete Your Profile</p>
                        <p className="text-xs text-orange-300 mt-1">Please fill in your email, address, and location details.</p>
                        <button
                          onClick={() => navigate('/distributor/profile')}
                          className="mt-2 text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg transition-colors"
                        >
                          Complete Now
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </>
            )}
          </nav>

          {showFeedback && (
            <div className="border-t border-slate-700/50 pt-4 space-y-2">
              <button
                onClick={() => navigate('/my-feedback')}
                className="relative w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">My Feedback</span>
                {unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowFeedbackForm(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition-all"
              >
                <Send className="w-5 h-5" />
                <span className="font-medium">Send Feedback</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 top-16"
        />
      )}

      <FeedbackFormModal isOpen={showFeedbackForm} onClose={() => setShowFeedbackForm(false)} />
    </>
  )
}

export default Sidebar