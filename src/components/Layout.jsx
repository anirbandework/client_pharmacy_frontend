import Navigation from './Navigation'
import Sidebar from './Sidebar'
import { SidebarProvider } from '../contexts/SidebarContext'
import { useTheme } from '../contexts/ThemeContext'

const Layout = ({ children }) => {
  const { isDark } = useTheme()

  return (
    <SidebarProvider>
      <div
        className="fixed inset-0 overflow-y-auto"
        style={{
          background: isDark ? '#010c1a' : '#f0f6ff',
          transition: 'background 0.4s ease',
        }}
      >
        {/* Radial gradients */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: isDark
            ? 'radial-gradient(ellipse 90% 65% at 50% -10%, rgba(17,43,99,0.55) 0%, transparent 68%)'
            : 'radial-gradient(ellipse 90% 65% at 50% -10%, rgba(147,197,253,0.45) 0%, transparent 68%)',
          transition: 'background 0.4s ease',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: isDark
            ? 'radial-gradient(ellipse 60% 50% at 85% 90%, rgba(29,20,85,0.4) 0%, transparent 60%)'
            : 'radial-gradient(ellipse 60% 50% at 85% 90%, rgba(167,139,250,0.28) 0%, transparent 60%)',
          transition: 'background 0.4s ease',
        }} />

        {/* Fine grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: isDark
            ? 'linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)'
            : 'linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          transition: 'background-image 0.4s ease',
        }} />

        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-0 right-1/4 w-96 h-96 rounded-full animate-pulse"
            style={{
              background: isDark
                ? 'radial-gradient(circle, rgba(59,130,246,0.13) 0%, transparent 68%)'
                : 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 68%)',
              filter: 'blur(45px)',
              transition: 'background 0.4s ease',
            }}
          />
          <div
            className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full animate-pulse"
            style={{
              background: isDark
                ? 'radial-gradient(circle, rgba(99,102,241,0.11) 0%, transparent 68%)'
                : 'radial-gradient(circle, rgba(99,102,241,0.16) 0%, transparent 68%)',
              filter: 'blur(55px)',
              animationDelay: '1s',
              transition: 'background 0.4s ease',
            }}
          />
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          <Navigation />
          <Sidebar />
          <main className="flex-1 pt-16 transition-all duration-300">
            <div className="p-4">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default Layout
