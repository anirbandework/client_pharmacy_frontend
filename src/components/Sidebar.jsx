import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Package, ShoppingCart, Wallet, Settings, Clock, Shield, Bell, MessageCircle, Send, Receipt, UserCheck, Brain, BarChart3, LineChart, Building2, User } from 'lucide-react'
import { useSidebar } from '../contexts/SidebarContext'
import { useTheme } from '../contexts/ThemeContext'
import { feedbackAPI } from '../features/Feedback/services/feedbackApi'
import FeedbackFormModal from '../features/Feedback/components/FeedbackFormModal'
import axios from 'axios'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isOpen, closeSidebar } = useSidebar()
  const { isDark } = useTheme()
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
      const interval = setInterval(fetchUnreadCount, 300000)
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
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 z-40 transform transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: isDark ? 'rgba(10,20,46,0.85)' : 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(20px)',
          borderRight: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(59,130,246,0.12)',
          transition: 'background 0.4s ease, border-color 0.4s ease',
        }}
      >
        <div className="p-4 h-full flex flex-col">
          <nav className="space-y-2 flex-1">
            {loading ? (
              <div className="text-center py-4 text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                Loading...
              </div>
            ) : navItems.length === 0 ? (
              <div className="text-center py-4 text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                No modules available
              </div>
            ) : (
              <>
                {profileIncomplete && userType === 'distributor' && (
                  <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)' }}>
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
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.path)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                      style={isActive ? {
                        background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                        color: '#ffffff',
                        boxShadow: '0 4px 20px rgba(59,130,246,0.3)',
                      } : {
                        color: isDark ? '#94a3b8' : '#64748b',
                        background: 'transparent',
                      }}
                      onMouseEnter={e => {
                        if (!isActive) e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.07)'
                        if (!isActive) e.currentTarget.style.color = isDark ? '#ffffff' : '#1e293b'
                      }}
                      onMouseLeave={e => {
                        if (!isActive) e.currentTarget.style.background = 'transparent'
                        if (!isActive) e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'
                      }}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  )
                })}
              </>
            )}
          </nav>

          {showFeedback && (
            <div className="pt-4 space-y-2" style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(59,130,246,0.12)' }}>
              <button
                onClick={() => navigate('/my-feedback')}
                className="relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={{
                  background: isDark ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.07)',
                  border: isDark ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(139,92,246,0.2)',
                  color: '#a78bfa',
                }}
                onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.07)'}
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
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={{
                  background: isDark ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.07)',
                  border: isDark ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(139,92,246,0.2)',
                  color: '#a78bfa',
                }}
                onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.07)'}
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
          className="fixed inset-0 z-30 top-16"
          style={{ background: isDark ? 'rgba(1,12,26,0.5)' : 'rgba(15,23,42,0.2)', backdropFilter: 'blur(4px)' }}
        />
      )}

      <FeedbackFormModal isOpen={showFeedbackForm} onClose={() => setShowFeedbackForm(false)} />
    </>
  )
}

export default Sidebar
