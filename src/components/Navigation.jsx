import { Menu, Sun, Moon } from 'lucide-react'
import { useSidebar } from '../contexts/SidebarContext'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import Logo from './Logo'

const Navigation = () => {
  const { toggleSidebar } = useSidebar()
  const { logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const userType = localStorage.getItem('user_type')
  const userName = localStorage.getItem('user_name')
  const organizationId = localStorage.getItem('organization_id')
  const shopName = localStorage.getItem('shop_name')
  const shopInfo = JSON.parse(localStorage.getItem('shop_info') || '{}')

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: isDark ? 'rgba(1,12,26,0.6)' : 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(20px)',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(59,130,246,0.12)',
        transition: 'background 0.4s ease, border-color 0.4s ease',
      }}
    >
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg transition-colors"
              style={{
                color: isDark ? '#94a3b8' : '#64748b',
                background: 'transparent',
              }}
              onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.07)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Logo size={32} id="nav" />

            {userType === 'super_admin' && userName ? (
              <div className="px-3 py-1.5 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.08)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(59,130,246,0.15)' }}>
                <span className="text-sm font-medium" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{userName}</span>
              </div>
            ) : userType === 'admin' && organizationId ? (
              <h1 className="text-xl font-bold" style={{ color: isDark ? '#ffffff' : '#1e293b', transition: 'color 0.4s ease' }}>{organizationId}</h1>
            ) : userType === 'staff' && (shopName || shopInfo.shop_name) ? (
              <h1 className="text-xl font-bold" style={{ color: isDark ? '#ffffff' : '#1e293b', transition: 'color 0.4s ease' }}>
                {shopName || shopInfo.shop_name}
              </h1>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            {userType === 'admin' && userName && (
              <div className="px-3 py-1.5 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.08)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(59,130,246,0.15)' }}>
                <span className="text-sm font-medium" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{userName}</span>
              </div>
            )}
            {userType === 'staff' && userName && (
              <div className="px-3 py-1.5 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.08)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(59,130,246,0.15)' }}>
                <span className="text-sm font-medium" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{userName}</span>
              </div>
            )}
            {userType === 'super_admin' && (
              <div className="px-3 py-1.5 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.08)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(59,130,246,0.15)' }}>
                <span className="text-sm font-medium" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>Super Admin</span>
              </div>
            )}

            {/* Theme toggle — matches Welcome page style */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all"
              style={{
                background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.08)',
                border: isDark ? '1px solid rgba(255,255,255,0.13)' : '1px solid rgba(99,102,241,0.22)',
                transition: 'all 0.3s ease',
              }}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark
                ? <Sun className="w-3.5 h-3.5 text-amber-400" />
                : <Moon className="w-3.5 h-3.5 text-indigo-500" />
              }
              <span className="text-xs font-medium hidden sm:block" style={{ color: isDark ? '#fbbf24' : '#6366f1' }}>
                {isDark ? 'Light' : 'Dark'}
              </span>
            </button>

            <button
              onClick={logout}
              className="px-4 py-1.5 rounded-lg transition-colors text-sm font-medium"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: '#f87171',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.16)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
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
